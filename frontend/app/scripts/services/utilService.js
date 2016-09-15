'use strict';

angular.module('frontendApp').service('Util',function() {

  /*$scope.apiExample = {
      getDeck: function() {
        apiHelper.deck.get().then(function(res) {
          $scope.decks = res.data;
          console.log(res);
          $scope.updateDeckView($scope.deckFilter, $scope.deckDeleted);
        }).catch(function(err) {
          console.log(err);
        });
      },
      getTag: function() {
        apiHelper.tag.get().then(function(res) {
          $scope.tags = res.data;
          console.log(res.data);
        }).catch(function(err) {
          console.log(err);
        });
      },
      createDeck: function() {
        var newDeck = {name: "test deck",tags: ["work"],isPublic: true,isDeleted: false};
        apiHelper.deck.create(newDeck).then(function(res) {
          console.log(res.data);
        })
        .catch(function(err) {
          console.log(err);
        });
      },
      createTag: function() {
        var newTag = {name: "new tag"};
        apiHelper.tag.create(newDeck).then(function(res) {
          console.log(res.data);
          if (!res.data) {
            // empty response means duplicate tag name.
          }
        })
        .catch(function(err) {
          console.log(err);
        });
      },
      showDeck: function() {
        apiHelper.deck.show(1).then(function(res) {
          console.log(res.data);
          if (!res.data) {
            // empty response means couldn't show the deck (private or deleted tags from other user)
          }
        })
        .catch(function(err) {
          console.log(err);
        });
      },
      showTag: function() {
        apiHelper.tag.show(1).then(function(res) {
          console.log(res.data);
          if (!res.data) {
            // empty response means couldn't show the tag (private or deleted tags from other user)
          }
        })
        .catch(function(err) {
          console.log(err);
        });
      }
    };*/
	var mockUserDeckList = [
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
      'name' : 'CS3216 Presentation',
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
  	},
      {
      '_id' : '12wewe909112',
      'created_at': '2016-09-11T09:12:24.208Z',
      'updated_at': '2016-09-11T09:12:24.208Z',
      'name' : 'Grocery list',
      'owner' : 'asdasdoadkos',
      '__v': 0,
      'isDeleted': true,
      'public': false,
      'cards' : [
        {
          '_id': '4231212',
          'front' : 'Date',
          'back' : 'Grocery'
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

  return {
  	mockUserDeckList : mockUserDeckList
  };

});