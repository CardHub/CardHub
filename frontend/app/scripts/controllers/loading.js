'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:LoadingCtrl
 * @description
 * # LoadingCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('LoadingCtrl', function($mdDialog, $rootScope) {
    $rootScope.$on("Loading.Finished", function() {
      $mdDialog.cancel();
    });
  });
