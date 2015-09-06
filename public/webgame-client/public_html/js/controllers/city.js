var cityControllers = angular.module('cityControllers', []);
cityControllers
        .controller('CityListCtrl', ['$scope', 'City',
            function ($scope, City) {
                $scope.cities = City.query();
            }])
        .controller('CityShowCtrl', ['$scope', 'City', 'Building', '$routeParams', '$interval', 'Population',
            function ($scope, City, Building, $routeParams, $interval, Population) {
                this.getCity = function () {
                    City.get({id: $routeParams.id}).$promise.then(
                            function (value) {
                                $scope.city = value;
                                $scope.buildings = value.buildings;
                                $scope.getPopulation();
                            }
                    )
                };

                $scope.getPopulation = function () {
                    $scope.population = Population.get({id: $routeParams.id});
                };

                $scope.tabs = ['full', 'build', 'resources'];
                $scope.selection = $scope.tabs[0];

                /*
                 $interval(function () {
                 this.getCity();
                 }.bind(this), 10000);*/

                this.getCity();

                $scope.selectBuild = function () {
                    $('#cityDetail').addClass('col-md-6');
                    $scope.buildingsToBuild = Building.query();
                    $scope.selection = $scope.tabs[1]
                }

                $scope.clickedBuild = function ($id) {
                    $scope.disableButton = true;
                    var result = $scope.buildingsToBuild.filter(function (obj) {
                        return obj.Id == $id;
                    });
                    var input = angular.copy($scope.city);
                    input.buildings.push(result[0]);
                    input.$update(function (data) {
                        $scope.city = data;
                        $scope.buildings = data.buildings;
                        $scope.disableButton = false;
                    });
                }

                $scope.selectResources = function () {
                    $('#cityDetail').addClass('col-md-6');

                    $scope.selection = $scope.tabs[2];

                    $scope.$watch("population.gold", function () {
                        $scope.woodMax = $scope.population.wood + $scope.getUnemployed();
                        $scope.stoneMax = $scope.population.stone + $scope.getUnemployed();
                        $scope.foodMax = $scope.population.food + $scope.getUnemployed();
                        $scope.platMax = $scope.population.platinum + $scope.getUnemployed();
                        $scope.silverMax = $scope.population.silver + $scope.getUnemployed();
                    });

                    $scope.$watch("population.wood", function () {
                        $scope.goldMax = $scope.population.gold + $scope.getUnemployed();
                        $scope.stoneMax = $scope.population.stone + $scope.getUnemployed();
                        $scope.foodMax = $scope.population.food + $scope.getUnemployed();
                        $scope.platMax = $scope.population.platinum + $scope.getUnemployed();
                        $scope.silverMax = $scope.population.silver + $scope.getUnemployed();
                    });

                    $scope.$watch("population.stone", function () {
                        $scope.woodMax = $scope.population.wood + $scope.getUnemployed();
                        $scope.foodMax = $scope.population.food + $scope.getUnemployed();
                        $scope.goldMax = $scope.population.gold + $scope.getUnemployed();
                        $scope.platMax = $scope.population.platinum + $scope.getUnemployed();
                        $scope.silverMax = $scope.population.silver + $scope.getUnemployed();
                    });

                    $scope.$watch("population.food", function () {
                        $scope.woodMax = $scope.population.wood + $scope.getUnemployed();
                        $scope.stoneMax = $scope.population.stone + $scope.getUnemployed();
                        $scope.goldMax = $scope.population.gold + $scope.getUnemployed();
                        $scope.platMax = $scope.population.platinum + $scope.getUnemployed();
                        $scope.silverMax = $scope.population.silver + $scope.getUnemployed();
                    });

                    $scope.$watch("population.silver", function () {
                        $scope.woodMax = $scope.population.wood + $scope.getUnemployed();
                        $scope.stoneMax = $scope.population.stone + $scope.getUnemployed();
                        $scope.goldMax = $scope.population.gold + $scope.getUnemployed();
                        $scope.platMax = $scope.population.platinum + $scope.getUnemployed();
                        $scope.foodMax = $scope.population.food + $scope.getUnemployed();
                    });

                    $scope.$watch("population.platinum", function () {
                        $scope.woodMax = $scope.population.wood + $scope.getUnemployed();
                        $scope.stoneMax = $scope.population.stone + $scope.getUnemployed();
                        $scope.goldMax = $scope.population.gold + $scope.getUnemployed();
                        $scope.foodMax = $scope.population.food + $scope.getUnemployed();
                        $scope.silverMax = $scope.population.silver + $scope.getUnemployed();
                    });


                }

                $scope.round = function (input) {
                    input = +input.toFixed(2);
                    return input;
                }

                $scope.getUnemployed = function () {
                    return $scope.population.count
                            - $scope.population.wood
                            - $scope.population.gold
                            - $scope.population.stone
                            - $scope.population.food
                            - $scope.population.silver
                            - $scope.population.platinum
                            ;
                }

                $scope.clickedSavePopulation = function () {
                    $scope.disableButton = true;
                    $scope.population.$update(function () {
                        $scope.disableButton = false;
                    })
                }
            }])
        .controller('CityCreateCtrl', ['$scope', 'City', '$location',
            function ($scope, City, $location) {
                $scope.city = new City();

                $scope.sendCreateRequest = function () {
                    $scope.city.$save(function () {
                        $location.path('/main')
                    });
                }
            }]);
