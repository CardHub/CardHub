'use strict';

angular.module('frontendApp')
  .service('cardUtil',function($mdDialog, $q, apiHelper) {
     function CreateCardCtrl($scope, deckName) {
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
    function showAddCardDialog(deckId, deckName, event) {
      var deferred = $q.defer();
      $mdDialog.show({
        controller: CreateCardCtrl,
        templateUrl: 'views/createCard.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        fullscreen: true,
        locals: {
          deckName: deckName
        }
      })
      .then(function(newCard){
        console.log(newCard);
        apiHelper.card.create(deckId, newCard).then(function(res) {
          console.log(res.data);
          deferred.resolve({
            status: "success",
            cardId: res.data.id
          });
        })
        .catch(function(err) {
          console.log(err);
          deferred.reject({
            status: "fail",
            error: err
          });
        });
      }, function() {
      });
      return deferred.promise;
    }

    function EditCardCtrl($scope, card) {
      $scope.cardData = card;
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.update = function() {
        var newCard = {
          front: $scope.cardData.front,
          back: $scope.cardData.back
        };
        $mdDialog.hide(newCard);
      };
    }
    function showEditCardDialog(deckId, card, event) {
      var deferred = $q.defer();
      $mdDialog.show({
        controller: EditCardCtrl,
        templateUrl: 'views/editCard.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        fullscreen: true,
        locals: {
          card: card
        }
      })
      .then(function(newCard){
        apiHelper.card.update(deckId, card.id, newCard).then(function(res) {
          console.log(res.data);
          deferred.resolve({status: "success"});
        })
        .catch(function(err) {
          console.log(err);
          deferred.reject({
            status: "fail",
            error: err
          });
        });
      }, function() {
      });
      return deferred.promise;
    }

    return {
      showAddCardDialog: showAddCardDialog,
      showEditCardDialog: showEditCardDialog
    };
  });