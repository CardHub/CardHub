'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:CreateDeckCtrl
 * @description
 * # CreateDeckCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('CreateDeckCtrl', function ($scope) {
    $scope.create = function(deck) {
      console.log(deck);
    };
  });
