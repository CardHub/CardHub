'use strict';

angular.module('frontendApp').factory('DeckApi' , function($http,UserAuth, Util) {
	 var userDeckList = null;

	function getUserDeckList() {
		postNewTag();
		postNewDeck();
		if(userDeckList) {
			return userDeckList;
		} else {
			return $http({
				method: 'GET',
				url: 'https://cardhub.tk/api/deck',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0a2dzLnNpLmp1bmtlQGdtYWlsLmNvbSIsIm5hbWUiOiJTaSBKdW4gS2UiLCJmYklkIjoiMTEwNTk3NTkyNjE0NzQzNCIsImF2YXRhciI6Imh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLzExMDU5NzU5MjYxNDc0MzQvcGljdHVyZT90eXBlPWxhcmdlIiwiZXhwIjoxNDc0NDY5MzU3LCJpYXQiOjE0NzM4NjQ1NTd9.I-CbU_OX6dB7v7J0qkVmtfkEyIH--qgLToGaDO1sRCg'
				}
			}).then(function(response){
				console.log(response);
				userDeckList = response.data;
				console.log(userDeckList);
				return userDeckList;
			}, function(response) {
				console.log('failure');
				userDeckList = Util.mockUserDeckList;
				return userDeckList;
	    });
		}
	}

	function postNewDeck() {
		console.log('new deck');
		return $http({
      method: 'POST',
      url: 'https://cardhub.tk/api/deck',
      data: '{name: "test",tags: ["work"],isPublic: "true",isDeleted: "false"}',
      headers: {
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0a2dzLnNpLmp1bmtlQGdtYWlsLmNvbSIsIm5hbWUiOiJTaSBKdW4gS2UiLCJmYklkIjoiMTEwNTk3NTkyNjE0NzQzNCIsImF2YXRhciI6Imh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLzExMDU5NzU5MjYxNDc0MzQvcGljdHVyZT90eXBlPWxhcmdlIiwiZXhwIjoxNDc0NDY5MzU3LCJpYXQiOjE0NzM4NjQ1NTd9.I-CbU_OX6dB7v7J0qkVmtfkEyIH--qgLToGaDO1sRCg'
      }
    }).then(function(response) {
    	console.log(response);
      return response.data;
    }, function(response) {
				console.log('response');
	    });
	}

	function postNewTag() {
		console.log('new tag');
		return $http({
      method: 'POST',
      url: 'https://cardhub.tk/api/tag',
      data: '{name: "work"}',
      headers: {
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0a2dzLnNpLmp1bmtlQGdtYWlsLmNvbSIsIm5hbWUiOiJTaSBKdW4gS2UiLCJmYklkIjoiMTEwNTk3NTkyNjE0NzQzNCIsImF2YXRhciI6Imh0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLzExMDU5NzU5MjYxNDc0MzQvcGljdHVyZT90eXBlPWxhcmdlIiwiZXhwIjoxNDc0NDY5MzU3LCJpYXQiOjE0NzM4NjQ1NTd9.I-CbU_OX6dB7v7J0qkVmtfkEyIH--qgLToGaDO1sRCg'
      }
    }).then(function(response) {
    	console.log(response);
      return response.data;
    }, function(response) {
				console.log('response');
	    });
	}
 return {
    getUserDeckList: getUserDeckList
  };
});