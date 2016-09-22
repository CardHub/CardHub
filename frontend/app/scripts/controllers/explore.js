'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ExploreCtrl
 * @description
 * # ExploreCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('ExploreCtrl', function ($scope, $state, apiHelper) {
    $scope.defaultDecks = [];
    $scope.searchResults = [];
    $scope.noResult = false;
    // variables for help display
    // $scope.showSearchbar = false;
    $scope.showSidebarButton = false;

    $scope.$on('showExplore', function(event, args) {
      $scope.showSidebarButton = true;
    });

    $scope.search = function(queryString) {
      apiHelper.search.show(queryString)
        .then(function(res) {
          console.log(res.data);
          if (res.data === []) {
            $scope.noResult = true;
          } else {
            $scope.noResult = false;
            $scope.searchResults = res.data;
          }
        });
    };

    $scope.viewDeck = function(deckId) {
      $state.go('main.home.deck', {filterTag: 'all', id: deckId});
    };
  });
