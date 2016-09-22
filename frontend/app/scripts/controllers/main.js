'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MainCtrl', function ($rootScope,$scope, $timeout, $mdSidenav, $mdDialog,$state, UserAuth, apiHelper, $mdToast) {

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
        'state': 'main.home.explore'
      }
    ];

    // Default state
    $scope.currentState = function() {
      return $state.current;
    };

    $scope.showHelp = function() {
      switch ($state.current.name) {
        case 'main.home': 
          $rootScope.$broadcast('showWholeDeck');
          break;
        case 'main.home.deck':
          $rootScope.$broadcast('showAllCards');
          break;
        case 'main.home.deck.card':
          $rootScope.$broadcast('showCard');
          break;
        case 'main.home.user':
          $rootScope.$broadcast('showUser');
          break;
        case 'main.home.explore':
          $rootScope.$broadcast('showExplore');
          break;
      }
    };

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

    $scope.showShareDialog = function() {
      $mdDialog.show({
        controller: shareCtrl,
        templateUrl: 'views/share.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose:true
      })
      .then(function(){
        shareOnFb();
      }, function() {
      });
    };

    function shareCtrl($scope,$mdDialog) {
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.share = function() {
        $mdDialog.hide();
      };
    }

    function shareOnFb() {
      $scope.toggleLeft();
      FB.api(
        "/me/feed",
        "POST",
        {
            "message": "Check out my cards on Cardhub!",
            "link": "https://cardhub.tk/#/main/home/all/user/"+UserAuth.getCurrentUser().id
        },
        function (response) {
          if (response && !response.error) {
            showToast(true,'Success sharing on Facebook!');
          }else {
            showToast(false,'Failed to share on Facebook. Please try again');
          }
        }
      );
    }

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
      $state.go('main.home.user', {id: userId});
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
        var clearErrorMsg = function () {
          $timeout(
              function (){
                $scope.errorMsgNewTag=null;
              }, 3000
            );
        };
        if(!$scope.newTag || $scope.newTag.trim()==='' || $scope.newTag.length>20){
          $scope.newTag=null;
          $scope.errorMsgNewTag='Invalid tag length!';
          clearErrorMsg();
          return;
        }
        if($scope.newTag.trim()==='all') {
          $scope.newTag=null;
          $scope.errorMsgNewTag='Tag exists!';
          clearErrorMsg();
          return;
        }
        for(var i=0; i<$scope.tags.length; i++) {
          if($scope.tags[i].name===$scope.newTag) {
            $scope.newTag=null;
            $scope.errorMsgNewTag='Tag exists!';
            clearErrorMsg();
            return;
          }
        }
        var data = {};
        data.name = $scope.newTag;
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
        var clearErrorMsg = function () {
          $timeout(
            function (){
              tag.errorMsg=null;
            }, 3000
          );
        };
        for(var i=0; i<$scope.tags.length; i++) {
          if($scope.tags[i].name===tag.name && $scope.tags[i].id!==tag.id) {
            tag.errorMsg='Tag exists!';
            clearErrorMsg();
            return;
          }
        }
        apiHelper.tag.update(tag.id,tag).then(function() {
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
          if (res.data === 1){
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
