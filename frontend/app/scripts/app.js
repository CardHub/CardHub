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
    'ngMessages',
    'ncy-angular-breadcrumb'
  ])
  .config(function($mdIconProvider) {
    $mdIconProvider.fontSet('md', 'material-icons');
  })
  .config(function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('CARDHUB_');
  })
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('failure-toast');
    $mdThemingProvider.theme('success-toast');
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
      //parent: 'main',
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl',
      title: 'Home',
      auth: true,
      ncyBreadcrumb: {
        label: 'Home'
      }
    }).state({
      name: 'main.home.deck',
      url: '/deck/:id',
      views:{
        "@main":{
        templateUrl: 'views/deck.html',
        controller: 'DeckCtrl'
      }
    },
      title: 'Deck',
      auth: true,
      ncyBreadcrumb: {
        label: '> Deck'
      }
    }).state({
      name: 'main.home.deck.card',
      url: '/card/:cardId',
      views:{
        "@main":{
        templateUrl: 'views/card.html',
        controller: 'CardCtrl'
      }
    },
      title: 'Card',
      auth: true,
      ncyBreadcrumb: {
        label: '> Card'
      }
    }).state({
      name: 'main.user',
      url: '/user/:id',
      parent: 'main',
      templateUrl: 'views/user.html',
      controller: 'UserCtrl',
      title: 'User',
      auth: true
    });
    $urlRouterProvider.when('/main', '/main/home/all');
    $urlRouterProvider.when('/main/home', '/main/home/all');
    $urlRouterProvider.otherwise('/login');
  })
  .factory('Config', function() {
    return {
      apiUrl: 'https://cardhub.tk/api'
    };
  })
  .run(function($window, UserAuth, $location, $rootScope, FBLoginHelper) {
    $window.ga('create', 'UA-83446936-2', 'auto');
    $rootScope.$on('$stateChangeSuccess', function (event) {
      $window.ga('send', 'pageview', $location.path());
    });
    
    $window.fbAsyncInit = function() {
      FB.init({
        appId: '346992402310773',
        xfbml: true,
        version: 'v2.7'
      });
      FBLoginHelper.watchFacebookAuthenticationStatus();
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
            if (fromState.name) {
              // not inital visit to this view
              event.preventDefault();
            } else {
              // Initial visit, has logined, and come to login page.
              // redirect to main.
              $location.url('/main/home/all');
            }
          }
        }
    });
  })
  .run(function($rootScope, $state) {
    $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams ){
      if (from.name) {
        from.params = fromParams;
        $state.previous = from;
      } else {
        // direct visit
        // go back to home
        $state.previous = $state.get('main.home');
      }
    });
  });
