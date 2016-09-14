'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:EditDeckCtrl
 * @description
 * # EditDeckCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('EditDeckCtrl', function ($scope, $state, $stateParams, UserAuth) {
  	$scope.deckId = $stateParams.id;
  	
  	// redirect to the main page if current user is not the creater of the given deck, 
  	if (UserAuth.getCurrentUser()._id !== $scope.deckId) {
  		// $state.go('main.home');
  	}

    $scope.update = function(deck) {
      console.log(deck);
      // update deck with backend, redirect in the callback
    };
  });