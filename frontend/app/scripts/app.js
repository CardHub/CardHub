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
      name: 'login',
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    }).state({
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
      url: '/deck/:id',
      parent: 'main',
      templateUrl: 'views/deck.html',
      controller: 'DeckCtrl',
      title: 'Deck'
    }).state({
      name: 'main.card',
      url: '/deck/:id/:cardId',
      parent: 'main',
      templateUrl: 'views/card.html',
      controller: 'CardCtrl',
      title: 'Card'
    });

    $urlRouterProvider.when('', '/home');
    $urlRouterProvider.otherwise('/home');
  });
