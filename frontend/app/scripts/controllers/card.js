'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:CardCtrl
 * @description
 * # CardCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('CardCtrl', function ($scope, $stateParams, $state, UserAuth, apiHelper) {
    $scope.deckId = $stateParams.deckId;
    $scope.cardId = $stateParams.cardId;

    $scope.card = {};
    // $scope.deck = [];
    $scope.isOwner = false;
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

    $scope.isCardFront = true;

    $scope.editCard = function() {
      $state.go('main.editCard', {deckId: $scope.deckId, cardId: $scope.cardId});
    };
  });
