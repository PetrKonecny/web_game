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
        .controller('PlayerMainCtrl', ['$scope', 'Session', 'Player', '$location', '$modal', 'SharedData', '$http', '$interval',
            function ($scope, Session, Player, $location, $modal, SharedData, $http, $interval) {

                $scope.player = Session.get();
                refreshMain();

                $scope.armyClicked = function ($id) {
                    $location.path('armies/' + $id);
                }
                $scope.cityClicked = function ($id) {
                    $location.path('cities/' + $id);
                }
                $scope.newArmyClicked = function () {
                    $modal.open('/partials/army/create.html');
                }
                $scope.getTimerMessage = function (timer) {
                    if (timer == null)
                        return;
                    return "Army moves in " + timer.sec;
                }

                function refreshMain(value) {
                    Player.get({id: $scope.player.id}).$promise.then(
                            function (value) {
                                SharedData.set(value);
                                $scope.player = value;
                                $scope.armies = value.armies;
                                $scope.cities = value.cities;
                                setArmyMoveTimers();
                            }
                    );
                }

                var refreshRecount = function () {
                    $http.get('/queue/recount').then(function (data) {
                        var n = data.data.recountTime - data.data.serverTime;
                        $scope.timer = new Object();
                        new Countdown($scope, n, $scope.timer, refreshRecount).start();
                    });
                };

                refreshRecount();

                function setArmyMoveTimers() {
                    var n = Math.round(new Date().getTime() / 1000);
                    for (i = 0; i < $scope.armies.length; i++) {
                        if ($scope.armies[i].position.move_at != null) {
                            $scope.armies[i].timer = new Object();
                            new Countdown($scope, $scope.armies[i].position.move_at - n, $scope.armies[i].timer).start();
                        }
                    }
                }

                function Countdown(scope, duration, display, callback) {
                    var timer,
                            instance = this


                    function decrementCounter() {
                        if (!$scope.refreshEvents) {
                            instance.stop();
                        }
                        if (display.sec === 0) {
                            instance.stop();
                            return;
                        }
                        display.sec--;
                        if (display.sec === 0) {
                            callback();
                        }
                    }

                    this.start = function () {
                        clearInterval(timer);
                        display.sec = duration;
                        timer = $interval(decrementCounter, 1000);
                    };

                    this.stop = function () {
                        clearInterval(timer);
                    }
                }

            }]);
