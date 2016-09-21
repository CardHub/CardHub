'use strict';
/* globals FB */

angular.module('frontendApp')
  .service('UserAuth', function($rootScope, $window, localStorageService, jwtHelper) {
    var KEY_USER = 'USER';
    var KEY_USER_TOKEN = 'USER_TOKEN';

    this.saveToken = function(token) {
      localStorageService.set(KEY_USER_TOKEN, token);
    };

    this.getToken = function() {
      return localStorageService.get(KEY_USER_TOKEN);
    };

    this.saveCurrentUser = function(user) {
      localStorageService.set(KEY_USER, user);
    };

    this.clearUserData = function() {
      localStorageService.remove(KEY_USER, KEY_USER_TOKEN);
    };

    this.getCurrentUser = function() {
      return localStorageService.get(KEY_USER);
    };

    this.isUserLogin = function() {
      var token = this.getToken();
      if (!token) {
        return false;
      }
      var user = this.getCurrentUser();
      if (!user) {
        return false;
      }
      return !jwtHelper.isTokenExpired(token);
    };
  });
