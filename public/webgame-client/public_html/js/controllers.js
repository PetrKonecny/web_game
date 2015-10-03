var webgameControllers = angular.module('webgameControllers', [
    'armyControllers',
    'playerControllers',
    'cityControllers',
    'mapControllers',
]);
webgameControllers
        .controller('TestCtrl', ['$scope', '$pusher',
            function ($scope, $pusher) {
                $scope.message2 = "this is a test of pusher";
                var client = new Pusher('16240027cd67882da91d');
                var pusher = $pusher(client);
                $scope.messages = new Array();
                var my_channel = pusher.subscribe('test-channel');
                pusher.bind('new-message',
                        function (data) {
                            $scope.messages.push(data.message);
                        }
                );

            }])
        .controller('TopBarCtrl', ['$scope', 'PlayerData',
            function ($scope, PlayerData) {
                $scope.$on('player:updated', function (event, data) {
                    $scope.player = data;
                });
            }])
        .controller('NotifCtrl', ['$scope', 'PlayerData',
            function ($scope, PlayerData) {
                $scope.player = PlayerData.getData();
            }]);
;
;


                