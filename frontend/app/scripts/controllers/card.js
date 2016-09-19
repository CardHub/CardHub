'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:CardCtrl
 * @description
 * # CardCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('CardCtrl', function ($scope, $stateParams, $state, $mdDialog, UserAuth, apiHelper) {
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

    $scope.showAddNewCardDialog = function(event) {
      console.log("show adding new card dialog");
    }

    $scope.showEditCardDialog = function(event) {
      $mdDialog.show({
        controller: EditCardCtrl,
        templateUrl: 'views/editCard.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        fullscreen: true,
        locals: {
          // deckName: $scope.deck.name
        }
      })
      .then(function(newCard){
        apiHelper.card.update($scope.deckId, $scope.cardId, newCard).then(function(res) {
          console.log(res.data);
          getCardInDeck();
        })
        .catch(function(err) {
          console.log(err);
        });
      }, function() {
      });
    };

    function EditCardCtrl($scope, $mdDialog) {
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.update = function(card) {
        var newCard = {
          front: card.front,
          back: card.back
        };
        $mdDialog.hide(newCard);
      };
    }
  });
