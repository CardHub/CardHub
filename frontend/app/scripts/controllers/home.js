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

  function deleteDecks(decks) {
    var payload = {isDeleted:"true"};
    for (var i=0; i<decks.length; i++) {
      updateDeck(decks[i].id,payload,'deleting','delete');
    }  
  }

  function changeDeck(changedDeck) {
    var tagIds = [];
    for (var i=0; i<changedDeck.Tags.length; i++) {
      tagIds.push(tagMap[changedDeck.Tags[i]]);
    }
    var payload = {
      name: changedDeck.name,
      isPublic: changedDeck.isPublic,
      Tags: tagIds
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
    //hide checkboxes
    $scope.deleting = false;
    $scope.changing = false;
    selected = [];
  
    $mdDialog.show({
      controller: CreateDeckCtrl,
      templateUrl: 'views/createDeck.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose:true,
      fullscreen: true ,
      locals: {
        tags: $scope.tagFilters,
        currentTag:$scope.deckFilter
      }
    })
    .then(function(newDeck){
      createDeck(newDeck);
    }, function() {
    });
  };

  function CreateDeckCtrl($scope,$mdDialog,tags,currentTag) {
    $scope.tags = tags;
    $scope.title = 'Create new deck';
    $scope.submitBtn = 'Add deck';
    $scope.deck = {
      isPublic : false,
      tag: [currentTag]
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.create = function(deck) {
      var newDeck = {
        name: deck.name,
        tags: deck.tag,
        isPublic: deck.isPublic,
        isDeleted: false
      };
      $mdDialog.hide(newDeck);
    };
  }

  //Change deck dialog
  function showChangeDeckDialog(deck) {
    $scope.changing = false;
    selected = [];
    $mdDialog.show({
      controller: ChangeDeckCtrl,
      templateUrl: 'views/createDeck.html',
      parent: angular.element(document.body),
      clickOutsideToClose:true,
      fullscreen: true,
      locals: {
        selectedDeck: deck,
        tags: $scope.tagFilters
      } 
    })
    .then(function(updatedDeck){
      changeDeck(updatedDeck);
    }, function() {
    });
  }

  function ChangeDeckCtrl($scope,$mdDialog,selectedDeck,tags) {
    console.log(selectedDeck);
    $scope.tags = tags;
    $scope.title = 'Change selected deck';
    $scope.submitBtn = 'Update deck';
    var tagNames = [];
    for (var i=0; i<selectedDeck.Tags.length; i++) {
      tagNames.push(selectedDeck.Tags[i].name);
    }
    $scope.deck = {
      name : selectedDeck.name,
      tag : tagNames,
      isPublic : selectedDeck.isPublic
    };
    console.log(selectedDeck.Tags[0].name);
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.create = function(deck) {
      var updatedDeck = {
        id: selectedDeck.id,
        name: deck.name,
        Tags: deck.tag,
        isPublic: deck.isPublic,
        isDeleted: false
      };
      $mdDialog.hide(updatedDeck);
    };
  }

  $scope.showUpdateOptions = function() {
    $scope.changing=true; 
    $scope.deleting=false;
    selected=[];
  };

  $scope.cancelChange = function() {
    $scope.changing=false;
    selected=[];
  };

  //Select decks
  var selected = [];

  $scope.isSelected = function(deck) {
    return selected.indexOf(deck) > -1;
  };

  $scope.select = function(deck) {
    if ($scope.deleting) {
      //toggle selected/not selected
      var idx = selected.indexOf(deck);
      if (idx > -1) {
        selected.splice(idx, 1);
      } else {
        selected.push(deck);
      }
    } else if ($scope.changing) {
      //go to update
      showChangeDeckDialog(deck);
    }
  };

  $scope.isAllSelected = function() {
    return selected.length === $scope.displayedDecks.length;
  };

  $scope.toggleAll = function() {
    if (selected.length === $scope.displayedDecks.length) {
      selected = [];
    } else if (selected.length === 0 || selected.length > 0) {
      selected = $scope.displayedDecks.slice(0);
    }
  };

  $scope.showDeleteOptions = function() {
    $scope.deleting=true; 
    $scope.changing=false; 
  };

  $scope.cancelDelete = function() {
    $scope.deleting = false;
    selected=[];
  };

  $scope.deleteDecks = function() {
    if(selected.length===0) {
      showToast(false, 'Please select deck to delete.');
    } else {
      deleteDecks(selected);
      selected = [];
      $scope.deleting = false;
    }
  };

});
