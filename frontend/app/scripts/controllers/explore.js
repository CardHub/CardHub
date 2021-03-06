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
    $scope.showRecommendation = true;
    $scope.recommended = [];
    // variables for help display
    // $scope.showSearchbar = false;
    $scope.showSidebarButton = false;
    var recommendedId = [41,42,43];
    for (var i =0; i<recommendedId.length; i++) {
      apiHelper.deck.show(recommendedId[i]).then(function(res) {
        $scope.recommended.push(res.data);
      }).catch(function(err) {
        console.log(err);
      });
    }
    $scope.$on('showExplore', function(event, args) {
      $scope.showSidebarButton = true;
    });

    // retrieve previous search data if there are any
    if (($state.previous.name === 'main.home.explore.deck.card' ||
        $state.previous.name === 'main.home.explore.deck') &&
        localStorageService.get(KEY_SEARCH_HISTORY)) {
      $scope.searchResults = localStorageService.get(KEY_SEARCH_HISTORY);
      $scope.showRecommendation = false;
    }
    $scope.search = function(queryString) {
      if (!queryString) {
        $scope.noResult = true;
        $scope.showRecommendation = true;
        $scope.searchResults = [];
        localStorageService.remove(KEY_SEARCH_HISTORY);
        return;
      }
      apiHelper.search.show(queryString)
        .then(function(res) {
          if (res.data.length === 0) {
            $scope.noResult = true;
            $scope.showRecommendation = true;
            $scope.searchResults = [];
            localStorageService.remove(KEY_SEARCH_HISTORY);
          } else {
            $scope.noResult = false;
            $scope.showRecommendation = false;
            localStorageService.set(KEY_SEARCH_HISTORY, res.data);
            $scope.searchResults = res.data;
          }
        });
    };

    $scope.viewDeck = function(deckId) {
      $state.go('main.home.explore.deck', {filterTag: 'all', id: deckId});
    };
  });
