'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:CardCtrl
 * @description
 * # CardCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('CardCtrl', function ($scope, $stateParams) {
    $scope.cards = [
    	{
        'tag' : 'study',
        'cardId': '1',
        'nameFront' : 'GRE word',
        'nameBack' : 'Meaning'
      },
      {
        'tag' : 'work',
        'cardId': '1',
        'nameFront' : 'CS3216 Presentation',
        'nameBack' : 'Notes'
      },
      {
        'tag' : 'study',
        'cardId': '2',
        'nameFront' : 'Japanese word',
        'nameBack' : 'Meaning'
      },
      {
        'tag' : 'life',
        'cardId': '1',
        'nameFront' : 'Dish',
        'nameBack' : 'Recipe'
      },
      {
        'tag' : 'life',
        'cardId': '2',
        'nameFront' : 'Book title',
        'nameBack' : 'Comments'
      }
    ];
    $scope.stateId = $stateParams.id;
    $scope.cardId = $stateParams.cardId;
    $scope.isCardFront = true;
  });
