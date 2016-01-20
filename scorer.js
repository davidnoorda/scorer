/* global angular */
angular.module('scorerApp', [])
    .controller('ScorerController', function ($scope) {

        $scope.newTurnPrompt = false;
        $scope.currentTurn = 1;
        $scope.currentPlayer;
        $scope.players = [];

        $scope.newTurn = function () {
            for (var i = 0; i < $scope.players.length; i++) {
                $scope.players[i].turns.push({ shots: [], hits: 0 });
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
                player.turns.push({ shots: [], hits: 0 });
            }
            $scope.players.push(player);
            $scope.playerName = "";
            $scope.newTurnPrompt = false;
        };

        $scope.addHit = function () {
            var player = $scope.getCurrentPlayer();
            var turn = player.turns[$scope.currentTurn - 1];
            turn.hits++;
            turn.shots.push({ made: true });
        };

        $scope.addMiss = function () {
            var player = $scope.getCurrentPlayer();
            player.turns[$scope.currentTurn - 1].shots.push({ made: false });
        };

        $scope.undo = function () {
            var totalPlayers = $scope.players.length;
            var players = $scope.players;

            for (var i = totalPlayers; i >= totalPlayers; i--) {
                var turn = players[i - 1].turns[$scope.currentTurn - 1];
                var shots = turn.shots;
                if (shots) {
                    if (shots[shots.length - 1].made) {
                        turn.hits--;
                    }
                    shots.pop();
                    break;
                }
            }
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

        $scope.getTurnHits = function () {
            var currentPlayer = $scope.getCurrentPlayer();
            if (currentPlayer) {
                var turn = currentPlayer.turns[$scope.currentTurn - 1];
                return turn.hits;
            } else {
                return null;
            }
        };

        $scope.getCurrentPlayer = function () {
            var players = $scope.players;

            if (players.length > 0) {
                var currentPlayer;
                for (var i = 0; i < players.length; i++) {
                    var player = players[i];
                    var turn = player.turns[$scope.currentTurn - 1];
                    var shot = turn.shots[turn.shots.length - 1];

                    if (shot === undefined || shot.made === true) {
                        currentPlayer = player;
                        break;
                    }
                }
                if (currentPlayer) {
                    return currentPlayer;
                } else {
                    $scope.newTurnPrompt = true;
                    return null;
                }
            } else {
                return null;
            }

        };

        $scope.getJSON = function () {
            return angular.toJson($scope.players);
        };

    });