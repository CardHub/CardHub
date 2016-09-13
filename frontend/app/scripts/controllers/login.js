'use strict';
/* globals FB */

/**
 * @ngdoc function
 * @name frontendApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('LoginCtrl', function($scope, LoadingHelper, UserAuth, apiHelper, $state) {
    $scope.login = function() {
      FB.login(function(response) {
        if (response.status === 'connected') {
          LoadingHelper.show();
          var token = response.authResponse.accessToken;
          apiHelper.login({
            token: token
          })
          .then(function(res) {
            var token = res.data;
            UserAuth.saveToken(token);
            return apiHelper.me();
          })
          .then(function(res) {
            UserAuth.saveCurrentUser(res.data);
            LoadingHelper.hide();
            $state.go('main.home');
          })
          .catch(function(err) {
            LoadingHelper.hide();
            console.log(err);
          });
        }
      }, {
        scope: 'public_profile,email',
        auth_type: 'rerequest' // check for updated permissions every time they login
      });
    };
  });
