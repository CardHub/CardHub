'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MainCtrl', function ($rootScope,$scope, $timeout, $mdSidenav, $mdDialog,$state, UserAuth, apiHelper) {

    $scope.tagFilters = {};

    //get user tags
    apiHelper.tag.get().then(function(res) {
      $scope.tagFilters = res.data;
      console.log($scope.tagFilters);
    }).catch(function(err) {
      console.log(err);
    });

    $scope.publicStates = [
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

    $scope.showEditTagsDialog = function() {
      $mdDialog.show({
        controller: EditTagsCtrl,
        templateUrl: 'views/editTags.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose:true,
        fullscreen: true ,
        locals: {
          originalTags: $scope.tagFilters
        }
      })
      .then(function(newDeck){
        createDeck(newDeck);
      }, function() {
      });
    };

    function EditTagsCtrl($scope,$mdDialog,originalTags) {
      $scope.tags = angular.copy(originalTags);
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.create = function(deck) {
        var newDeck = {
          name: deck.name,
          tags: deck.tag,
          isPublic: deck.isPublic,
          isDeleted: false,
          color: deck.color
        };
        $mdDialog.hide(newDeck);
      };
    }
  });
