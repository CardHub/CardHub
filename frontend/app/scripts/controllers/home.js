'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('HomeCtrl', function ($scope, $state, $stateParams, DeckApi, Util, apiHelper) {

    $scope.apiExample = {
      getDeck: function() {
        apiHelper.deck.get().then(function(res) {
          $scope.decks = res.data;
          console.log(res);
          $scope.updateDeck($scope.deckFilter, $scope.deckDeleted);
        }).catch(function(err) {
          console.log(err);
        });
      },
      getTag: function() {
        apiHelper.tag.get().then(function(res) {
          $scope.tags = res.data;
          console.log(res.data);
        }).catch(function(err) {
          console.log(err);
        });
      },
      createDeck: function() {
        var newDeck = {name: "test deck",tags: ["work"],isPublic: true,isDeleted: false};
        apiHelper.deck.create(newDeck).then(function(res) {
          console.log(res.data);
        })
        .catch(function(err) {
          console.log(err);
        });
      },
      createTag: function() {
        var newTag = {name: "new tag"};
        apiHelper.tag.create(newDeck).then(function(res) {
          console.log(res.data);
          if (!res.data) {
            // empty response means duplicate tag name.
          }
        })
        .catch(function(err) {
          console.log(err);
        });
      },
      showDeck: function() {
        apiHelper.deck.show(1).then(function(res) {
          console.log(res.data);
          if (!res.data) {
            // empty response means couldn't show the deck (private or deleted tags from other user)
          }
        })
        .catch(function(err) {
          console.log(err);
        });
      },
      showTag: function() {
        apiHelper.tag.show(1).then(function(res) {
          console.log(res.data);
          if (!res.data) {
            // empty response means couldn't show the tag (private or deleted tags from other user)
          }
        })
        .catch(function(err) {
          console.log(err);
        });
      }
    };

    $scope.decks = [];
    $scope.displayedDecks = $scope.decks;
    $scope.selectedTag = '';
    $scope.deckFilter = $stateParams.filterTag;
    $scope.apiExample.getDeck();

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
            var hasTag = deck.Tags.some(checkHasTag);
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
