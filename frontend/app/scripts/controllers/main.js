'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MainCtrl', function ($scope, $timeout, $mdSidenav, $state) {
    $scope.states = [
      {
        'name': 'Home',
        'state': 'main.home'
      },
      {
        'name': 'Deck',
        'state': 'main.deck'
      }
    ];
    // Default state
    $scope.currentState = function() {
      return $state.current;
    };

    $scope.goTo = function(stateId) {
      $scope.toggleLeft();
      $state.go(stateId);
    };


    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');
  });
