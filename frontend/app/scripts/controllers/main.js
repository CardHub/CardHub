'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MainCtrl', function ($rootScope,$scope, $timeout, $mdSidenav, $mdDialog,$state, UserAuth, apiHelper) {

    $scope.tagFilters = {};

    //get user tags
    function getTags() {
        apiHelper.tag.get().then(function(res) {
        $scope.tagFilters = res.data;
      }).catch(function(err) {
        console.log(err);
      });
    }

    getTags();

    $scope.publicStates = [
      {
        'name': 'Explore',
        'icon': 'explore',
        'state': 'main.deck'
      }
    ];

    // Default state
    $scope.currentState = function() {
      return $state.current;
    };

    $scope.goTo = function(stateUrl, stateId) {
      $scope.toggleLeft();
      $state.go(stateUrl, {id: stateId});
    };

    // initialize filter variables
    $scope.deckDeleted = false;
    $scope.deckFilter = '';
    $scope.changeFilter = function(filter) {
      $scope.deckFilter = filter;
      if (filter==='deleted') {
        $scope.deckDeleted = true;
      } else {
        $scope.deckDeleted = false;
      }
      $scope.toggleLeft();
      $state.go('main.home', {filterTag: $scope.deckFilter});
    };

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    $scope.logOut = function() {
      $scope.toggleLeft();
      UserAuth.clearUserData();
      $state.go('login');
    };

    $scope.currentUser = UserAuth.getCurrentUser();

    $scope.viewUserProfile = function(userId) {
      $scope.toggleLeft();
      $state.go('main.user', {id: userId});
    };

    $scope.showEditTagsDialog = function() {
      $mdDialog.show({
        controller: EditTagsCtrl,
        templateUrl: 'views/editTags.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose:true,
        fullscreen: true ,
        locals: {
          originalTags: $scope.tagFilters
        }
      })
      .then(function(){
        getTags();
      }, function() {
        getTags();
      });
    };

    function EditTagsCtrl($scope,$mdDialog,originalTags,apiHelper,$timeout) {
      $scope.tags = angular.copy(originalTags);
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.addTag = function() {
        if(!$scope.newTag || $scope.newTag.trim()==='' || $scope.newTag.length>20){
          $scope.newTag=null;
          $scope.errorMsgNewTag='Invalid tag length!';
          $timeout(
            function (){
              $scope.errorMsgNewTag=null;
            }, 3000
          );
          return;
        }
        for(var i=0; i<$scope.tags.length; i++) {
          if($scope.tags[i].name===$scope.newTag) {
            $scope.newTag=null;
            $scope.errorMsgNewTag='Tag exists!';
            $timeout(
              function (){
                $scope.errorMsgNewTag=null;
              }, 3000
            );
            return;
          }
        }
        var data = {};
        data['name'] = $scope.newTag;
        apiHelper.tag.create(data).then(function(res) {
          $scope.tags.unshift(res.data);
          $scope.newTag = null;
          $scope.successMsgNewTag='Success creating tag!';
          $timeout(
            function (){
              $scope.successMsgNewTag=null;
            }, 3000
          );
        }).catch(function(err) {
          console.log(err);
          $scope.errorMsgNewTag='Error creating tag. Please try again';
          $timeout(
            function (){
              $scope.errorMsgNewTag=null;
            }, 3000
          );
        });
      };
      $scope.updateTag = function(tag) {
         if(!tag.name || tag.name.trim()==='' || tag.name.length>20){
          tag.errorMsg='Invalid tag length!';
          $timeout(
            function (){
              tag.errorMsg=null;
            }, 3000
          );
          return;
        }
        for(var i=0; i<$scope.tags.length; i++) {
          if($scope.tags[i].name===tag.name && $scope.tags[i].id!==tag.id) {
            tag.errorMsg='Tag exists!';
            $timeout(
              function (){
                tag.errorMsg=null;
              }, 3000
            );
            return;
          }
        }
        apiHelper.tag.update(tag.id,tag).then(function(res) {
          tag.successMsg='Success updating tag!';
          $timeout(
            function (){
              tag.successMsg=null;
            }, 3000
          );
          $scope.activeTag = null;
        }).catch(function(err) {
          console.log(err);
          tag.errorMsg='Error updating tag. Please try again';
          $timeout(
            function (){
              tag.errorMsg=null;
            }, 3000
          );
        });
      };
      $scope.selectTag = function (tag) {
        $scope.activeTag = tag;
      };
      $scope.deleteTag = function(tag,index) {
        apiHelper.tag.delete(tag.id).then(function(res) {
          if (res.data == 1){
            $scope.tags.splice(index,1);
          } else {
            tag.errorMsg='Error deleting tag. Please try again';
            $timeout(
              function (){
                tag.errorMsg=null;
              }, 3000
            );
          }
          $scope.activeTag = null;
        }).catch(function(err) {
          console.log(err);
          tag.errorMsg='Error deleting tag. Please try again';
          $timeout(
            function (){
              tag.errorMsg=null;
            }, 3000
          );
        });
      };
    }
  });
