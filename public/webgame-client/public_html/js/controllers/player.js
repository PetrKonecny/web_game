var playerControllers = angular.module('playerControllers', []);
playerControllers
        .controller('PlayerRegisterCtrl', ['$scope', 'Player',
            function ($scope, Player) {
                $scope.player = new Player();
                $scope.register = function () {
                    $scope.player.$save(function () {
                    });
                }
            }])
        .controller('PlayerLoginCtrl', ['$scope', 'Player', 'LoginService', 'Session', '$location',
            function ($scope, Player, LoginService, Session, $location) {
                $scope.player = new Player();

                $scope.sendLoginRequest = function () {
                    var request = LoginService.login($scope.player);
                    request.success(function (response) {
                        if (response.id) {
                            Session.set(response);
                            $location.path('/main');
                        } else {
                            $scope.error = 'Wrong login or password';
                        }
                    });
                }
            }])
        .controller('ShowSessionCtrl', ['$scope', '$http',
            function ($scope, $http) {
                $http.get('/session', $scope.player)
                        .success(sendLoginCallback);

                function sendLoginCallback($data) {
                    $scope.data = $data;
                }
            }])
        .controller('PlayerLogoutCtrl', ['$scope', '$http', 'Session', '$location',
            function ($scope, $http, Session, $location) {
                $http.get('/logout')
                        .success(sendLogoutCallback);

                function sendLogoutCallback($data) {
                    Session.unset();
                    $location.path('/login')
                }
            }])
        .controller('PlayerMainCtrl', ['$scope', 'Session', 'Player', '$location', '$modal', 'SharedData',
            function ($scope, Session, Player, $location, $modal, SharedData) {
                $scope.player = Session.get();
                Player.get({id: $scope.player.id}).$promise.then(
                        function (value) {
                            console.log(value);
                            SharedData.set(value);
                            $scope.player = value;
                            $scope.armies = value.armies;
                            $scope.cities = value.cities;
                        }
                );

                $scope.armyClicked = function ($id) {              
                    $location.path('armies/' + $id);
                }
                $scope.cityClicked = function ($id) {
                    $location.path('cities/' + $id);
                }
                $scope.newArmyClicked = function () {
                    $modal.open('/partials/army/create.html');
                }
            }]);
