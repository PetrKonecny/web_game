var armyControllers = angular.module('armyControllers', []);
armyControllers
        .controller('ArmyListCtrl', ['$scope', 'Army',
            function ($scope, Army) {
                $scope.armies = Army.query();
            }])
        .controller('ArmyShowCtrl', ['$scope', 'Army', '$routeParams',
            function ($scope, Army, $routeParams) {
                $scope.army = Army.get({id: $routeParams.id});
                $scope.$on('player:updated', function (event, data) {
                    Army.get({id: $routeParams.id}).$promise.then(function (data) {
                        $scope.army = data;
                    });
                });
            }])
        .controller('ArmyMainCtrl', ['$scope', 'Army', 'Unit', 'Position', 'Resource', '$routeParams', 'PlayerData', '$location', '$http',
            function ($scope, Army, Unit, Position, Resource, $routeParams, PlayerData, $location, $http) {
                $scope.army = Army.get({id: $routeParams.id});
                $scope.tabs = ['full', 'fight', 'buy', 'move'];
                $scope.selection = $scope.tabs[0];

                $scope.selectFight = function () {
                    $('#armyDetail').addClass('col-md-6');
                    $scope.armies = Army.query();
                    $scope.selection = $scope.tabs[1]
                }
                $scope.selectBuy = function () {
                    $('#armyDetail').addClass('col-md-6');
                    $scope.count = 1;
                    $scope.$on('player:updated', function (event, data) {
                        matchCityAndGetResources(data)
                    });
                    PlayerData.broadcastData();
                    var initialResources;

                    function matchCityAndGetResources(data) {
                        $scope.resourceId = getCityForPosition(data.cities, $scope.army).resource_id;
                        Resource.get({id: $scope.resourceId}).$promise.then(function (data) {
                            $scope.resource = data;
                            initialResources = JSON.parse(JSON.stringify(data));
                        }
                        );
                    }

                    Position.getAvailableUnits({id: $scope.army.position_id, action: 'availableUnits'}).$promise.then(
                            function (data) {
                                $scope.unitsToBuy = data;
                                for (i = 0; i < $scope.unitsToBuy.length; i++) {
                                    $scope.unitsToBuy[i].countToBuy = 0;
                                    $scope.$watch("unitsToBuy[" + i + "].countToBuy", function () {
                                        substractResource($scope.resource, initialResources, getTotalPrice($scope.unitsToBuy));
                                    });
                                }

                            }
                    );
                    $scope.selection = $scope.tabs[2]
                }

                $scope.selectMove = function () {
                    $('#armyDetail').addClass('col-md-6');
                    $scope.armies = Army.query();
                    $scope.selection = $scope.tabs[3]
                }

                $scope.clickedBuy = function () {
                    $scope.disableButton = true;
                    var unitsToBuy = new Array();
                    var army = angular.copy($scope.army);
                    for (i = 0; i < $scope.unitsToBuy.length; i++) {
                        if ($scope.unitsToBuy[i].countToBuy != 0) {
                            unitsToBuy.push($scope.unitsToBuy[i]);
                        }
                    }

                    for (i = 0; i < unitsToBuy.length; i++) {
                        addUnitToArmy(unitsToBuy[i], army);
                    }

                    army.$buyUnits({id: $scope.army.Id, action: 'buyUnits'}, function (data) {
                        $scope.disableButton = false;
                        $scope.resource = Resource.get({id: $scope.resourceId});
                        $scope.army = army;
                        PlayerData.broadcastData();
                    });
                };

                function addUnitToArmy(unit, army) {
                    for (j = 0; j < army.units.length; j++) {
                        if (unit.Id === army.units[j].Id) {
                            army.units[j].pivot.Unit_count += unit.countToBuy;
                            return;
                        }
                    }

                    unit.pivot = new Object();
                    unit.pivot.Unit_count = unit.countToBuy;
                    unit.pivot.Army_id = army.Id;
                    unit.pivot.Unit_id = unit.Id;
                    army.units.push(unit);
                }

                $scope.clickedAttack = function ($id) {
                    $http.get('http://94.112.69.214:8080/armies/51/fight', {params: {"target": $id}})
                            .success(function ($data) {
                                SharedData.set($data);
                                $location.path('armies/result');
                            });
                }

                $scope.getCeiling = function (unit) {
                    if ($scope.resource == null || unit == null)
                        return;

                    var result = new Array();
                    var array = ['gold', 'food', 'silver', 'platinum', 'stone', 'wood'];
                    for (i = 0; i < array.length; i++) {
                        if (unit.resource[array[i]] != 0) {
                            result.push(Math.round($scope.resource[array[i]] / unit.resource[array[i]]));
                        }
                    }
                    return Math.min.apply(null, result) + unit.countToBuy;
                }

                function getCityForPosition(cities, army) {
                    if (cities == null || army == null)
                        return;
                    for (i = 0; i < cities.length; i++) {
                        if (cities[i].position.x == army.position.x &&
                                cities[i].position.y == army.position.y) {
                            return cities[i];
                        }
                    }
                    return null;
                }

                function getTotalPrice(units) {
                    if (units == null)
                        return;
                    var result = new Object();
                    result.food = 0;
                    result.wood = 0;
                    result.platinum = 0;
                    result.stone = 0;
                    result.gold = 0;
                    result.silver = 0;
                    for (i = 0; i < units.length; i++) {
                        result.food += units[i].resource.food * units[i].countToBuy;
                        result.gold += units[i].resource.gold * units[i].countToBuy;
                        result.platinum += units[i].resource.platinum * units[i].countToBuy;
                        result.silver += units[i].resource.silver * units[i].countToBuy;
                        result.wood += units[i].resource.wood * units[i].countToBuy;
                        result.stone += units[i].resource.stone * units[i].countToBuy;
                    }
                    return result;
                }

                function substractResource(result, resource1, resource2) {
                    if (result === null || resource1 === null || resource2 === null)
                        return;
                    var array = ['gold', 'food', 'silver', 'platinum', 'stone', 'wood'];
                    for (i = 0; i < array.length; i++) {
                        result[array[i]] = resource1[array[i]] - resource2[array[i]];

                    }
                }
            }])
        .controller('BattleResultCtrl', ['$scope', 'SharedData',
            function ($scope, SharedData) {
                $scope.data = SharedData.get();
                $scope.army = $scope.data.target;
                $scope.targetBefore = $scope.data.targetBefore;
                $scope.army2 = $scope.data.subject;
                $scope.subjectBefore = $scope.data.subjectBefore;
                $scope.getLostCount = function ($id, $units) {
                    var result = $units.filter(function (obj) {
                        return obj.Id == $id;
                    });
                    return result[0].pivot.Unit_count;
                }
            }]);