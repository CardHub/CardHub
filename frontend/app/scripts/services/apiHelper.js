'use strict';

angular.module('frontendApp')
  .factory('BearerAuthInterceptor', function($window, $q, $location, localStorageService, Config, UserAuth) {
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
          window.alert('Session expired, redirect to login page.');
          UserAuth.clearUserData();
          $location.url('/login');
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
      },
      update: function(id,data) {
        return $http.put(Config.apiUrl + '/tag/' + id,data);
      },
      delete: function(id) {
        return $http.delete(Config.apiUrl + '/tag/' + id);
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
      },
      delete: function(id) {
        return $http.delete(Config.apiUrl + '/deck/' + id);   
      },
      fork: function(deckId) {
        return $http.get(Config.apiUrl + '/forkDeck/' + deckId); 
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
      },
      delete: function(deckId, cardId) {
        return $http.delete(Config.apiUrl + '/deck/' + deckId + '/card/' + cardId);
      }
    };

    this.user = {
      show: function(userId) {
        return $http.get(Config.apiUrl + '/user/' + userId);
      }
    };

    this.userDeck = {
      show: function(userId) {
        return $http.get(Config.apiUrl + '/user/' + userId + "/deck");
      }
    };

    this.search = {
      show: function(searchString, page) {
        var currentPage = page || 1;
        return $http({
          url: Config.apiUrl + '/search',
          method: 'GET',
          params: {
            q: searchString,
            page: currentPage
          }
        });
      }
    };
  });
