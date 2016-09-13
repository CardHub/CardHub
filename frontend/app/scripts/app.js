'use strict';
/* globals FB */

/**
 * @ngdoc overview
 * @name frontendApp
 * @description
 * # frontendApp
 *
 * Main module of the application.
 */
angular
  .module('frontendApp', [
    'ngAnimate',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngMaterial',
    'LocalStorageModule',
    'angular-jwt'
  ])
  .config(function($mdIconProvider) {
    $mdIconProvider.fontSet('md', 'material-icons');
  })
  .config(function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('CARDHUB_');
  })
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
      name: 'login',
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl',
      resolve: { authenticate: notAuthenticate }
    }).state({
      name: 'main',
      abstract: true,
      url: '',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      resolve: { authenticate: authenticate }
    }).state({
      name: 'main.home',
      url: '/home/:filterTag',
      parent: 'main',
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl',
      title: 'Home'
    }).state({
      name: 'main.deck',
      url: '/deck/:id',
      parent: 'main',
      templateUrl: 'views/deck.html',
      controller: 'DeckCtrl',
      title: 'Deck'
    }).state({
      name: 'main.card',
      url: '/card/:deckId/:cardId',
      parent: 'main',
      templateUrl: 'views/card.html',
      controller: 'CardCtrl',
      title: 'Card'
    });

    $urlRouterProvider.when('', '/home');
    $urlRouterProvider.otherwise('/login');

    function authenticate($q, UserAuth, $state, $timeout) {
      if (UserAuth.isUserLogin()) {
        // Resolve the promise successfully
        return $q.when();
      } else {
        $timeout(function() {
          $state.go('login');
        });
        return $q.reject();
      }
    }

    function notAuthenticate($q, UserAuth, $state, $timeout) {
      if (!UserAuth.isUserLogin()) {
        return $q.when();
      } else {
        $timeout(function() {
          $state.go('main.home');
        });
        return $q.reject();
      }
    }
  })
  .factory('Config', function() {
    return {
      apiUrl: 'https://cardhub.tk/api'
    };
  })
  .run(function($window, UserAuth) {
    $window.fbAsyncInit = function() {
      FB.init({
        appId: '346992402310773',
        xfbml: true,
        version: 'v2.7'
      });
      UserAuth.watchFacebookAuthenticationStatus();
    };

    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  });
