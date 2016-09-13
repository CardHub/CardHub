'use strict';
/* globals FB */

angular.module('frontendApp')
  .service('UserAuth', function($rootScope, $window, localStorageService) {
    var KEY_USER = 'USER';
    var KEY_USER_TOKEN = 'USER_TOKEN';

    function facebookStatusChangeCallback(response) {
      if (response.status === 'connected') {
      } else {
      }
    }
    // 1. If no localStorage token, confirm not logged in; redirect to login page.
    // 2. If have localStorage token but not facebook token, treat it as login and leave the work to token.
    // 3. If have both token, confirmed logged in.
    this.watchFacebookAuthenticationStatus = function() {
      FB.getLoginStatus(facebookStatusChangeCallback);
    };

    this.saveToken = function(token) {
      localStorageService.set(KEY_USER_TOKEN, token);
    };

    this.saveCurrentUser = function(user) {
      user.userPhoto = 'https://graph.facebook.com/' + user.fbId +'/picture?type=large';
      localStorageService.set(KEY_USER, user);
    };

    this.clearUserData = function() {
      localStorageService.remove(KEY_USER, KEY_USER_TOKEN);
    };

    this.getCurrentUser = function() {
      return localStorageService.get(KEY_USER);
    };
  });
