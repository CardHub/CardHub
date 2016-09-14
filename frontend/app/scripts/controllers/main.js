'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MainCtrl', function ($rootScope,$scope, $timeout, $mdSidenav, $state, UserAuth) {
    $scope.personalFilters = [
    {
        'title': 'All',
        'color': 'white',
      },
      {
        'title': 'Study',
        'color': 'study',
        'name': 'study'
      },
      {
        'title': 'Work',
        'color': 'work',
        'name': 'work'
      },
      {
        'title': 'Life',
        'color': 'life',
        'name': 'life'
      },
      {
        'title': 'Deleted',
        'color': 'white',
        'name': 'deleted'
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

    // Default state
    $scope.currentState = function() {
      return $state.current;
    };

    $scope.goTo = function(stateUrl, stateId) {
      $scope.toggleLeft();
      $state.go(stateUrl, {id: stateId});
    };

    // initialize filter variables
    $scope.deckDeleted = false;
    $scope.deckFilter = '';
    $scope.changeFilter = function(filter) {
      $scope.deckFilter = filter;
      if (filter==='deleted') {
        $scope.deckDeleted = true;
      } else {
        $scope.deckDeleted = false;
      }
      $scope.toggleLeft();
      $state.go('main.home', {filterTag: $scope.deckFilter});
    };

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    $scope.logOut = function() {
      $scope.toggleLeft();
      UserAuth.clearUserData();
      $state.go('login');
    };

    $scope.currentUser = UserAuth.getCurrentUser();

    $scope.viewUserProfile = function(userId) {
      $scope.toggleLeft();
      $state.go('main.user', {id: userId});
    };
  });
