'use strict';

angular.module('frontendApp')
  .factory('BearerAuthInterceptor', function($window, $q, localStorageService, Config) {
    return {
      request: function(config) {
        if(config.url.indexOf(Config.apiUrl) === -1) {
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
          // TODO: Should redirect to login view.
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
    };

    this.tag = {
      get: function() {
        return $http.get(Config.apiUrl + '/tag');
      },
      create: function(data) {
        return $http.post(Config.apiUrl + '/tag', data);
      },
      show: function(id) {
        return $http.get(Config.apiUrl + '/tag/' + id);
      }
    };

    this.deck = {
      get: function() {
        return $http.get(Config.apiUrl + '/deck');
      },
      create: function(data) {
        return $http.post(Config.apiUrl + '/deck', data);
      },
      show: function(id) {
        return $http.get(Config.apiUrl + '/deck/' + id);
      },
      update: function(id,data) {
        return $http.put(Config.apiUrl + '/deck/' + id, data);
      }
    };

    this.card = {
      create: function(deckId, data) {
        return $http.post(Config.apiUrl + '/deck/' + deckId + '/card', data);
      },
      show: function(deckId, cardId) {
        return $http.get(Config.apiUrl + '/deck/' + deckId + '/card/' + cardId);
      },
      update: function(deckId, cardId, data) {
        return $http.put(Config.apiUrl + '/deck/' + deckId + '/card/' + cardId, data);
      }
    };
  });
