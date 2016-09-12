'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:DeckCtrl
 * @description
 * # DeckCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('DeckCtrl', function ($scope, $state, $stateParams) {
    $scope.decks = [];
    $scope.stateId = $stateParams.id;

    $scope.viewCard = function(cardId) {
      console.log(cardId);
      $state.go("main.card", {id: $scope.stateId, cardId: cardId});
    }
  });
