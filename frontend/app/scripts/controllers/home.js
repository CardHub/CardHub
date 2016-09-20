'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('HomeCtrl', function ($scope, $state, $stateParams, $mdDialog, $mdToast, $mdBottomSheet, apiHelper) {
  
  function getDeck() {
    apiHelper.deck.get().then(function(res) {
      $scope.decks = res.data;
      console.log(res);
      $scope.updateDeckView($scope.deckFilter, $scope.deckDeleted);
    }).catch(function(err) {
      console.log(err);
    });
  }

  var tagMap = {};

  //get user tags
  apiHelper.tag.get().then(function(res) {
    tagMap = {};
    console.log(res.data);
    for(var i=0; i<res.data.length; i++){
      var tagName = res.data[i].name;
      tagMap[tagName] = res.data[i].id;
    }
    console.log(tagMap);
  }).catch(function(err) {
    console.log(err);
  });

  getDeck();

  function createDeck(newDeck) {
    console.log("new deck");
    console.log(newDeck);
    apiHelper.deck.create(newDeck).then(function(res) {
      console.log(res.data);
      showToast(true,'Success creating deck!');
      getDeck();
    })
    .catch(function(err) {
      showToast(false,'Failed to create deck. Please try again.');
      console.log(err);
    });
  }

  function updateDeck(id, payload, acting, act) {
    apiHelper.deck.update(id,payload).then(function(res) {
      console.log(res.data);
      getDeck();
      showToast(true,'Success ' + acting + ' selected deck!');
    })
    .catch(function(err) {
      console.log(err);
      showToast(false,'Failed to ' + act + ' deck. Please try again.');
    });
  }

  function changeDeck(changedDeck) {
    var tagIds = [];
    for (var i=0; i<changedDeck.Tags.length; i++) {
      tagIds.push(tagMap[changedDeck.Tags[i]]);
    }
    var payload = {
      name: changedDeck.name,
      isPublic: changedDeck.isPublic,
      Tags: tagIds,
      color: changedDeck.color
    };
    updateDeck(changedDeck.id,payload,'updating','update');   
  }

  function showToast(success,msg) {
    var theme;
    if (success) {
      theme = 'success-toast';
    } else {
      theme = 'failure-toast';
    }
    $mdToast.show(
      $mdToast.simple()
        .textContent(msg)
        .position('top right')
        .theme(theme)
        .hideDelay(3000)
    );
  }
    
  $scope.decks = [];
  $scope.displayedDecks = $scope.decks;
  $scope.selectedTag= '';
  $scope.deckFilter = $stateParams.filterTag;
  var colors = ['BEC6D5','F6CAC9','F4B794','E3EAA5','C3DDD6','D1C3D5','D1C2AB'];

  $scope.updateDeckView = function(deckFilter, deckDeleted) {      
    function checkHasTag(tag) {
      return tag.name === deckFilter;
    }
    $scope.displayedDecks = [];
    for (var i=0;i < $scope.decks.length;i++) {
      var deck = $scope.decks[i];
      if (deckDeleted === deck.isDeleted) {
        if (deckDeleted || deckFilter === undefined || deckFilter === '') {
          $scope.displayedDecks.push(deck);
        } else {
          var hasTag = deck.Tags.some(checkHasTag);
          if (hasTag) {
            $scope.displayedDecks.push(deck);
          }
        }
      }
    }
  };
  if ($scope.deckFilter) {
    if ($scope.deckFilter !== 'deleted') {
      $scope.updateDeckView($scope.deckFilter, false);
    } else {
      $scope.updateDeckView($scope.deckFilter, true);
    }
  } else {
    $scope.updateDeckView($scope.deckFilter, false);
  }

  $scope.viewDeck = function(deckId) {
    $state.go('main.deck', {id: deckId});
  };

  //Add new deck dialog
  $scope.showAddDeckDialog = function(event) {
    $mdDialog.show({
      controller: CreateDeckCtrl,
      templateUrl: 'views/createDeck.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose:true,
      fullscreen: true ,
      locals: {
        tags: $scope.tagFilters,
        currentTag:$scope.deckFilter,
        colors: colors
      }
    })
    .then(function(newDeck){
      createDeck(newDeck);
    }, function() {
    });
  };

  function CreateDeckCtrl($scope,$mdDialog,tags,currentTag,colors) {
    $scope.tags = tags;
    $scope.title = 'Create new deck';
    $scope.submitBtn = 'Add deck';
    $scope.colors = colors;
    $scope.deck = {
      isPublic : false,
      tag: [currentTag],
      color: colors[0]
    };
    $scope.updateColor = function(selected) {
      $scope.deck.color=selected;
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.create = function(deck) {
      var newDeck = {
        name: deck.name,
        tags: deck.tag,
        isPublic: deck.isPublic,
        isDeleted: false,
        color: deck.color
      };
      $mdDialog.hide(newDeck);
    };
  }

  //Change deck dialog
  function showChangeDeckDialog(deck) {
    $mdDialog.show({
      controller: ChangeDeckCtrl,
      templateUrl: 'views/createDeck.html',
      parent: angular.element(document.body),
      clickOutsideToClose:true,
      fullscreen: true,
      locals: {
        selectedDeck: deck,
        tags: $scope.tagFilters,
        colors: colors
      } 
    })
    .then(function(updatedDeck){
      changeDeck(updatedDeck);
    }, function() {
    });
  }

  function ChangeDeckCtrl($scope,$mdDialog,selectedDeck,tags,colors) {
    console.log(selectedDeck);
    $scope.tags = tags;
    $scope.title = 'Change selected deck';
    $scope.submitBtn = 'Update deck';
    $scope.colors = colors;
    var tagNames = [];
    for (var i=0; i<selectedDeck.Tags.length; i++) {
      tagNames.push(selectedDeck.Tags[i].name);
    }
    $scope.deck = {
      name : selectedDeck.name,
      tag : tagNames,
      isPublic : selectedDeck.isPublic,
      color: selectedDeck.color
    };
    $scope.updateColor = function(selected) {
      $scope.deck.color=selected;
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.create = function(deck) {
      var updatedDeck = {
        id: selectedDeck.id,
        name: deck.name,
        Tags: deck.tag,
        isPublic: deck.isPublic,
        isDeleted: false,
        color: deck.color
      };
      $mdDialog.hide(updatedDeck);
    };
  }

  //Select decks
  $scope.selected = [];
  $scope.isSelected = function(deck) {
    return $scope.selected.indexOf(deck) > -1;
  };
  $scope.select = function(deck) {
    if ($scope.deleting) {
      //toggle selected/not selected
      var idx = $scope.selected.indexOf(deck);
      if (idx > -1) {
        $scope.selected.splice(idx, 1);
      } else {
        $scope.selected.push(deck);
      }
    } else if ($scope.changing) {
      $scope.changing = false;
      $scope.selected = [];
      //go to update
      showChangeDeckDialog(deck);
    }
  };

  $scope.deleteDecks = function() {
    var payload = {isDeleted:"true"};
    for (var i=0; i<$scope.selected.length; i++) {
      updateDeck($scope.selected[i].id, payload, 'deleting','delete');
    }  
  };
});
