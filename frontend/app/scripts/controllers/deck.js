'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:DeckCtrl
 * @description
 * # DeckCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('DeckCtrl', function ($scope, $stateParams) {
    $scope.decks = [
    	{
    		'tag' : 'study',
    		'name-front' : 'GRE word',
    		'name-back' : 'Meaning'
    	},
    	{
    		'tag' : 'work',
    		'name-front' : 'CS3216 Presentation',
    		'name-back' : 'Notes'
    	},
    	{
    		'tag' : 'study',
    		'name-front' : 'Japanese word',
    		'name-back' : 'Meaning'
    	},
    	{
    		'tag' : 'life',
    		'name-front' : 'Dish',
    		'name-back' : 'Recipe'
    	},
    	{
    		'tag' : 'life',
    		'name-front' : 'Book title',
    		'name-back' : 'Comments'
    	}
    ];
    $scope.stateId = $stateParams.id;
  });
