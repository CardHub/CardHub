'use strict';
/* globals FB */

/**
 * @ngdoc function
 * @name frontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('LoginCtrl', function($scope, LoadingHelper, UserAuth, apiHelper, $state, jwtHelper, $mdDialog) {

    $scope.login = function() {
      // Handle ios add to screen login.
      if (!("standalone" in navigator && navigator.standalone)) {
        FB.login(function(response) {
          if (response.status === 'connected') {
            LoadingHelper.show();
            var token = response.authResponse.accessToken;
            apiHelper.login({
              token: token
            })
            .then(function(res) {
              var tokenPayload = jwtHelper.decodeToken(res.data);
              UserAuth.saveToken(res.data);
              UserAuth.saveCurrentUser(tokenPayload);
              LoadingHelper.hide();
              $state.go('main.home',  {filterTag: 'all'});
            })
            .catch(function(err) {
              LoadingHelper.hide();
              console.log(err);
            });
          }
        }, {
          scope: 'public_profile,email',
          auth_type: 'rerequest' // check for updated permissions every time they login
        });
      } else {
          var permissionUrl = "https://m.facebook.com/dialog/oauth?client_id=346992402310773&response_type=code&redirect_uri=" + window.location + "&scope=public_profile,email";
          window.location = permissionUrl;
          return;
      }
    };

    $scope.showPrivacy = function() {
      $mdDialog.show({
        controller: PrivacyTermsCtrl,
        templateUrl: 'views/privacyAndTerms.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {
          selectedTab: 0
        } 
      })
      .then(function(){
      }, function() {
      });
    };

    $scope.showTerms = function() {
      $mdDialog.show({
        controller: PrivacyTermsCtrl,
        templateUrl: 'views/privacyAndTerms.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {
          selectedTab: 1
        } 
      })
      .then(function(){
      }, function() {
      });
    };

    function PrivacyTermsCtrl($scope,$mdDialog,selectedTab) {
      $scope.selectedTab = selectedTab;
      $scope.cancel = function () {
        $mdDialog.cancel();
      }
    }
  });
