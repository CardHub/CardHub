'use strict';

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
    'ngMaterial'
  ])
  .config(function($mdIconProvider) {
    $mdIconProvider.fontSet('md', 'material-icons');
  })
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
      name: 'main',
      abstract: true,
      url: '',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    }).state({
      name: 'main.home',
      url: '/home',
      parent: 'main',
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl',
      title: 'Home'
    }).state({
      name: 'main.deck',
      url: '/deck',
      parent: 'main',
      templateUrl: 'views/deck.html',
      controller: 'DeckCtrl',
      title: 'Deck'
    });

    $urlRouterProvider.when('', '/home');
    $urlRouterProvider.otherwise('/home');
  });
