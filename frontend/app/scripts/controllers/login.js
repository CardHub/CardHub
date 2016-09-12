'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('LoginCtrl', function ($scope, LoadingHelper) {
    $scope.login = function() {
      LoadingHelper.show();

      setTimeout(function() {
        LoadingHelper.hide();
      }, 4000);
    };
  });
