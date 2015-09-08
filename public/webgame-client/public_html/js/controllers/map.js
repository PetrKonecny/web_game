var mapControllers = angular.module('mapControllers', []);
mapControllers
        .controller('MapCtrl', ['$scope', '$http', 'Session', 'Player', 'Position',
            function ($scope, $http, Session, Player, Position) {


                $http.get('/test4')
                        .success(function ($data) {
                            $scope.map = angular.fromJson($data);
                            drawMap();
                            $scope.player = Session.get();
                            Player.get({id: $scope.player.id}).$promise.then(
                                    function (value) {
                                        console.log(value);
                                        $scope.player = value;
                                        $scope.armies = value.armies;
                                        $scope.cities = value.cities;
                                        displayCities();
                                        displayArmies();
                                    }
                            );
                        });

                var buffer = true;
                var scale = 1;
                var nodes = new Array();
                var armies = new Array();
                var connections = new Array();

                var canvas = document.getElementById('canvas');
                paper.setup(canvas);
                paper.install(window);

                var node = new paper.Path.Circle(new paper.Point(10, 10), 15);
                node.fillColor = 'black';
                var symbol = new paper.Symbol(node);

                var tool = new paper.Tool();
                var isDrag = false;
                var path;
                var selection;

                tool.onMouseDown = function (event) {
                    path = new Point();
                    path.add(event.point);
                }

                function center(a, b) {
                    var center = paper.project.view.center;
                    var desX = (a.x - b.x);
                    var desY = (a.y - b.y);
                    var newCenter = [center.x + desX, center.y + desY];
                    return newCenter;
                }

                tool.onMouseDrag = function (event) {
                    path.add(event.point);
                    var des = center(event.downPoint, event.point);
                    paper.project.view.center = des;
                }

                function drawMap() {
                    var m = new Matrix(2, .5, 0, 1, -paper.project.activeLayer.bounds.x * 1.3, paper.project.activeLayer.bounds.y);

                    paper.project.activeLayer.transform(m);

                    for (i = 0; i < $scope.map.nodes.length; i++) {
                        nodes[i] = new Array();
                        for (j = 0; j < $scope.map.nodes[i].length; j++) {
                            createNode($scope.map.nodes[i][j].x, $scope.map.nodes[i][j].y, j, i);
                        }
                    }
                    for (i = 0; i < $scope.map.routes.length; i++) {
                        for (j = 0; j < $scope.map.routes[i].length; j++) {
                            displayConnection(nodes[i][$scope.map.routes[i][j].from_x - 1 ], nodes[$scope.map.routes[i][j].to_y - 1][$scope.map.routes[i][j].to_x - 1]);
                        }
                    }
                    paper.view.draw();
                }

                function createNode(x, y, map_x, map_y) {
                    var circle = symbol.place(new Point(x, y));
                    circle.map_x = map_x;
                    circle.map_y = map_y;
                    nodes[map_y].push(new Point(x, y));
                    circle.onClick = function (event) {
                        if (selection != null) {
                            moveArmy(this.map_x, this.map_y);
                        }
                    }
                }

                function displayConnection(start, end) {
                    var myPath = new paper.Path();
                    myPath.strokeColor = 'black';
                    myPath.add(start);
                    myPath.add(end);
                }

                $scope.clickedMinus = function () {
                    scale *= 0.75;
                    paper.view.zoom = scale;
                };
                $scope.clickedPlus = function () {
                    scale *= 1.25;
                    paper.view.zoom = scale;
                };

                function displayCities() {
                    for (i = 0; i < $scope.player.cities.length; i++) {
                        var x = $scope.player.cities[i].position.x;
                        var y = $scope.player.cities[i].position.y;
                        var id = $scope.player.cities[i].position.id;
                        var node = new paper.Path.Circle(nodes[y][x], 12);
                        node.fillColor = 'red';
                        node.map_x = x;
                        node.map_y = y;
                        node.mapId = id;
                        node.onClick = function (event) {
                            selection = this;
                        }
                    }
                    paper.view.draw();
                }

                function displayArmies() {

                    for (i = 0; i < $scope.player.armies.length; i++) {
                        var x = $scope.player.armies[i].position.x;
                        var y = $scope.player.armies[i].position.y;
                        var id = $scope.player.armies[i].position.id;
                        var node = new paper.Path.Circle(nodes[y][x], 12);
                        node.fillColor = "red";
                        node.fillColor = "GreenYellow";
                        node.map_x = x;
                        node.map_y = y;
                        node.mapId = id;
                        node.onClick = function (event) {
                            selection = this;
                        }
                        armies.push(node);
                    }
                    paper.view.draw();
                }
                
                function clearArmies() {
                    for (i=0; i<armies.length; i++){
                        armies[i].remove();
                    }
                }

                function moveArmy(x, y) {
                    var position = new Position();
                    position.id = selection.mapId;
                    position.x = x;
                    position.y = y;
                    position.$update(function (data) {
                        selection = null;
                        for (i = 0; i < $scope.player.armies.length; i++) {
                            if ($scope.player.armies[i].position_id === data.id) {
                                var result = new Object();
                                result.x = data.x;
                                result.y = data.y;
                                result.id = data.id;
                                $scope.player.armies[i].position = result;
                                break;
                            }
                        }
                        clearArmies();
                        displayArmies();
                    }
                    );
                }
            }])