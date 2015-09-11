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
        .controller('PlayerLogoutCtrl', ['$scope', '$http', 'Session', '$location', 'PlayerData',
            function ($scope, $http, Session, $location, PlayerData) {
                $http.get('/logout')
                        .success(sendLogoutCallback);

                function sendLogoutCallback($data) {
                    Session.unset();
                    PlayerData.refreshData();
                }
            }])
        .controller('PlayerMainCtrl', ['$scope', 'Session', '$location', '$modal', 'SharedData', '$http', '$interval', 'PlayerData',
            function ($scope, Session, $location, $modal, SharedData, $http, $interval, PlayerData) {
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
                $scope.$on('player:updated', function (event, data) {
                    $scope.player = data;
                    setArmyMoveTimers();
                });

                function refreshMain(value) {
                    $scope.player = PlayerData.getData();
                }

                var refreshRecount = function () {
                    $http.get('/queue/recount').then(function (data) {
                        var n = data.data.recountTime - data.data.serverTime;
                        $scope.timer = new Object();
                        new Countdown(n, $scope.timer, refreshRecount).start();
                    });
                };

                refreshRecount();

                function setArmyMoveTimers() {
                    var n = Math.round(new Date().getTime() / 1000);
                    for (i = 0; i < $scope.player.armies.length; i++) {
                        if ($scope.player.armies[i].position.move_at != null) {
                            $scope.player.armies[i].timer = new Object();
                            new Countdown($scope.player.armies[i].position.move_at - n, $scope.player.armies[i].timer, PlayerData.refreshData).start();
                        }
                    }
                }

                function Countdown(duration, display, callback) {
                    var timer,
                            instance = this


                    function decrementCounter() {                       
                        display.sec--;
                        if (display.sec <= 0) {
                            instance.stop();
                            //callback();
                            return;
                        }
                    }

                    this.start = function () {
                        display.sec = duration;
                        timer = $interval(decrementCounter, 1000);
                    };

                    this.stop = function () {
                        display.sec = 0
                        $interval.cancel(timer);
                    }
                }

            }]);
