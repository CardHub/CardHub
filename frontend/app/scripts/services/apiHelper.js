'use strict';

angular.module('frontendApp')
  .factory('BearerAuthInterceptor', function($window, $q, localStorageService, Config) {
    return {
      request: function(config) {
        if(config.url.indexOf(Config.apiUrl) == -1) {
          return config || $q.when(config);
        }
        config.headers = config.headers || {};
        if (localStorageService.get('USER_TOKEN')) {
          // may also use sessionStorage
          config.headers.Authorization = 'Bearer ' + localStorageService.get('USER_TOKEN');
        }
        return config || $q.when(config);
      },
      responseError: function(rejection) {
        if (rejection.status === 401) {
          console.log('ooooops');
        }
        return $q.reject(rejection);
      }
    };
  }).config(function($httpProvider) {
    $httpProvider.interceptors.push('BearerAuthInterceptor');
  })
  .service('apiHelper', function($rootScope, $http, Config) {
    this.login = function(data) {
      return $http.post(Config.apiUrl + '/authenticate', data);
    };

    this.me = function() {
      return $http.get(Config.apiUrl + '/me');
    }

    this.getUserDetails = function() {
      FB.api('/me', {fields: 'name,picture'}, function(response) {
        if (response && response.picture && response.picture.data && response.picture.data.url) {
          $rootScope.$apply(function() {
          $rootScope.userPhoto = response.picture.data.url;
        });
        } else {
          console.error("Can't get user profile photo");
        }
        if (response && response.name){
          $rootScope.$apply(function() {
            $rootScope.userName = response.name;
          });
        }else {
          console.error("Can't get user name");
        }
      });
    }
  });
