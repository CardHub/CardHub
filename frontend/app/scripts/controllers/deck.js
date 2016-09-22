'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:DeckCtrl
 * @description
 * # DeckCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('DeckCtrl', function ($scope, $rootScope,$state, $stateParams, $mdDialog, UserAuth, apiHelper, cardUtil) {
    /*console.log($state.previous.name);
    if($state.previous.name==='main.home.explore'){
      $scope.fromState = 'main.home.explore';
    }*/
    $scope.deckId = $stateParams.id;
    $scope.deck = {};
    $scope.isOwner = false;
    $scope.deleting = false;
    $scope.changing = false;
    $scope.selectedArray = [];
    $scope.noCard = false;
    $scope.originalUser = {name:''};
    // variables for help display
    $scope.showDeckInfo = false;
    $scope.showAllCards = false;
    $scope.showSidebarButton = false;
    $scope.showUtilButton = false;

    $scope.$on('showAllCards', function(event, args) {
      $scope.showDeckInfo = true;
    });

    // initialize to prevent directive error before async promise is returned
    $scope.deck = {Cards:[]};
    function getCards() {
      apiHelper.deck.show($scope.deckId).then(function(res) {
        console.log(res.data);
        $scope.deck = res.data;
        if ($scope.deck.Cards.length===0) {
          $scope.noCard = true; 
        } else {
          $scope.noCard = false; 
        }
        // check if current user is the owner
        $scope.isOwner = (UserAuth.getCurrentUser().id === $scope.deck.UserId);
        // get original user info
        if ($scope.deck.isForked) {
          apiHelper.userDeck.show($scope.deck.forkedFrom)
            .then(function(res) {
              console.log(res.data);
              $scope.originalUser = res.data;
            });
        }
      }).catch(function(err) {
        console.log(err);
      });
    }
    getCards();

    $scope.viewCard = function(deckId, cardId) {
      console.log($state.previous.name);
      if($state.previous.name==='main.home.explore'){
        $state.go('main.home.explore.deck.card', {filterTag: 'all',cardId: cardId});
      }else{
        $state.go('main.home.deck.card', {cardId: cardId});
      }
    };

    $scope.createCard = function() {
      cardUtil.showAddCardDialog($scope.deckId, $scope.deck.name).then(function(res) {
        if (res.status === "success") {
          getCards();
        } else {
          console.log(res.error);
        }
      });
    };

    // functions for change and delete
    $scope.isSelected = function(card) {
      return $scope.selectedArray.indexOf(card) > -1;
    };

    $scope.select = function(card, event) {
      if ($scope.deleting) {
        // toggle selected/not selected
        var idx = $scope.selectedArray.indexOf(card);
        if (idx > -1) {
          $scope.selectedArray.splice(idx, 1);
        } else {
          $scope.selectedArray.push(card);
        }
      } else if ($scope.changing) {
        cardUtil.showEditCardDialog($scope.deckId, card, event).then(function(res) {
          if (res.status === "success") {
            getCards();
          } else {
            console.log(res.error);
          }
        });
      }
    };

    function permDeleteCard(deckId,cardId) {
      apiHelper.card.delete(deckId,cardId).then(function(res) {
        getCards();
      })
      .catch(function(err) {
        console.log(err);
      });
    }

    $scope.deleteCards = function() {
      for (var i=0; i<$scope.selectedArray.length; i++) {
        console.log("delete " + $scope.selectedArray[i].id + " from deck " + $scope.deckId);
        permDeleteCard($scope.deckId, $scope.selectedArray[i].id);
      }
    };

    $scope.forkDeck = function(deckId) {
      console.log(deckId);
      apiHelper.deck.fork(deckId).then(function(res) {
        console.log(res.data);

      }).catch(function(err) {
        console.log(err);
      });
    }

    $scope.viewUserProfile = function(userId) {
      $state.go('main.home.user', {id: userId});
    };
  });
