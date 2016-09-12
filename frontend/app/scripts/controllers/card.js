'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:CardCtrl
 * @description
 * # CardCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('CardCtrl', function ($scope, $stateParams) {
    $scope.card = $stateParams.card;
    $scope.tags = $stateParams.tags;
    $scope.isCardFront = true;
  });
