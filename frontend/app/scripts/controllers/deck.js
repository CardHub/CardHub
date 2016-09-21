'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:DeckCtrl
 * @description
 * # DeckCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('DeckCtrl', function ($scope, $state, $stateParams, $mdDialog, UserAuth, apiHelper, cardUtil) {
    $scope.deckId = $stateParams.id;
    $scope.deck = {};
    $scope.isOwner = false;
    $scope.deleting = false;
    $scope.changing = false;
    $scope.selected = [];

    // initialize to prevent directive error before async promise is returned
    $scope.deck = {Cards:[]};
    function getCards() {
      apiHelper.deck.show($scope.deckId).then(function(res) {
        console.log(res.data);
        $scope.deck = res.data;
        // check if current user is the owner
        $scope.isOwner = (UserAuth.getCurrentUser().id === $scope.deck.UserId);
      }).catch(function(err) {
        console.log(err);
      });
    }
    getCards();

    $scope.viewCard = function(deckId, cardId) {
      $state.go('main.home.deck.card', {cardId: cardId});
    };

    $scope.createCard = function(event) {
      cardUtil.showAddCardDialog($scope.deckId, $scope.deck.name, event).then(function(res) {
        if (res.status === "success") {
          getCards();
        } else {
          console.log(res.error);
        }
      });
    };

    // functions for change and delete
    $scope.isSelected = function(card) {
      return $scope.selected.indexOf(card) > -1;
    };

    $scope.select = function(card, event) {
      if ($scope.deleting) {
        // toggle selected/not selected
        var idx = $scope.selected.indexOf(card);
        if (idx > -1) {
          $scope.selected.splice(idx, 1);
        } else {
          $scope.selected.push(card);
        }
      } else if ($scope.changing) {
        cardUtil.showEditCardDialog($scope.deckId, card, event).then(function(res) {
          if (res.status === "success") {
            getCards();
          } else {
            console.log(res.error);
          }
        });
      }
    };

    $scope.deleteCards = function() {
      for (var i=0; i<$scope.selected.length; i++) {
        console.log("delete " + $scope.selected[i].id + " from deck " + $scope.deckId);
        apiHelper.card.delete($scope.deckId, $scope.selected[i].id);
      }
    };
  });
