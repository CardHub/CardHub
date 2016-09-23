'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('UserCtrl', function ($scope, $stateParams, $state, apiHelper) {
    $scope.userId = $stateParams.id;
    $scope.user = {};
    // variables for help display
    $scope.showUserInfo = false;
    $scope.showUserDeckInfo = false;
    $scope.showSidebarButton = false;

    $scope.$on('showUser', function(event, args) {
      $scope.showUserInfo = true;
    });
    
    apiHelper.userDeck.show($scope.userId)
      .then(function(res) {
        $scope.user = res.data;
      });
      
    $scope.viewDeck = function(deckId) {
      $state.go('main.home.deck', {filterTag: 'all', id: deckId});
    };
  });
