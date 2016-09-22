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
    $scope.deckId = $stateParams.id;
    $scope.cardId = $stateParams.cardId;

    $scope.card = {};
    $scope.deck = {Cards:[]};
    $scope.isOwner = false;
    $scope.isCardFront = true;
    $scope.currentIndex = -1;
    // variables for help display
    $scope.showCardInfo = false;
    $scope.showSidebarButton = false;
    $scope.showUtilButton = false;

    $scope.$on('showCard', function(event, args) {
      $scope.showCardInfo = true;
    });

    function getCardInDeck() {
      apiHelper.deck.show($scope.deckId).then(function(res) {
        console.log(res.data);
        $scope.deck = res.data;

        if (!res.data.Cards) {
          $state.go('main.home', {filterTag: 'all'});
          return;
        }

        for (var i = 0; i < $scope.deck.Cards.length; i++) {
          if ($scope.deck.Cards[i].id == $scope.cardId) {
            $scope.card = $scope.deck.Cards[i];
            $scope.currentIndex = i;
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
          $state.go('main.home.deck.card', {deckId: $scope.deckId, cardId: res.cardId});
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

    $scope.deleteCard = function() {
      console.log("call delete card " + $scope.cardId + " from deck " + $scope.deckId + " in API");
      apiHelper.card.delete($scope.deckId, $scope.cardId).then(function(res) {
        console.log(res.data);
        $state.go('main.home.deck', {id: $scope.deckId});
      });
    };

    $scope.nextCard = function() {
      var length = $scope.deck.Cards.length;
      $scope.currentIndex = ($scope.currentIndex + 1) >= length ? length - 1 : ($scope.currentIndex + 1);
      $scope.card = $scope.deck.Cards[$scope.currentIndex];
      changeLocation($scope.card.id);
    };

    $scope.preCard = function() {
      $scope.currentIndex = ($scope.currentIndex - 1) > 0 ? ($scope.currentIndex - 1) : 0;
      $scope.card = $scope.deck.Cards[$scope.currentIndex];
      changeLocation($scope.card.id);
    };

    function changeLocation(cardId) {
      $state.go('main.home.deck.card', {deckId: $scope.deckId, cardId: cardId}, {notify: false});
    }
  });
