/* global angular */
angular.module('scorerApp', [])
    .controller('ScorerController', function ($scope) {

        $scope.newTurnPrompt = false;

        $scope.currentTurn = 1;
        $scope.currentPlayer;

        $scope.players = [];
        // [{
        //     name: 'First',
        //     turns: [{
        //         shots: []
        //     }]
        // }]
        
        $scope.newTurn = function () {
            for (var i = 0; i < $scope.players.length; i++) {
                $scope.players[i].turns.push({ shots: [] });
            }
            $scope.newTurnPrompt = false;
            $scope.currentTurn++;
        };

        $scope.canAddPlayer = function () {
            var shooter = $scope.getCurrentPlayer();

            if (shooter) {
                var turn = shooter.turns[$scope.currentTurn - 1];
                var shots = turn.shots.length;

                if (shots === 0) {
                    return false;
                } else {
                    var misses = $scope.getMisses(turn);
                    if (misses > 0) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return true;
            }


        };

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
            var hits = turn.shots.filter(function (el) {
                return el.made === true;
            });

            return hits.length;
        };

        $scope.getMisses = function (turn) {
            var hits = turn.shots.filter(function (el) {
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
                    $scope.newTurnPrompt = true;
                    return $scope.players[0];
                }
            } else {
                return null;
            }
        };

        $scope.getJSON = function () {
            return angular.toJson($scope.players);
        };

    });