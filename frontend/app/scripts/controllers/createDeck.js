'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:CreateDeckCtrl
 * @description
 * # CreateDeckCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('CreateDeckCtrl', function ($scope, $state) {
    $scope.create = function(deck) {
      console.log(deck);
      // add deck to backend, then create card in the callback
      var response = {"deckId" : "dummyDeck123"};
      $state.go('main.createCard', {deckId: response.deckId});
    };
  });
