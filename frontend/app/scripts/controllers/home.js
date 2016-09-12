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
    		'name' : 'GRE vocab',
    		'isDeleted': false
    	},
    	{
    		'tag' : 'work',
    		'name' : 'CS3216 Presentation dscdsvsvvvvvvvvvvvvvvvvvvffffffffffffffffffffffdddddddddddddddddd',
    		'isDeleted': false
    	},
    	{
    		'tag' : 'work',
    		'name' : 'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    		'isDeleted': false
    	},
    	{
    		'tag' : 'study',
    		'name' : 'Japanese kanji 1',
    		'isDeleted': false
    	},
    	{
    		'tag' : 'study',
    		'name' : 'Japanese kanji 2',
    		'isDeleted': true
    	},
    	{
    		'tag' : 'life',
    		'name' : 'Recipe',
    		'isDeleted': false
    	},
    	{
    		'tag' : 'life',
    		'name' : 'Book titles',
    		'isDeleted': false
    	}
    ];
  });
