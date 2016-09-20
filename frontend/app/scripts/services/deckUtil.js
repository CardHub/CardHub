'use strict';

angular.module('frontendApp')
  .service('deckUtil',function($mdDialog, $q, apiHelper) {
     function CreateDeckCtrl($scope, tags, currentTag, colors) {
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
    function showAddDeckDialog(tagFilters, deckFilter, colors, event) {
      var deferred = $q.defer();
      $mdDialog.show({
        controller: CreateDeckCtrl,
        templateUrl: 'views/createDeck.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose:true,
        fullscreen: true ,
        locals: {
          tags: tagFilters,
          currentTag: deckFilter,
          colors: colors
        }
      })
      .then(function(newDeck){
        deferred.resolve({
          status: "success",
          newDeck: newDeck
        });
      }, function() {
      });
      return deferred.promise;
    }

    function ChangeDeckCtrl($scope, selectedDeck, tags, colors) {
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
    function showEditDeckDialog(deck, tagFilters, colors) {
      var deferred = $q.defer();
      $mdDialog.show({
        controller: ChangeDeckCtrl,
        templateUrl: 'views/createDeck.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {
          selectedDeck: deck,
          tags: tagFilters,
          colors: colors
        } 
      })
      .then(function(updatedDeck){
        // changeDeck(updatedDeck);
        deferred.resolve({
          status: "success",
          updatedDeck: updatedDeck
        });
      }, function() {
      });
      return deferred.promise;
    }

    return {
      showAddDeckDialog: showAddDeckDialog,
      showEditDeckDialog: showEditDeckDialog
    };
  });