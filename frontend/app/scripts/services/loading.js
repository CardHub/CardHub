'use strict';

angular.module('frontendApp')
  .service('LoadingHelper', function($mdDialog, $rootScope) {
    function hideWait() {
      $rootScope.$emit('Loading.Finished');
    }

    function showWait() {
      $mdDialog.show({
        controller: 'LoadingCtrl',
        template: '<md-dialog class="loading-fullscreen" style="background-color:transparent;box-shadow:none">' +
          '<div layout="row" layout-sm="column" style="height: 400px;" layout-align="center center" aria-label="wait">' +
          '<md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
          '</div>' +
          '</md-dialog>',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        fullscreen: false
      });
    }

    return {
      hide: hideWait,
      show: showWait
    };
  });
