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
        <link rel="stylesheet" href="webgame-client/public_html/bower_components/bootstrap/dist/css/bootstrap.css">
        <link rel="stylesheet" href="webgame-client/public_html/bower_components/angularjs-slider/dist/rzslider.css">
        <link rel="stylesheet" href="webgame-client/public_html/css/webgame.css">

        <script src="webgame-client/public_html/bower_components/jquery/dist/jquery.js"></script>
        <script src="webgame-client/public_html/bower_components/angular/angular.js"></script>
        <script src="webgame-client/public_html/bower_components/angular-route/angular-route.js"></script>
        <script src="webgame-client/public_html/bower_components/angular-resource/angular-resource.js"></script>
        <script src="webgame-client/public_html/bower_components/angular-cookies/angular-cookies.js"></script>
        <script src="webgame-client/public_html/bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
        <script src="webgame-client/public_html/bower_components/angularjs-slider/dist/rzslider.min.js"></script>
        <script src="webgame-client/public_html/bower_components/paper/dist/paper-full.js"></script>
        <script src="webgame-client/public_html/bower_components/ngSticky/dist/sticky.min.js"></script>
        <script src="https://js.pusher.com/2.2/pusher.min.js"></script>
        <script src="webgame-client/public_html/bower_components/pusher-angular/lib/pusher-angular.min.js"></script>´
        <script src="webgame-client/public_html/js/webgame.js"></script>
        <script src="webgame-client/public_html/js/controllers.js"></script>
        <script src="webgame-client/public_html/js/services.js"></script>
        <script src="webgame-client/public_html/js/controllers/army.js"></script>
        <script src="webgame-client/public_html/js/controllers/city.js"></script>
        <script src="webgame-client/public_html/js/controllers/player.js"></script>
        <script src="webgame-client/public_html/js/controllers/map.js"></script>
    </head>
    <body class="col-md-12">
        <div class="view-container">
            <div ng-view class="view-frame"></div>
        </div>
    </body>
</html>
