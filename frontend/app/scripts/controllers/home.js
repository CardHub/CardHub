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
      $scope.updateDeck($scope.deckFilter, $scope.deckDeleted);
    }).catch(function(err) {
      console.log(err);
    });
  }

  getDeck();

  function createDeck(newDeck) {
    apiHelper.deck.create(newDeck).then(function(res) {
      console.log(res.data);
      showToast(true,'Deck creation success!');
      getDeck();
    })
    .catch(function(err) {
      showToast(false,'Failed to create deck. Please try again.');
      console.log(err);
    });
  }

  function deleteDecks(decks) {
    var payload = {isDeleted:"true"};
    for (var i=0; i<decks.length; i++) {
      apiHelper.deck.update(decks[i].id,payload).then(function(res) {
        console.log(res.data);
        getDeck();
        showToast(true,'Deleted selected deck!');
      })
      .catch(function(err) {
        console.log(err);
        success=false;
        showToast(false,'Failed delete deck. Please try again.');
      });
    }  
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
    /*$scope.apiExample = {
      getDeck: function() {
        apiHelper.deck.get().then(function(res) {
          $scope.decks = res.data;
          console.log(res);
          $scope.updateDeck($scope.deckFilter, $scope.deckDeleted);
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

  $scope.decks = [];
  $scope.displayedDecks = $scope.decks;
  $scope.selectedTag = '';
  $scope.deckFilter = $stateParams.filterTag;

  $scope.updateDeck = function(deckFilter, deckDeleted) {      
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
      $scope.updateDeck($scope.deckFilter, false);
    } else {
      $scope.updateDeck($scope.deckFilter, true);
    }
  } else {
    $scope.updateDeck($scope.deckFilter, false);
  }

  $scope.viewDeck = function(deckId) {
    $state.go('main.deck', {id: deckId});
  };

  $scope.addDeck = function(event) {
    //hide checkboxes
    $scope.deleting = false;
    $scope.changing = false;
    selected = [];
    if (selected.length>0) {
      //$scope.toggleAll();
      $scope.isSelected = false;
    }

    $mdDialog.show({
      controller: CreateDeckCtrl,
      templateUrl: 'views/createDeck.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose:true,
      fullscreen: true 
    })
    .then(function(newDeck){
      createDeck(newDeck);
    }, function() {
    });
  };

  function CreateDeckCtrl($scope,$mdDialog) {
    $scope.tags = ['study','work','life'];
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.create = function(deck) {
      var newDeck = {
        name: deck.name,
        tags: [deck.tag],
        isPublic: deck.isPublic,
        isDeleted: false
      };
      $mdDialog.hide(newDeck);
    };
  }

  var selected = [];

  $scope.isSelected = function(deck) {
    return selected.indexOf(deck) > -1;
  };

  $scope.select = function(deck) {
    if ($scope.deleting) {
      //toggle
      var idx = selected.indexOf(deck);
      if (idx > -1) {
        selected.splice(idx, 1);
      }
      else {
        selected.push(deck);
      }
    } else if ($scope.changing) {
      //go to update

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
  }
  $scope.deleteDecks = function() {
    if(selected.length===0) {
      showToast(false, 'Please select deck to delete.');
    } else {
      deleteDecks(selected);
      selected = [];
      $scope.deleting = false;
    }
  };

  $scope.showUpdateOptions = function() {
    changing=true; 
    deleting=false;
    selected=[];
  }
});
