'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:DeckCtrl
 * @description
 * # DeckCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('DeckCtrl', function ($scope, $state, $stateParams, UserAuth, apiHelper) {
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
    $scope.isOwner = true;

    $scope.viewCard = function(deckId, cardId) {
      $state.go('main.card', {deckId: deckId, cardId: cardId});
    };

    $scope.createCard = function() {
      $state.go('main.createCard', {deckId: $scope.deckId});
    };
  });
