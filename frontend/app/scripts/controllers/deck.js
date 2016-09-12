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
    $scope.deck = $stateParams.deck;

    $scope.viewCard = function(card, tags) {
      $state.go("main.card", {card: card, tags: tags});
    }
  });
