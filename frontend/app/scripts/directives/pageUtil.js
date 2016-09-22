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
        selectedArray: '=',
        displayedArray: '=',
        addFn: '&',
        changeFn: '&',
        delFn: '&'
      },
      // bindToController: ,
      link: function(scope) {
        scope.deleting = false;
        scope.changing = false;
        scope.selectedArray = [];
        scope.displayedArray = [];

        scope.showDeleteOptions = function() {
          if (scope.isSingleItem === 'true') {
            scope.delFn();
          } else {
            scope.deleting = true; 
            scope.changing = false; 
          }
        };

        scope.showUpdateOptions = function(event) {
          if (scope.isSingleItem === 'true') {
            scope.changeFn({event: event});
          } else {
            scope.changing = true; 
            scope.deleting = false;
            scope.selectedArray = [];
          }
        };

        scope.showAddDialog = function(event) {
          //hide checkboxes
          scope.deleting = false;
          scope.changing = false;
          scope.selectedArray = [];
          scope.addFn({event: event});
        };

        scope.cancelChange = function() {
          scope.changing = false;
          scope.selectedArray = [];
        };

        scope.toggleAll = function() {
          // check existance of array of items to be displayed
          if (!!scope.displayedArray) {
            if (scope.selectedArray.length === scope.displayedArray.length) {
              scope.selectedArray = [];
            } else if (scope.selectedArray.length >= 0) {
              scope.selectedArray = scope.displayedArray.slice();
            }
          }
        };

        scope.isAllSelected = function() {
          if (!scope.displayedArray) {
            return false;
          }
          return scope.selectedArray.length === scope.displayedArray.length;
        };

        scope.cancelDelete = function() {
          scope.deleting = false;
          scope.selectedArray = [];
        };

        scope.deleteSelected = function() {
          if(scope.selectedArray.length === 0) {
            console.log('Alert for selection of at least one');
            // showToast(false, 'Please select deck to delete.');
          } else {
            scope.delFn();
            scope.selectedArray = [];
            scope.deleting = false;
          }
        };
      },
      templateUrl: 'views/pageUtil.html'
    };
  });