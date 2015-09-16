var mapControllers = angular.module('mapControllers', []);
mapControllers
        .controller('MapCtrl', ['$scope', '$http', 'Session', 'PlayerData', 'Position',
            function ($scope, $http, Session, PlayerData, Position) {
                $scope.player = PlayerData.getData();
                $scope.$on('player:updated', function (event, data) {
                    drawNodes(data.cities, data.armies);
                    $scope.player = data;
                });
                $http.get('/test4')
                        .success(function ($data) {
                            $scope.map = angular.fromJson($data);
                            drawMap();
                            PlayerData.broadcastData();
                        });
                var scale = 1;
                var popupLayer;
                var armyLayer;
                var nodes = new Array();
                var connections = new Array();
                var canvas = document.getElementById('canvas');
                paper.setup(canvas);
                paper.install(window);
                var mainLayer = new paper.Layer();
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

                    for (i = 0; i < $scope.map.nodes.length; i++) {
                        nodes[i] = new Array();
                        for (j = 0; j < $scope.map.nodes[i].length; j++) {
                            createNode($scope.map.nodes[i][j].x , $scope.map.nodes[i][j].y, j, i);
                        }
                    }
                    for (i = 0; i < $scope.map.routes.length; i++) {
                        connections[i] = new Array();
                        for (j = 0; j < $scope.map.routes[i].length; j++) {
                            displayConnection(nodes[i][$scope.map.routes[i][j].from_x - 1 ], nodes[$scope.map.routes[i][j].to_y - 1][$scope.map.routes[i][j].to_x - 1], i);
                        }
                    }
                    paper.view.draw();
                }

                function drawNodes(cities, armies) {
                    displayCities(cities);
                    displayArmies(armies);
                }

                function createNode(x, y, map_x, map_y) {
                    var point = new Point(x, y);
                    point.map_x = map_x;
                    point.map_y = map_y;
                    var circle = symbol.place(point);
                    circle.map_x = map_x;
                    circle.map_y = map_y;
                    nodes[map_y].push(point);
                }

                function displayConnection(start, end, i) {
                    var myPath = new paper.Path();
                    myPath.strokeColor = 'black';
                    myPath.add(start);
                    myPath.add(end);
                    myPath.map_start = start;
                    myPath.map_end = end;
                    connections[i].push(myPath);
                }

                $scope.clickedMinus = function () {
                    scale *= 0.75;
                    paper.view.zoom = scale;
                };
                $scope.clickedPlus = function () {
                    scale *= 1.25;
                    paper.view.zoom = scale;
                };
                function displayCities(cities) {
                    for (i = 0; i < cities.length; i++) {
                        var x = cities[i].position.x;
                        var y = cities[i].position.y;
                        var id = cities[i].position.id;
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

                function displayArmies(armyList) {
                    clearArmyLayer();
                    armyLayer = new paper.Layer();
                    for (i = 0; i < armyList.length; i++) {
                        var x = armyList[i].position.x;
                        var y = armyList[i].position.y;
                        var id = armyList[i].position.id;
                        var node = new paper.Path.Circle(nodes[y][x], 12);
                        node.fillColor = "GreenYellow";
                        node.map_x = x;
                        node.map_y = y;
                        node.mapId = id;
                        node.onClick = function (event) {
                            selection = this;
                            displayArmyMoves(this);
                        }
                        if (armyList[i].position.move_to_x != null) {
                            var moveNode = createMoveNode(armyList[i].position.move_to_x, armyList[i].position.move_to_y);
                            drawArrow(nodes[y][x], moveNode);
                        }
                    }
                    mainLayer.activate();
                    paper.view.draw();
                }

                function createMoveNode(x, y) {
                    if (nodes[y] == null) {
                        return;
                    }
                    if (nodes[y][x] == null) {
                        return;
                    }
                    var moveNode = new paper.Path.Circle(nodes[y][x], 12);
                    moveNode.fillColor = "Blue";
                    moveNode.map_x = x;
                    moveNode.map_y = y;
                    moveNode.onClick = function (event) {
                        if (popupLayer != null) {
                            popupLayer.removeChildren();
                        }
                        if (selection != null) {
                            moveArmy(this.map_x, this.map_y);
                        }
                    }
                    return nodes[y][x];
                }

                function displayArmyMoves(army) {
                    clearPopupLayer();
                    popupLayer = new paper.Layer();
                    var movesConnections = new Array();
                    for (j = -1; j < 2; j++) {
                        for (k = -1; k < 2; k++) {
                            if (i !== 0 || k !== 0) {
                                var x = army.map_x + k;
                                var y = army.map_y + j;
                                if (nodes[y] == null) {
                                    continue;
                                }
                                if (nodes[y][x] == null) {
                                    continue;
                                }
                                var node = nodes[y][x];
                                var result = getPositionConnection(node, army);
                                if (result.length > 0) {
                                    createMoveNode(node.map_x, node.map_y);
                                }
                                movesConnections = movesConnections.concat(result);
                                result = getPositionConnection(army, node);
                                if (result.length > 0) {
                                    createMoveNode(node.map_x, node.map_y);
                                }
                                movesConnections = movesConnections.concat(result);
                            }
                        }
                    }
                    for (i = 0; i < movesConnections.length; i++) {
                        var path = new paper.Path();
                        if (movesConnections[i].map_end.map_x == army.map_x && movesConnections[i].map_end.map_y == army.map_y) {
                            drawArrow(movesConnections[i].map_end, movesConnections[i].map_start);
                        } else {
                            drawArrow(movesConnections[i].map_start, movesConnections[i].map_end);
                        }
                    }
                    mainLayer.activate();
                }

                function drawArrow(start, end) {
                    console.log(start, end);
                    var path = new paper.Path();
                    path.add(start);
                    path.add(end);
                    path.strokeColor = 'red';
                    path.strokeWidth = 6;
                    var vector = path.getPointAt(path.length).subtract(path.getPointAt(path.length - 25));
                    var arrowVector = vector.normalize(18);
                    var arrow = new paper.Path({
                        segments: [path.getPointAt(path.length).add(arrowVector.rotate(145)), path.getPointAt(path.length), path.getPointAt(path.length).add(arrowVector.rotate(-145))],
                        strokeColor: 'red',
                        strokeWidth: 6
                    });
                }


                function clearPopupLayer() {
                    if (popupLayer != null) {
                        popupLayer.removeChildren();
                    }
                }

                function getPositionConnection(position, army) {
                    var start = new Object();
                    var end = new Object();
                    var result = new Array();
                    for (i = 0; i < connections[position.map_y].length; i++) {
                        start.x = connections[position.map_y][i].map_start.map_x;
                        start.y = connections[position.map_y][i].map_start.map_y;
                        end.x = connections[position.map_y][i].map_end.map_x;
                        end.y = connections[position.map_y][i].map_end.map_y;
                        if (start.x == position.map_x && start.y == position.map_y) {
                            if (end.x == army.map_x && end.y == army.map_y) {
                                result.push(connections[position.map_y][i]);
                            }
                        }
                    }
                    return result;
                }

                function clearArmyLayer() {
                    if (armyLayer != null) {
                        armyLayer.removeChildren();
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
                        PlayerData.refreshData();
                    }
                    );
                }
            }])