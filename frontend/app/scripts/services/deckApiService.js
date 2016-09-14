'use strict';

angular.module('frontendApp').factory('DeckApi' , function($http,$q,UserAuth, Util) {
	 var userDeckList = null;

	function getUserDeckList() {
		if(userDeckList) {
			return $q.resolve(userDeckList);
		} else {
			return $http({
				method: 'GET',
				url: '/api/deck',
				headers: {
					'Authorization': UserAuth.getToken()
				}
			}).then(function(response){
				userDeckList = response.data;
				return userDeckList;
			}, function(response) {
				userDeckList = Util.mockUserDeckList;
				return userDeckList;
	    });
		}
	}

 return {
    getUserDeckList: getUserDeckList
  };
});