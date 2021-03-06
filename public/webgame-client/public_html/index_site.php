<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html ng-app="webgameApp">
    <head>
        <title>TODO supply a title</title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="webgame-client/public_html/bower_components/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="webgame-client/public_html/bower_components/angularjs-slider/dist/rzslider.css">
        <link rel="stylesheet" href="webgame-client/public_html/css/webgame.css">

        <script src="webgame-client/public_html/bower_components/jquery/dist/jquery.min.js"></script>
        <script src="webgame-client/public_html/bower_components/angular/angular.min.js"></script>
        <script src="webgame-client/public_html/bower_components/angular-route/angular-route.min.js"></script>
        <script src="webgame-client/public_html/bower_components/angular-resource/angular-resource.min.js"></script>
        <script src="webgame-client/public_html/bower_components/angular-cookies/angular-cookies.min.js"></script>
        <script src="webgame-client/public_html/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
        <script src="webgame-client/public_html/bower_components/angularjs-slider/dist/rzslider.min.js"></script>
        <script src="webgame-client/public_html/bower_components/paper/dist/paper-full.min.js"></script>
        <script src="webgame-client/public_html/bower_components/ngSticky/dist/sticky.min.js"></script>
        <script src="https://js.pusher.com/2.2/pusher.min.js"></script>
        <script src="webgame-client/public_html/bower_components/pusher-angular/lib/pusher-angular.min.js"></script>
        <script src="webgame-client/public_html/js/webgame.js"></script>
        <script src="webgame-client/public_html/js/controllers.js"></script>
        <script src="webgame-client/public_html/js/services.js"></script>
        <script src="webgame-client/public_html/js/controllers/army.js"></script>
        <script src="webgame-client/public_html/js/controllers/city.js"></script>
        <script src="webgame-client/public_html/js/controllers/player.js"></script>
        <script src="webgame-client/public_html/js/controllers/map.js"></script>
    </head>
    <body>
        <div class="topbar" ng-controller="TopBarCtrl" sticky>
            <h1>
                {{player.username}}
                <a href="/#/main">Home</a>
                <a href="/#/notification">Notifications</a>({{player.notifications.length}})
                <a href="/#/logout">Logout</a>
            </h1>
        </div>
        <br>
        <br>
        <br>
        <br>
        <div class="view-container">
            <div ng-view class="view-frame"></div>
        </div>
    </body>
</html>
