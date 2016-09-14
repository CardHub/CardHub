'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:CardCtrl
 * @description
 * # CardCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('CardCtrl', function ($scope, $stateParams, UserAuth) {
    $scope.deckId = $stateParams.deckId;
    $scope.cardId = $stateParams.cardId;

    // dummy variable
    $scope.deck = {
        '_id' : '1212122112',
        'created_at': '2016-09-11T09:12:24.208Z',
        'updated_at': '2016-09-11T09:12:24.208Z',
        'name' : 'CS3216 Presentation dscdsvsvvvvvvvvvvvvvvvvvvffffffffffffffffffffffdddddddddddddddddd',
        'owner' : '10205718660725416',
        '__v': 0,
        'isDeleted': false,
        'public': false,
        'cards' : [
          {
            '_id': '143141',
            'front' : 'CS3216 Presentation',
            'back' : 'Notes'
          },
          {
            '_id': '1122334',
            'front' : 'CS5234 Problem Sets',
            'back' : 'Big Leg List'
          }
        ],
        'tags' : [
          {
            'name': 'work',
            '_id': 'dede22131313'
          }
        ]
    };
    
    // check if current user is the owner
    $scope.isOwner = (UserAuth.getCurrentUser().fbId === $scope.deck.owner);

    $scope.card = [];
    for (var i = 0; i < $scope.deck.cards.length; i++) {
      if ($scope.deck.cards[i]._id === $scope.cardId) {
        $scope.card = $scope.deck.cards[i];
        break;
      }
    }

    $scope.isCardFront = true;
  });
