'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:DeckCtrl
 * @description
 * # DeckCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('DeckCtrl', function ($scope, $state, $stateParams, UserAuth) {
    $scope.deckId = $stateParams.id;

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


    $scope.viewCard = function(deckId, cardId) {
      $state.go('main.card', {deckId: deckId, cardId: cardId});
    };
  });
