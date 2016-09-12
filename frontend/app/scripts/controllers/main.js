'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MainCtrl', function ($scope, $timeout, $mdSidenav, $state, UserAuth) {
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

    //To be replaced by FB data
    //$scope.userPhoto = '/../../images/user_photo.jpg';
    //$scope.userName = 'Luo Xiao Hei';

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
    $scope.deckFilter = "";
    $scope.changeFilter = function(filter) {
      if (filter==='deleted') {
        $scope.deckDeleted = true;
      } else {
        $scope.deckFilter = filter;
        $scope.deckDeleted = false;
      }
      $scope.toggleLeft();
      // $scope.$broadcast('changeFilterEvent', {
      //   deckFilter: $scope.deckFilter,
      //   deckDeleted: $scope.deckDeleted
      // });
      $state.go("main.home", {filterTag: $scope.deckFilter});
      // $scope.goTo('/home','main.home');
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
  });
