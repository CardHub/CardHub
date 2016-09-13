'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:CreateCardCtrl
 * @description
 * # CreateCardCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('CreateCardCtrl', function ($scope) {
    $scope.create = function(card) {
      console.log(card);
    };
  });
