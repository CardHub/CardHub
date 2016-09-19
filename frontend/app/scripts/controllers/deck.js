'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:DeckCtrl
 * @description
 * # DeckCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('DeckCtrl', function ($scope, $state, $stateParams, $mdDialog, UserAuth, apiHelper) {
    $scope.deckId = $stateParams.id;
    $scope.deck = {};
    $scope.isOwner = false;
    $scope.deleting = false;
    $scope.changing = false;
    $scope.selected = [];

    // initialize to prevent directive error before async promise is returned
    $scope.deck = {Cards:[]};
    function getCards() {
      apiHelper.deck.show($scope.deckId).then(function(res) {
        console.log(res.data);
        $scope.deck = res.data;
        // check if current user is the owner
        $scope.isOwner = (UserAuth.getCurrentUser().id === $scope.deck.UserId);
      }).catch(function(err) {
        console.log(err);
      });
    }
    getCards();

    $scope.viewCard = function(deckId, cardId) {
      $state.go('main.card', {deckId: deckId, cardId: cardId});
    };

    $scope.showAddCardDialog = function(event) {
      $mdDialog.show({
        controller: CreateCardCtrl,
        templateUrl: 'views/createCard.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        fullscreen: true,
        locals: {
          deckName: $scope.deck.name
        }
      })
      .then(function(newCard){
        console.log(newCard);
        apiHelper.card.create($scope.deckId, newCard).then(function(res) {
          console.log(res.data);
          // $scope.deck.Cards.push(res.data);
          getCards();
        })
        .catch(function(err) {
          console.log(err);
        });
      }, function() {
      });
    };

    function CreateCardCtrl($scope, $mdDialog, deckName) {
      $scope.deckName = deckName;
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.create = function(card) {
        var newCard = {
          front: card.front,
          back: card.back
        };
        $mdDialog.hide(newCard);
      };
    }

    // functions for 
    $scope.isSelected = function(card) {
      return $scope.selected.indexOf(card) > -1;
    };
    $scope.select = function(card) {
      if ($scope.deleting) {
        // toggle selected/not selected
        var idx = $scope.selected.indexOf(card);
        if (idx > -1) {
          $scope.selected.splice(idx, 1);
        } else {
          $scope.selected.push(card);
        }
      } else if ($scope.changing) {
        // go to update
        console.log("open changeDialog");
        // showChangeCardDialog(card);
      }
    };

    $scope.deleteCards = function() {
      for (var i=0; i<$scope.selected.length; i++) {
        console.log("delete " + $scope.selected[i].id);
      }
    };
  });
