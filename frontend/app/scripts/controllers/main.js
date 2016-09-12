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
    $scope.personalStates = [
      {
        'name': 'All',
        'color': 'white',
        'state': 'main.home'
      },
      {
        'name': 'Study',
        'color': 'study',
        'state': 'main.deck',
        'stateId': 'study'
      },
      {
        'name': 'Work',
        'color': 'work',
        'state': 'main.deck',
        'stateId': 'work'
      },
      {
        'name': 'Life',
        'color': 'life',
        'state': 'main.deck',
        'stateId': 'life'
      },
      {
        'name': 'Deleted',
        'color': 'white',
        'state': 'main.deck',
        'stateId': 'deleted'
      }
    ];

    $scope.publicStates = [
      {
        'name': 'Starred',
        'icon': 'stars',
        'state': 'main.deck'
      },
      {
        'name': 'Explore',
        'icon': 'explore',
        'state': 'main.deck'
      }
    ];

    //To be replaced by FB data
    $scope.userPhoto = '/../../images/user_photo.jpg';
    $scope.userName = 'Luo Xiao Hei';

    // Default state
    $scope.currentState = function() {
      return $state.current;
    };

    $scope.goTo = function(stateUrl, stateId) {
      $scope.toggleLeft();
      $state.go(stateUrl, {id: stateId});
    };


    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    function logOut() {
      
    }
  });
