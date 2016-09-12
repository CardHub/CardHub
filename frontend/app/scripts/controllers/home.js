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
    		'name' : 'GRE vocab'
    	},
    	{
    		'tag' : 'work',
    		'name' : 'CS3216 Presentation dscdsvsvvvvvvvvvvvvvvvvvvffffffffffffffffffffffdddddddddddddddddd',
    	},
    	{
    		'tag' : 'study',
    		'name' : 'Japanese kanji',
    	},
    	{
    		'tag' : 'life',
    		'name' : 'Recipe'
    	},
    	{
    		'tag' : 'life',
    		'name' : 'Book titles'
    	}
    ];
  });
