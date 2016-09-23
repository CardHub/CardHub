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
    'ncy-angular-breadcrumb',
    'ng-walkthrough',
    'ngTouch'
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
       /* ,
        parent: function ($scope) {
          return $scope.fromState || 'main.home';
        }*/
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
      name: 'main.home.user',
      url: '/user/:id',
      views:{
        "@main":{
          templateUrl: 'views/user.html',
          controller: 'UserCtrl'
        }
      },
      title: 'User',
      auth: true,
      ncyBreadcrumb: {
        label: '> User'
      }
    }).state({
      name: 'main.home.explore',
      url: '/explore',
      views:{
        "@main":{
          templateUrl: 'views/explore.html',
          controller: 'ExploreCtrl'
        }
      },
      title: 'Explore',
      auth: true,
      ncyBreadcrumb: {
        label: '> Explore'
      }
    }).state({
      name: 'main.home.explore.deck',
      url: '/deck/:id',
      views:{
        "@main":{
          templateUrl: 'views/deck.html',
          controller: 'DeckCtrl'
        }
      },
      auth: true,
      ncyBreadcrumb: {
        label: '> Deck'
      }
    }).state({
      name: 'main.home.explore.deck.card',
      url: '/card/:cardId',
      views:{
        "@main":{
          templateUrl: 'views/card.html',
          controller: 'CardCtrl'
        }
      },
      auth: true,
      ncyBreadcrumb: {
        label: '> Card'
      }
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
    $rootScope.$on('$stateChangeSuccess', function (event) {
      ga('set', 'page', $location.path());
      ga('send', 'pageview');
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

    // Check if browser supports service workers
    if ('serviceWorker' in navigator) {
      // Your service-worker.js *must* be located at the top-level directory relative to your site.
      // It won't be able to control pages unless it's located at the same level or higher than them.
      // *Don't* register service worker file in, e.g., a scripts/ sub-directory!
      // See https://github.com/slightlyoff/ServiceWorker/issues/468
      navigator.serviceWorker.register('sw.js').then(function(reg) {
        // updatefound is fired if service-worker.js changes.
        reg.onupdatefound = function() {
          // The updatefound event implies that reg.installing is set; see
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = reg.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  // At this point, the old content will have been purged and the fresh content will
                  // have been added to the cache.
                  // It's the perfect time to display a "New content is available; please refresh."
                  // message in the page's interface.
                  console.log('New or updated content is available.');
                } else {
                  // At this point, everything has been precached.
                  // It's the perfect time to display a "Content is cached for offline use." message.
                  console.log('Content is now available offline!');
                }
                break;

              case 'redundant':
                console.error('The installing service worker became redundant.');
                break;
            }
          };
        };
      }).catch(function(e) {
        console.error('Error during service worker registration:', e);
      });
    }
  });
