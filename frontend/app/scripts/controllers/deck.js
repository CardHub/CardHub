'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:DeckCtrl
 * @description
 * # DeckCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('DeckCtrl', function ($scope, $state, $stateParams, $mdDialog, UserAuth, apiHelper) {
    $scope.deckId = $stateParams.id;
    $scope.deck = {};
    apiHelper.deck.show($scope.deckId).then(function(res) {
      console.log(res.data);
      $scope.deck = res.data;
    }).catch(function(err) {
      console.log(err);
    });

    // check if current user is the owner
    $scope.isOwner = (UserAuth.getCurrentUser().fbId === $scope.deck.UserId);

    $scope.viewCard = function(deckId, cardId) {
      $state.go('main.card', {deckId: deckId, cardId: cardId});
    };

    $scope.showAddCardDialog = function(event) {
      $mdDialog.show({
        controller: CreateCardCtrl,
        templateUrl: 'views/createCard.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        fullscreen: true 
      })
      .then(function(newCard){
        console.log(newCard);
        apiHelper.card.create($scope.deckId, newCard).then(function(res) {
          console.log(res.data);
          // $scope.deck.push(newCard);
        })
        .catch(function(err) {
          console.log(err);
        });
      }, function() {
      });
    };

    function CreateCardCtrl($scope,$mdDialog) {
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.create = function(card) {
        var newCard = {
          front: card.front,
          back: card.back
        };
        $mdDialog.hide(newCard);
      };
    }
  });
