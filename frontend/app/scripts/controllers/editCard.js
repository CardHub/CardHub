'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:EditCardCtrl
 * @description
 * # EditCardCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('EditCardCtrl', function ($scope, $stateParams, $state, UserAuth) {
  	$scope.deckId = $stateParams.deckId;
    $scope.cardId = $stateParams.cardId;

    // retrieve card info based on (deckId, cardId) dummy variable here:

  	// redirect to the main page if current user is not the creater of the given deck, 
  	if (UserAuth.getCurrentUser()._id !== $scope.deckId) {
  		// $state.go('main.home');
  	}

    $scope.update = function(cardData) {
    	console.log(cardData);
      // connect with backend API, update with cardData
      $state.go('main.card', {deckId: $scope.deckId, cardId: $scope.cardId});
    };
  });
