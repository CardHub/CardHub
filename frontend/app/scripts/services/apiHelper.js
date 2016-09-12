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
  .service('apiHelper', function($http, Config) {
    this.login = function(data) {
      return $http.post(Config.apiUrl + '/authenticate', data);
    };

    this.me = function() {
      return $http.get(Config.apiUrl + '/me');
    }
  });
