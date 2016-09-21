angular.module('frontendApp')
  .service('FBLoginHelper', function($rootScope, $window, LoadingHelper, apiHelper, jwtHelper, UserAuth, $state) {
    function facebookStatusChangeCallback(response) {
      if (response.status === 'connected') {
        if ("standalone" in navigator && navigator.standalone) {
          var token = response.authResponse.accessToken;
          LoadingHelper.show();
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
            alert(err);
            LoadingHelper.hide();
          });
        }
      }
    }
    // 1. If no localStorage token, confirm not logged in; redirect to login page.
    // 2. If have localStorage token but not facebook token, treat it as login and leave the work to token.
    // 3. If have both token, confirmed logged in.
    this.watchFacebookAuthenticationStatus = function() {
      FB.getLoginStatus(facebookStatusChangeCallback);
    };
  });
