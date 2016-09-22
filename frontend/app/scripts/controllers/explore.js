'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ExploreCtrl
 * @description
 * # ExploreCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('ExploreCtrl', function ($scope, $state, apiHelper, localStorageService) {
    var KEY_SEARCH_HISTORY = 'SEARCH_HISTORY';

    $scope.defaultDecks = [];
    $scope.searchResults = [];
    $scope.noResult = false;
    // variables for help display
    // $scope.showSearchbar = false;
    $scope.showSidebarButton = false;

    $scope.$on('showExplore', function(event, args) {
      $scope.showSidebarButton = true;
    });

    // retrieve previous search data if there are any
    if (localStorageService.get(KEY_SEARCH_HISTORY)) {
      $scope.searchResults = localStorageService.get(KEY_SEARCH_HISTORY);
    }
    $scope.search = function(queryString) {
      apiHelper.search.show(queryString)
        .then(function(res) {
          console.log(res.data);
          if (res.data === []) {
            $scope.noResult = true;
            localStorageService.remove(KEY_SEARCH_HISTORY);
          } else {
            $scope.noResult = false;
            localStorageService.set(KEY_SEARCH_HISTORY, res.data);
            $scope.searchResults = res.data;
          }
        });
    };

    $scope.viewDeck = function(deckId) {
      $state.go('main.home.explore.deck', {filterTag: 'all', id: deckId});
    };
  });
