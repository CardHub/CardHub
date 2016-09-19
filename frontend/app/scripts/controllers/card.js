'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:CardCtrl
 * @description
 * # CardCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('CardCtrl', function ($scope, $stateParams, $state, $mdDialog, UserAuth, apiHelper, cardUtil) {
    $scope.deckId = $stateParams.deckId;
    $scope.cardId = $stateParams.cardId;

    $scope.card = {};
    $scope.deck = {Cards:[]};
    $scope.isOwner = false;
    $scope.isCardFront = true;
    function getCardInDeck() {
      apiHelper.deck.show($scope.deckId).then(function(res) {
        console.log(res.data);
        $scope.deck = res.data;
        for (var i = 0; i < $scope.deck.Cards.length; i++) {
          if ($scope.deck.Cards[i].id == $scope.cardId) {
            $scope.card = $scope.deck.Cards[i];
            break;
          }
        }
        // check if current user is the owner
        $scope.isOwner = (UserAuth.getCurrentUser().id === $scope.deck.UserId);
      }).catch(function(err) {
        console.log(err);
      });
    }
    getCardInDeck();

    $scope.createCard = function(event) {
      cardUtil.showAddCardDialog($scope.deckId, $scope.deck.name, event).then(function(res) {
        if (res.status === "success") {
          $state.go('main.card', {deckId: $scope.deckId, cardId: res.cardId});
        } else {
          console.log(res.error);
        }
      });
    };

    $scope.updateCard = function(event) {
      cardUtil.showEditCardDialog($scope.deckId, $scope.card, event).then(function(res) {
        if (res.status === "success") {
          getCardInDeck();
        } else {
          console.log(res.error);
        }
      });
    };
  });
