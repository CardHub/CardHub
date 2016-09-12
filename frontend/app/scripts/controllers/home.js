'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('HomeCtrl', function ($scope, $state) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    // dummy data
    $scope.decks = [
    	{
        '_id' : '121212',
        'created_at': '2016-09-11T09:12:24.208Z',
        'updated_at': '2016-09-11T09:12:24.208Z',
        'name' : 'GRE vocab',
        'owner' : 'asdasdoadkos',
        '__v': 0,
        'isDeleted': false,
        'public': false,
        'cards' : [
          {
            '_id': '132131',
            'front' : 'GRE word',
            'back' : 'Meaning'
          }
        ],
    		'tags': [
          // {
          //   'name': 'study',
          //   '_id': 'dede131313'
          // },
          {
            'name': 'work',
            '_id': 'dede131313'
          }
        ]
    	},
    	{
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
    	},
    	{
        '_id' : '12535432',
        'created_at': '2016-09-11T09:12:24.208Z',
        'updated_at': '2016-09-11T09:12:24.208Z',
        'name' : 'Japanese kanji 1',
        'owner' : 'asdasdoadkos',
        '__v': 0,
        'isDeleted': false,
        'public': false,
        'cards' : [
          {
            '_id': '2654645',
            'front' : 'Japanese word',
            'back' : 'Meaning'
          }
        ],
        'tags' : [
          {
            'name': 'study',
            '_id': 'dede131313'
          }
        ]
    	},
    	{
        '_id' : '12909fe09112',
        'created_at': '2016-09-11T09:12:24.208Z',
        'updated_at': '2016-09-11T09:12:24.208Z',
        'name' : 'Recipe',
        'owner' : 'asdasdoadkos',
        '__v': 0,
        'isDeleted': false,
        'public': false,
    		'cards' : [
          {
            '_id': '1765756',
            'front' : 'Dish',
            'back' : 'Recipe'
          }
        ],
        'tags' : [
          {
            'name': 'life',
            '_id': 'dede898313'
          }
        ]
    	},
    	{
    		'_id' : '12wewe909112',
        'created_at': '2016-09-11T09:12:24.208Z',
        'updated_at': '2016-09-11T09:12:24.208Z',
        'name' : 'Book titles',
        'owner' : 'asdasdoadkos',
        '__v': 0,
        'isDeleted': false,
        'public': false,
        'cards' : [
          {
            '_id': '4231212',
            'front' : 'Book title',
            'back' : 'Comments'
          }
        ],
        'tags' : [
          {
            'name': 'life',
            '_id': 'dede898313'
          }
        ] 
    	}
    ];

    $scope.displayedDecks = $scope.decks;
    $scope.selectedTag = "";

    $scope.$on('changeFilterEvent', function (event, data) {
      var deckFilter = data.deckFilter;
      var deckDeleted = data.deckDeleted;
      $scope.displayedDecks = [];
      for (var deck of $scope.decks) {
        if (deckDeleted === deck.isDeleted) {
          if (deckDeleted || deckFilter==undefined) {
            $scope.displayedDecks.push(deck);
          } else {
            for (var tag of deck.tags) {
              if (tag.name === deckFilter) {
                $scope.displayedDecks.push(deck);
                break;
              }
            }
          }
        }
      }
    });
    
    $scope.viewDeck = function(deckId) {
      $state.go("main.deck", {id: deckId});
    }
  });
