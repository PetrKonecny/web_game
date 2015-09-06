angular.module('webgameServices', [])
        .factory('Army', function ($resource) {
            return $resource('http://94.112.69.214:8080/armies/:id/:action', {id: '@Id'}, {
                update: {
                    method: 'PUT'
                },
                buyUnits: {
                    method: 'PUT'
                }
            });        
        })
        .factory('Player', function ($resource) {
            return $resource('http://94.112.69.214:8080/players/:id', {id: '@Id'}, {
                update: {
                    method: 'PUT'
                }
            });

        })
        .factory('Unit', function ($resource) {
            return $resource('http://94.112.69.214:8080/units/:id', {id: '@Id'}, {
                update: {
                    method: 'PUT'
                }
            });

        })
        .factory('Building', function ($resource) {
            return $resource('http://94.112.69.214:8080/buildings/:id', {id: '@Id'}, {
                update: {
                    method: 'PUT'
                }
            });

        })
        .factory('City', function ($resource) {
            return $resource('http://94.112.69.214:8080/cities/:id', {id: '@Object_id'}, {
                update: {
                    method: 'PUT'
                }
            });

        })
        .factory('Population', function ($resource) {
            return $resource('http://94.112.69.214:8080/population/:id', {id: '@city_id'}, {
                update: {
                    method: 'PUT'
                }
            });

        })
        .factory('Position', function ($resource) {
            return $resource('http://94.112.69.214:8080/positions/:id/:action', {id: '@id'}, {
                update: {
                    method: 'PUT'
                },
                getAvailableUnits: {
                    isArray: true
                }
            });

        })
        .factory('Resource', function ($resource) {
            return $resource('http://94.112.69.214:8080/resources/:id', {id: '@id'}, {
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
                    var resp = $http.post('http://94.112.69.214:8080/login', $user);
                    return resp;
                }
                function logout() {
                    var resp = $http.get('http://94.112.69.214:8080/logout');
                }

                return {
                    login: login,
                    logout: logout,
                }
            }]);