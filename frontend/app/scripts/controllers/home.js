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
    		'tag' : 'study',
    		'name-front' : 'GRE word',
    		'name-back' : 'Meaning'
    	},
    	{
    		'tag' : 'study',
    		'name-front' : 'GRE word',
    		'name-back' : 'Meaning'
    	},
    	{
    		'tag' : 'study',
    		'name-front' : 'GRE word',
    		'name-back' : 'Meaning'
    	}
    ];
  });
