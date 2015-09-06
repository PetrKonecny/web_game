angular.module('webgameServices', [])
        .factory('Army', function ($resource) {
            return $resource('/armies/:id/:action', {id: '@Id'}, {
                update: {
                    method: 'PUT'
                },
                buyUnits: {
                    method: 'PUT'
                }
            });        
        })
        .factory('Player', function ($resource) {
            return $resource('/players/:id', {id: '@Id'}, {
                update: {
                    method: 'PUT'
                }
            });

        })
        .factory('Unit', function ($resource) {
            return $resource('/units/:id', {id: '@Id'}, {
                update: {
                    method: 'PUT'
                }
            });

        })
        .factory('Building', function ($resource) {
            return $resource('/buildings/:id', {id: '@Id'}, {
                update: {
                    method: 'PUT'
                }
            });

        })
        .factory('City', function ($resource) {
            return $resource('/cities/:id', {id: '@Object_id'}, {
                update: {
                    method: 'PUT'
                }
            });

        })
        .factory('Population', function ($resource) {
            return $resource('/population/:id', {id: '@city_id'}, {
                update: {
                    method: 'PUT'
                }
            });

        })
        .factory('Position', function ($resource) {
            return $resource('/positions/:id/:action', {id: '@id'}, {
                update: {
                    method: 'PUT'
                },
                getAvailableUnits: {
                    isArray: true
                }
            });

        })
        .factory('Resource', function ($resource) {
            return $resource('/resources/:id', {id: '@id'}, {
                update: {
                    method: 'PUT'
                }
            });

        })
        .factory('SharedData', function () {
            var savedData = {}
            function set(data) {
                savedData = data;
            }
            function get() {
                return savedData;
            }

            return {
                set: set,
                get: get
            }

        })
        .factory('Session', ['$cookies', function ($cookies) {
                function get() {
                    return angular.fromJson($cookies.get('webgameCurrentUser'));
                }
                function set($user) {
                    $cookies.putObject('webgameCurrentUser', $user);
                }

                function unset() {
                    $cookies.remove('webgameCurrentUser');
                }

                return {
                    set: set,
                    get: get,
                    unset: unset
                }

            }])
        .factory('LoginService', ['Session', '$http', function (Session, $http) {
                function login($user) {
                    var resp = $http.post('/login', $user);
                    return resp;
                }
                function logout() {
                    var resp = $http.get('/logout');
                }

                return {
                    login: login,
                    logout: logout,
                }
            }]);