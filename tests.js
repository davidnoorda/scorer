/* global beforeEach */
/* global expect */
/* global it */
/* global describe */

describe('scorer', function () {

    beforeEach(angular.mock.module('scorerApp'));

    var $controller;

    beforeEach(angular.mock.inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    describe('players', function () {

        it('addPlayer(), should add player', function () {
            var $scope = {};
            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            expect($scope.players[0].name).toBe("First");
        });

        it('getCurrentPlayer(), with only one player, should return that player', function () {
            var $scope = {};
            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            expect($scope.getCurrentPlayer().name).toBe("First");
        });

        it('addHit(), should add shot, with made == true', function () {
            var $scope = {};
            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            $scope.addHit();

            expect($scope.players[0].turns[0].shots[0].made).toBe(true);
        });

        it('addMiss(), should add shot, with made == false', function () {
            var $scope = {};
            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            $scope.addMiss();

            expect($scope.players[0].turns[0].shots[0].made).toBe(false);
        });

        it('getCurrentPlayer(), with more than one player, should return player after last player to miss', function () {
            var $scope = {};

            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            $scope.addHit();
            $scope.addMiss();

            $scope.playerName = "Second";
            $scope.addPlayer();

            $scope.addMiss();

            $scope.playerName = "Third";
            $scope.addPlayer();

            $scope.addMiss();

            $scope.playerName = "Fourth";
            $scope.addPlayer();

            expect($scope.getCurrentPlayer().name).toBe("Fourth");
        });

        it('getCurrentPlayer(), when last player has missed, should return first player', function () {
            var $scope = {};

            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            $scope.addHit();
            $scope.addMiss();

            $scope.playerName = "Second";
            $scope.addPlayer();

            $scope.addMiss();

            $scope.playerName = "Third";
            $scope.addPlayer();

            $scope.addMiss();

            $scope.playerName = "Fourth";
            $scope.addPlayer();

            $scope.addMiss();

            expect($scope.getCurrentPlayer().name).toBe("First");
        });

        it('addPlayer(), when currentTurn == 4, should add player with 4 empty turns', function () {
            var $scope = {};

            $controller('ScorerController', { $scope: $scope });

            $scope.currentTurn = 4;

            $scope.playerName = "New Guy";
            $scope.addPlayer();

            expect($scope.players[0].turns.length).toBe(4);
        });

        it('canAddPlayer(), when there are no players, returns true', function () {
            var $scope = {};

            $controller('ScorerController', { $scope: $scope });

            expect($scope.canAddPlayer()).toBe(true);
        });



    });

});
