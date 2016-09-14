'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:CreateCardCtrl
 * @description
 * # CreateCardCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('CreateCardCtrl', function ($scope, $stateParams, $state, UserAuth) {
  	$scope.deckId = $stateParams.deckId;

  	// redirect to the main page if current user is not the creater of the given deck, 
  	if (UserAuth.getCurrentUser()._id !== $scope.deckId) {
  		// $state.go('main.home');
  	}

    $scope.cancel = function() {
      $state.go( $state.previous.name, $state.previous.params );
    };

    $scope.create = function(cardData) {
    	console.log(cardData);
      // connect with backend API, pass cardData, if successful, then direct to create another card?
      $state.go('main.deck', {id : $scope.deckId});
    };
  });
