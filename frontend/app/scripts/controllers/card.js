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
    $scope.deckId = $stateParams.deckId;
    $scope.cardId = $stateParams.cardId;

    // dummy variable
    $scope.deck = {
        '_id' : '1212122112',
        'created_at': '2016-09-11T09:12:24.208Z',
        'updated_at': '2016-09-11T09:12:24.208Z',
        'name' : 'CS3216 Presentation dscdsvsvvvvvvvvvvvvvvvvvvffffffffffffffffffffffdddddddddddddddddd',
        'owner' : 'asdasdoadkos',
        '__v': 0,
        'isDeleted': false,
        'public': false,
        'cards' : [
          {
            '_id': '143141',
            'front' : 'CS3216 Presentation',
            'back' : 'Notes'
          }
        ],
        'tags' : [
          {
            'name': 'work',
            '_id': 'dede22131313'
          }
        ]
    };

    $scope.card = [];
    for (var i = 0; i < $scope.deck.cards.length; i++) {
      if ($scope.deck.cards[i]._id === $scope.cardId) {
        $scope.card = $scope.deck.cards[i];
        break;
      }
    }

    $scope.isCardFront = true;
  });
