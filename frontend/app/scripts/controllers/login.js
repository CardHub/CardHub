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
  .controller('LoginCtrl', function($scope, LoadingHelper, UserAuth, apiHelper, $state, jwtHelper) {
    $scope.login = function() {
      FB.login(function(response) {
        if (response.status === 'connected') {
          LoadingHelper.show();
          var token = response.authResponse.accessToken;
          apiHelper.login({
            token: token
          })
          .then(function(res) {
            var tokenPayload = jwtHelper.decodeToken(res.data);
            UserAuth.saveToken(res.data);
            UserAuth.saveCurrentUser(tokenPayload);
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
