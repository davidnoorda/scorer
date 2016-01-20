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

    describe('addPlayer()', function () {

        it('should add player', function () {
            var $scope = {};
            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            expect($scope.players[0].name).toBe("First");
        });

        it('should add player with empty turns equal to the current turn', function () {
            var $scope = {};

            $controller('ScorerController', { $scope: $scope });

            $scope.currentTurn = 4;

            $scope.playerName = "New Guy";
            $scope.addPlayer();

            expect($scope.players[0].turns.length).toBe(4);
        });

        it('should clear player name', function () {
            var $scope = {};
            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            expect($scope.playerName).toBe("");
        });

        it('should set new turn prompt to false', function () {
            var $scope = {};
            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            expect($scope.newTurnPrompt).toBe(false);
        });

    });

    describe('getCurrentPlayer()', function () {

        it('with no players, should return null', function () {
            var $scope = {};
            $controller('ScorerController', { $scope: $scope });

            expect($scope.getCurrentPlayer()).toBe(null);
        });

        it('with one player, should return that player', function () {
            var $scope = {};
            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            expect($scope.getCurrentPlayer()).toBe($scope.players[0]);
        });

        it('with one player who made last shot, should return that player', function () {
            var $scope = {};
            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            $scope.addHit();

            expect($scope.getCurrentPlayer()).toBe($scope.players[0]);
        });

        it('with one player who missed last shot, should return null', function () {
            var $scope = {};
            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            $scope.addHit();
            $scope.addMiss();

            expect($scope.getCurrentPlayer()).toBe(null);
        });

        it('with one player who has no shots for turn, should return that player', function () {
            var $scope = {};
            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            $scope.addHit();
            $scope.addMiss();
            
            $scope.newTurn();

            expect($scope.getCurrentPlayer()).toBe($scope.players[0]);
        });

        it('with more than one player, should return player after last player to miss', function () {
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

        it('when turn has incremented, should return first player', function () {
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

            $scope.newTurn();

            expect($scope.getCurrentPlayer().name).toBe("First");
        });

    });

    describe('addHit()', function () {

        it('addHit(), should add shot, with made == true', function () {
            var $scope = {};
            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            $scope.addHit();

            expect($scope.players[0].turns[0].shots[0].made).toBe(true);
        });

        it('addHit(), should increment hits for current players turn', function () {
            var $scope = {};
            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            $scope.addHit();

            expect($scope.players[0].turns[0].hits).toBe(1);
        });

    });

    describe('addMiss()', function () {

        it('addMiss(), should add shot, with made == false', function () {
            var $scope = {};
            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            $scope.addMiss();

            expect($scope.players[0].turns[0].shots[0].made).toBe(false);
        });

    });

    describe('canAddPlayer()', function () {

        it('canAddPlayer(), when there are no players, returns true', function () {
            var $scope = {};

            $controller('ScorerController', { $scope: $scope });

            expect($scope.canAddPlayer()).toBe(true);
        });

        it('canAddPlayer(), when current shooter has not shot, returns false', function () {
            var $scope = {};

            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            expect($scope.canAddPlayer()).toBe(false);
        });

        it('canAddPlayer(), when current shooter has not missed, returns false', function () {
            var $scope = {};

            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            $scope.addHit();
            $scope.addHit();

            expect($scope.canAddPlayer()).toBe(false);
        });

    });

    describe('undo()', function () {

        it('undo(), removes the last shot', function () {
            var $scope = {};

            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            $scope.addHit();
            $scope.addHit();
            $scope.addMiss();

            $scope.playerName = "Second";
            $scope.addPlayer();

            $scope.addHit();
            $scope.addHit();

            $scope.undo();

            expect($scope.players[1].turns[0].shots.length).toBe(1);
        });

        it('undo(), when last shot was a miss, removes the miss', function () {
            var $scope = {};

            $controller('ScorerController', { $scope: $scope });

            $scope.playerName = "First";
            $scope.addPlayer();

            $scope.addHit();
            $scope.addHit();
            $scope.addMiss();

            $scope.playerName = "Second";
            $scope.addPlayer();

            $scope.addHit();
            $scope.addMiss();

            $scope.undo();

            expect($scope.players[1].turns[0].shots.length).toBe(1);
        });

    });

});
