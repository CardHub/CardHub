'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('HomeCtrl', function ($scope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

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
  });
