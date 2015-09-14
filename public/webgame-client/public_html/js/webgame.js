var webgameApp = angular.module('webgameApp', [
    'ngRoute',
    'webgameControllers',
    'webgameServices',
    'ngResource',
    'ngCookies',
    'rzModule',
    'ui.bootstrap',
    'sticky',
    'pusher-angular'
]);

webgameApp.config(['$routeProvider', '$httpProvider',
    function ($routeProvider, $httpProvider) {
        $routeProvider.
                when('/test', {
                    templateUrl: 'webgame-client/public_html/partials/test.html',
                    controller: 'TestCtrl'
                }).
                when('/armies', {
                    templateUrl: 'webgame-client/public_html/partials/army/list.html',
                    controller: 'ArmyListCtrl'
                }).
                when('/armies/result', {
                    templateUrl: 'webgame-client/public_html/partials/info/battle_result.html',
                    controller: 'BattleResultCtrl'
                }).
                when('/armies/:id', {
                    templateUrl: 'webgame-client/public_html/army_main.html',
                    controller: 'ArmyMainCtrl'
                }).
                when('/cities/create', {
                    templateUrl: 'webgame-client/public_html/partials/city/create.html',
                    controller: 'CityCreateCtrl'
                }).
                when('/cities/:id', {
                    templateUrl: 'webgame-client/public_html/city_main.html',
                    controller: 'CityShowCtrl'
                }).
                when('/players/register', {
                    templateUrl: 'webgame-client/public_html/partials/player/register.html',
                    controller: 'PlayerRegisterCtrl'
                }).
                when('/login', {
                    templateUrl: 'webgame-client/public_html/partials/player/login.html',
                    controller: 'PlayerLoginCtrl'
                }).
                when('/players/session', {
                    templateUrl: 'webgame-client/public_html/partials/player/session.html',
                    controller: 'ShowSessionCtrl'
                }).
                when('/logout', {
                    templateUrl: 'webgame-client/public_html/partials/player/session.html',
                    controller: 'PlayerLogoutCtrl'
                }).
                when('/main', {
                    templateUrl: 'webgame-client/public_html/player_main.html',
                    controller: 'PlayerMainCtrl'
                }).
                when('/map', {
                    templateUrl: 'webgame-client/public_html/map.html',
                    controller: 'MapCtrl'
                }).
                otherwise({
                    redirectTo: '/phones'
                });

        $httpProvider.defaults.withCredentials = true;

    }]);