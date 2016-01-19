/* global angular */
angular.module('scorerApp', [])
    .controller('ScorerController', function ($scope) {

        $scope.currentTurn = 1;
        $scope.currentPlayer;

        $scope.players = [];
        // [{
        //     name: 'First',
        //     turns: [{
        //         shots: []
        //     }]
        // }];

        $scope.addPlayer = function () {
            var player = { name: $scope.playerName, turns: [] };
            for (var i = 0; i < $scope.currentTurn; i++) {
                player.turns.push({ shots: [] });
            }
            $scope.players.push(player);
            $scope.playerName = "";
        };

        $scope.addHit = function () {
            var player = $scope.getCurrentPlayer();
            player.turns[$scope.currentTurn - 1].shots.push({ made: true });
        };

        $scope.addMiss = function () {
            var player = $scope.getCurrentPlayer();
            player.turns[$scope.currentTurn - 1].shots.push({ made: false });
        };
        
        $scope.getHits = function (turn) {
            var hits = turn.shots.filter(function(el){
               return el.made === true; 
            });
            
            return hits.length;
        };
        
        $scope.getMisses = function (turn) {
            var hits = turn.shots.filter(function(el){
               return el.made === false; 
            });
            
            return hits.length;
        };

        $scope.getCurrentPlayer = function () {
            var lastPlayer = $scope.players[$scope.players.length - 1];
            if (lastPlayer) {
                var turn = lastPlayer.turns[$scope.currentTurn - 1];
                var shot = turn.shots[turn.shots.length - 1];

                if (shot === undefined || shot.made === true) {
                    return lastPlayer;
                } else {
                    return $scope.players[0];
                }
            } else {
                return null;
            }
        };
        
        $scope.getJSON = function() {
            return angular.toJson($scope.players);
        };

    });