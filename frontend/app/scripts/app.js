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
    'angular-jwt',
    'ngMessages'
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
      controller: 'LoginCtrl'
    }).state({
      name: 'main',
      abstract: true,
      url: '/main',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      auth: true
    }).state({
      name: 'main.home',
      url: '/home/:filterTag',
      parent: 'main',
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl',
      title: 'Home',
      resolve:{
        'userDeckListData':function(DeckApi){
          return DeckApi.getUserDeckList();
        }
      },
      auth: true
    }).state({
      name: 'main.deck',
      url: '/deck/:id',
      parent: 'main',
      templateUrl: 'views/deck.html',
      controller: 'DeckCtrl',
      title: 'Deck',
      auth: true
    }).state({
      name: 'main.createDeck',
      url: '/createDeck',
      parent: 'main',
      templateUrl: 'views/createDeck.html',
      controller: 'CreateDeckCtrl',
      title: 'CreateDeck',
      auth: true
    }).state({
      name: 'main.editDeck',
      url: '/edit/deck/:id',
      parent: 'main',
      templateUrl: 'views/editDeck.html',
      controller: 'EditDeckCtrl',
      title: 'EditDeck',
      auth: true
    }).state({
      name: 'main.card',
      url: '/card/:deckId/:cardId',
      parent: 'main',
      templateUrl: 'views/card.html',
      controller: 'CardCtrl',
      title: 'Card',
      auth: true
    }).state({
      name: 'main.createCard',
      url: '/deck/:deckId/createCard',
      parent: 'main',
      templateUrl: 'views/createCard.html',
      controller: 'CreateCardCtrl',
      title: 'CreateCard',
      auth: true
    }).state({
      name: 'main.editCard',
      url: '/edit/deck/:deckId/card/:cardId',
      parent: 'main',
      templateUrl: 'views/editCard.html',
      controller: 'EditCardCtrl',
      title: 'EditCard',
      auth: true
    }).state({
      name: 'main.user',
      url: '/user/:id',
      parent: 'main',
      templateUrl: 'views/user.html',
      controller: 'UserCtrl',
      title: 'User',
      auth: true
    });
    $urlRouterProvider.when('/main', '/main/home/');
    $urlRouterProvider.otherwise('/login');
  })
  .factory('Config', function() {
    return {
      apiUrl: 'https://cardhub.tk/api'
    };
  })
  .run(function($window, UserAuth, $location, $rootScope) {
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

    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams, options){
        if (toState.auth) {
          if (!UserAuth.isUserLogin()) {
            event.preventDefault();
            $location.url('/login');
          }
        }

        if (toState.name === 'login') {
          if (UserAuth.isUserLogin()) {
            event.preventDefault();
          }
        }
    });
  })
  .run(function($rootScope, $state) {
    $rootScope.$on( '$stateChangeSuccess', function(event, to, toParams, from, fromParams ){
      from.params = fromParams;
      $state.previous = from;
    });  
  });
