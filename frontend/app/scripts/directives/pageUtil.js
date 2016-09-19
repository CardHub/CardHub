'use strict';

angular.module('frontendApp')
  .directive('pageUtil', function() {
    return {
      restrict: 'E',
      scope: {
        isOwner: '@',
        isSingleItem: '@',
        deleting: '=',
        changing: '=',
        selected: '=',
        displayed: '=',
        addFn: '&',
        changeFn: '&',
        delFn: '&'
      },
      // bindToController: ,
      link: function(scope) {
        scope.deleting = false;
        scope.changing = false;
        scope.selected = [];

        scope.showDeleteOptions = function() {
          if (scope.isSingleItem === "true") {
            console.log("delete single item");
            scope.delFn();
          } else {
            scope.deleting = true; 
            scope.changing = false; 
          }
        };

        scope.showUpdateOptions = function(event) {
          if (scope.isSingleItem === "true") {
            console.log("update single item");
            scope.changeFn({event: event});
          } else {
            scope.changing = true; 
            scope.deleting = false;
            scope.selected = [];
          }
        };

        scope.showAddDialog = function(event) {
          scope.addFn({event: event});
        };

        scope.cancelChange = function() {
          scope.changing = false;
          scope.selected = [];
        };

        scope.toggleAll = function() {
          if (scope.selected.length === scope.displayed.length) {
            scope.selected = [];
          } else if (scope.selected.length >= 0) {
            scope.selected = scope.displayed.slice();
          }
        };

        scope.isAllSelected = function() {
          return scope.selected.length === scope.displayed.length;
        };

        scope.cancelDelete = function() {
          scope.deleting = false;
          scope.selected = [];
        };

        scope.deleteSelected = function() {
          if(scope.selected.length === 0) {
            console.log("Alert for selection of at least one");
            // showToast(false, 'Please select deck to delete.');
          } else {
            scope.delFn();
            scope.selected = [];
            scope.deleting = false;
          }
        }
      },
      templateUrl: 'views/pageUtil.html'
    };
  });