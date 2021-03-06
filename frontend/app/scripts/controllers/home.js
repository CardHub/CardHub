'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('HomeCtrl', function ($rootScope, $scope, $state, $stateParams, $mdDialog, $mdToast, $mdBottomSheet, apiHelper, deckUtil) {

  function getDeck() {
    apiHelper.deck.get().then(function(res) {
      $scope.decks = res.data;
      updateDeckView($scope.deckFilter, $scope.deckFilter === 'deleted');
    }).catch(function(err) {
      console.log(err);
    });
  }

  var tagMap = {};

  //get user tags
  function getTag() {
    apiHelper.tag.get().then(function(res) {
      tagMap = {};
      for(var i=0; i<res.data.length; i++){
        var tagName = res.data[i].name;
        tagMap[tagName] = res.data[i].id;
      }
    }).catch(function(err) {
      console.log(err);
    });
  }

  $scope.$on('app:online', function() {
    $scope.$apply(function() {
      getTag();
      getDeck();
    });
  });

  getTag();
  getDeck();

  function createDeck(newDeck) {
    apiHelper.deck.create(newDeck).then(function(res) {
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

  function permDeleteDeck(id,acting,act) {
    apiHelper.deck.delete(id).then(function(res) {
      getDeck();
      showToast(true,'Success ' + acting + ' selected deck!');
    })
    .catch(function(err) {
      console.log(err);
      showToast(false,'Failed to ' + act + ' deck. Please try again.');
    });
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
  $scope.noDeck = false;
  // variables required by pageUtil directive
  $scope.deleting = false;
  $scope.changing = false;
  $scope.permDeleting = false;
  $scope.puttingBack = false;
  $scope.isDeleteFilter = false;
  $scope.selectedArray = [];
  // variables for tutorial walkthrough / help
  $scope.showWholeDeck = false;
  $scope.showUtilButton = false;
  $scope.showSidebarButton = false;
  // all color variable, later can be abstracted out into factory
  var colors = ['BEC6D5','F6CAC9','F4B794','E3EAA5','C3DDD6','D1C3D5','D1C2AB'];

  $scope.$on('showWholeDeck', function(event, args) {
    $scope.showWholeDeck = true;
  });

  function updateDeckView (deckFilter, deckDeleted) {
    $scope.isDeleteFilter = deckDeleted;
    function checkHasTag(tag) {
      return tag.name === deckFilter;
    }
    $scope.displayedDecks = [];
    for (var i=0;i < $scope.decks.length;i++) {
      var deck = $scope.decks[i];
      if (deckDeleted === deck.isDeleted) {
        if (deckDeleted || deckFilter ==='all') {
          $scope.displayedDecks.push(deck);
        } else {
          var hasTag = deck.Tags.some(checkHasTag);
          if (hasTag) {
            $scope.displayedDecks.push(deck);
          }
        }
      }
    }

    if($scope.displayedDecks.length===0 && !$scope.isDeleteFilter) {
      $scope.noDeck = true;
    }else{
      $scope.noDeck = false;
    }
  }

  if ($scope.deckFilter) {
    if ($scope.deckFilter !== 'deleted') {
      updateDeckView($scope.deckFilter, false);
    } else {
      updateDeckView($scope.deckFilter, true);
    }
  } else {
    updateDeckView($scope.deckFilter, false);
  }

  $scope.viewDeck = function(deckId) {
    $state.go('main.home.deck', {id: deckId});
  };

  //Add new deck dialog
  $scope.showAddDeckDialog = function() {
    deckUtil.showAddDeckDialog($scope.tagFilters, $scope.deckFilter, colors)
      .then(function(res) {
        if (res.status === "success") {
          createDeck(res.newDeck);
        } else {
          showToast(false, res.error);
        }
    });
  };

  //Select decks
  $scope.isSelected = function(deck) {
    return $scope.selectedArray.indexOf(deck) > -1;
  };
  $scope.select = function(deck) {
    if ($scope.deleting || $scope.permDeleting || $scope.puttingBack) {
      //toggle selected/not selected
      var idx = $scope.selectedArray.indexOf(deck);
      if (idx > -1) {
        $scope.selectedArray.splice(idx, 1);
      } else {
        $scope.selectedArray.push(deck);
      }
    } else if ($scope.changing) {
      $scope.changing = false;
      $scope.selectedArray = [];
      //go to update
      // showChangeDeckDialog(deck);
      deckUtil.showEditDeckDialog(deck, $scope.tagFilters, colors).then(function(res) {
        if (res.status === "success") {
          changeDeck(res.updatedDeck);
        } else {
          showToast(false, res.error);
        }
      });
    }
  };

  $scope.deleteDecks = function() {
    var payload = {isDeleted:"true"};
    for (var i=0; i<$scope.selectedArray.length; i++) {
      updateDeck($scope.selectedArray[i].id, payload, 'deleting','delete');
    }
  };

  $scope.permDeleteDecks = function() {
    for (var i=0; i<$scope.selectedArray.length; i++) {
      permDeleteDeck($scope.selectedArray[i].id, 'permanently deleting','permanently delete');
    }
  };

  $scope.putBackDecks = function() {
    var payload = {isDeleted:"false"};
    for (var i=0; i<$scope.selectedArray.length; i++) {
      updateDeck($scope.selectedArray[i].id, payload, 'putting back','put back');
    }
  };
});
