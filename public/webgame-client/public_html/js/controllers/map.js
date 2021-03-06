var mapControllers = angular.module('mapControllers', []);
mapControllers
        .controller('MapCtrl', ['$scope', '$http', 'Session', 'PlayerData', 'Position', 'Map', 'Army',
            function ($scope, $http, Session, PlayerData, Position, Map, Army) {

                var scale = 1;
                var layers = new Array();
                var popupLayer;
                var armyLayer;
                var finder;
                var selectedArmyId;
                var nodes = new Array();
                var connections = new Array();
                var selection;
                var mainLayer;


                $scope.$on('player:updated', function (event, data) {
                    drawNodes(data.cities, data.armies, data.positions);
                    $scope.player = data;
                });
                $scope.$on('map:loaded', function (event, data) {
                    console.log('mapLoaded');
                    $scope.map = data;
                    drawMap();
                    PlayerData.broadcastData();
                });

                Map.init();
                setUpPaper();

                function setUpPaper() {
                    mainLayer = new paper.Layer();
                    if (paper.tool != null)
                        paper.tool.remove();
                    var tool = new paper.Tool();

                    tool.onMouseDown = function (event) {
                        path = new paper.Point();
                        path.add(event.point);
                    }
                    tool.onMouseDrag = function (event) {
                        path.add(event.point);
                        var des = center(event.downPoint, event.point);
                        paper.project.view.center = des;
                        hideNodes();
                        hideRoutes();
                        drawMinimapScope();
                    }
                }

                function center(a, b) {
                    var center = paper.project.view.center;
                    var desX = (a.x - b.x);
                    var desY = (a.y - b.y);
                    var newCenter = [center.x + desX, center.y + desY];
                    return newCenter;
                }

                function drawMap() {
                    for (i = 0; i < $scope.map.nodes.length; i++) {
                        //layers.push(new paper.Layer());
                        nodes[i] = new Array();
                        for (j = 0; j < $scope.map.nodes[i].length; j++) {
                            createNode($scope.map.nodes[i][j].x, $scope.map.nodes[i][j].y, j, i);
                        }
                    }

                    for (i = 0; i < $scope.map.routes.length; i++) {
                        connections[i] = new Array();
                        //layers[i].activate();
                        for (j = 0; j < $scope.map.routes[i].length; j++) {
                            displayConnection(nodes[i][$scope.map.routes[i][j].from_x - 1 ], nodes[$scope.map.routes[i][j].to_y - 1][$scope.map.routes[i][j].to_x - 1], i);
                        }
                    }
                    hideNodes();
                    hideRoutes();
                    drawMinimap();
                    drawMinimapScope();
                }

                function drawMinimap() {
                    Map.changePaper(1);
                    var a = nodes[0][0].position;
                    var b = nodes[0][199].position;
                    var c = nodes[199][0].position;
                    var path = new paper.Path();
                    path.strokeColor = 'black';
                    path.add(new paper.Point(a.x / 100, a.y / 100));
                    path.add(new paper.Point(b.x / 100, b.y / 100));
                    path.add(new paper.Point(c.x / 100, c.y / 100));
                    path.closed = true;
                    paper.view.center = new paper.Point(50, 0);
                    Map.changePaper(0);
                }

                function drawMinimapScope() {
                    if (finder != null)
                        finder.remove();
                    var bounds = paper.view.bounds;
                    Map.changePaper(1);
                    finder = new paper.Path();
                    finder.strokeColor = 'red';
                    finder.add(new paper.Point(bounds.topLeft.x / 100, bounds.topLeft.y / 100));
                    finder.add(new paper.Point(bounds.topRight.x / 100, bounds.topRight.y / 100));
                    finder.add(new paper.Point(bounds.bottomRight.x / 100, bounds.bottomRight.y / 100));
                    finder.add(new paper.Point(bounds.bottomLeft.x / 100, bounds.bottomLeft.y / 100));
                    finder.closed = true;
                    paper.view.draw();
                    Map.changePaper(0);
                }

                function drawNodes(cities, armies, positions) {
                    displayCities(cities);
                    displayArmies(armies);
                    displayPositions(positions);
                    hideNodes();
                    hideRoutes();
                    paper.view.draw();
                }

                function createNode(x, y, map_x, map_y) {
                    var point = new paper.Point(x, y);
                    point.map_x = map_x;
                    point.map_y = map_y;
                    //var circle = symbol.place(point);
                    /*var circle = new paper.Path.Circle(point, 15);
                     circle.position = point;
                     circle.fillColor = 'black';*/
                    point.position = new Object();
                    point.position.x = point.x;
                    point.position.y = point.y;
                    point.fillColor = 'black';
                    point.map_x = map_x;
                    point.map_y = map_y;
                    nodes[map_y].push(point);
                }

                var hideNodes = function (event) {
                    var center = paper.view.center;
                    var width = (paper.view.viewSize.width * (1 / paper.view.zoom)) * 0.5;
                    var height = (paper.view.viewSize.height * (1 / paper.view.zoom)) * 0.5;
                    for (i = 0; i < nodes.length; i++) {
                        for (j = 0; j < nodes[i].length; j++) {
                            var node = nodes[i][j];
                            if (Math.abs((center.x - node.position.x)) > width
                                    || Math.abs((center.y - node.position.y)) > height)
                            {
                                //node.visible = false;
                                if (node.circle != null) {
                                    node.circle.remove();
                                    node.circle = null;
                                }
                            } else {
                                if (node.circle == null) {
                                    var circle = new paper.Path.Circle(node, 15);
                                    node.circle = circle;
                                }
                                node.circle.fillColor = node.fillColor;
                                //node.visible = true;
                            }
                        }
                    }
                }

                var hideRoutes = function (event) {
                    var center = paper.view.center;
                    var width = (paper.view.viewSize.width * (1 / paper.view.zoom)) * 0.5;
                    var height = (paper.view.viewSize.height * (1 / paper.view.zoom)) * 0.5;
                    for (i = 0; i < connections.length; i++) {
                        for (j = 0; j < connections[i].length; j++) {
                            var route = connections[i][j];
                            if (Math.abs((center.x - route.map_start.position.x)) > width
                                    || Math.abs((center.y - route.map_start.position.y)) > height)
                            {
                                //route.visible = false;
                                if (route.route != null) {
                                    route.route.remove();
                                    route.route = null;
                                }
                            } else {
                                if (route.route == null) {
                                    route.route = drawRoute(route);
                                }
                            }
                        }
                    }
                }

                function drawRoute(route) {
                    var myPath = new paper.Path();
                    myPath.strokeColor = 'black';
                    myPath.add(route.map_start.position);
                    myPath.add(route.map_end.position);
                    return myPath;
                }

                function displayConnection(start, end, i) {
                    /*var myPath = new paper.Path();
                     myPath.strokeColor = 'black';
                     myPath.add(start.position);
                     myPath.add(end.position);
                     myPath.map_start = start;
                     myPath.map_end = end;*/
                    var myPath = new Object();
                    myPath.map_start = start;
                    myPath.map_end = end;

                    connections[i].push(myPath);
                }

                $scope.clickedMinus = function () {
                    scale *= 0.75;
                    paper.view.zoom = scale;
                    hideNodes();
                    hideRoutes();
                    drawMinimapScope();
                };
                $scope.clickedPlus = function () {
                    scale *= 1.25;
                    paper.view.zoom = scale;
                    hideNodes();
                    hideRoutes();
                    drawMinimapScope();
                };
                function displayCities(cities) {
                    for (i = 0; i < cities.length; i++) {
                        var x = cities[i].position.x;
                        var y = cities[i].position.y;
                        var id = cities[i].position.id;
                        var node = new paper.Path.Circle(nodes[y][x].position, 12);
                        node.fillColor = 'red';
                        node.map_x = x;
                        node.map_y = y;
                        node.mapId = id;
                        node.onClick = function (event) {
                            selection = this;
                        }
                    }
                }

                function displayArmies(armyList) {
                    clearArmyLayer();
                    armyLayer = new paper.Layer();
                    for (i = 0; i < armyList.length; i++) {
                        var x = armyList[i].position.x;
                        var y = armyList[i].position.y;
                        var id = armyList[i].position.id;
                        var node = new paper.Path.Circle(nodes[y][x].position, 12);
                        node.fillColor = "GreenYellow";
                        node.map_x = x;
                        node.map_y = y;
                        node.mapId = id;
                        node.armyId = armyList[i].Id;
                        node.onClick = function (event) {
                            selection = this;
                            selectedArmyId = this.armyId;
                            console.log(selectedArmyId);
                            displayArmyMoves(this);
                        }
                        if (armyList[i].move_to_x != null) {
                            var moveNode = createMoveNode(armyList[i].move_to_x, armyList[i].move_to_y);
                            drawArrow(nodes[y][x].position, moveNode.position);
                        }
                    }
                    mainLayer.activate();
                }

                function displayPositions(positions) {
                    for (i = 0; i < positions.length; i++) {
                        var node = nodes[positions[i].y][positions[i].x];
                        node.fillColor = 'orange';
                    }
                }

                function createMoveNode(x, y) {
                    if (nodes[y] == null) {
                        return;
                    }
                    if (nodes[y][x] == null) {
                        return;
                    }
                    var moveNode = new paper.Path.Circle(nodes[y][x].position, 12);
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
                            drawArrow(movesConnections[i].map_end.position, movesConnections[i].map_start.position);
                        } else {
                            drawArrow(movesConnections[i].map_start.position, movesConnections[i].map_end.position);
                        }
                    }
                    mainLayer.activate();
                }

                function drawArrow(start, end) {
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
                    var army = new Army();
                    army.move_to_x = x;
                    army.move_to_y = y;
                    army.Id = selectedArmyId;
                    army.$move({id: army.Id, action: 'move'}, function () {
                        selection = null;

                        /*
                         for (i = 0; i < $scope.player.armies.length; i++) {
                         if ($scope.player.armies[i].position_id === data.id) {
                         
                         var result = new Object();
                         result.x = data.x;
                         result.y = data.y;
                         result.id = data.id;
                         $scope.player.armies[i].position = result;
                         break;
                         
                         }
                         }*/
                        PlayerData.refreshData();

                    }
                    );
                }

                $scope.player = PlayerData.getData();
                Map.loadMapData();

            }])