'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('HomeCtrl', function ($scope, $state, $stateParams, DeckApi, Util,userDeckListData) {

    $scope.decks = userDeckListData;
    $scope.displayedDecks = $scope.decks;
    $scope.selectedTag = '';
    $scope.deckFilter = $stateParams.filterTag;

    $scope.updateDeck = function(deckFilter, deckDeleted) {
      function checkHasTag(tag) {
        return tag.name === deckFilter;
      }
      $scope.displayedDecks = [];
      for (var i=0;i < $scope.decks.length;i++) {
        var deck = $scope.decks[i];
        if (deckDeleted === deck.isDeleted) {
          if (deckDeleted || deckFilter === undefined || deckFilter === '') {
            $scope.displayedDecks.push(deck);
          } else {
            var hasTag = deck.tags.some(checkHasTag);
            if (hasTag) {
              $scope.displayedDecks.push(deck);
            }
          }
        }
      }
    };
    if ($scope.deckFilter) {
      if ($scope.deckFilter !== 'deleted') {
        $scope.updateDeck($scope.deckFilter, false);
      } else {
        $scope.updateDeck($scope.deckFilter, true);
      }
    } else {
      $scope.updateDeck($scope.deckFilter, false);
    }

    $scope.viewDeck = function(deckId) {
      $state.go('main.deck', {id: deckId});
    };

    $scope.addDeck = function() {
      $state.go('main.createDeck');
    };
  });
