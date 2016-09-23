'use strict';

angular.module('frontendApp')
  .directive('pageUtil', function() {
    return {
      restrict: 'E',
      scope: {
        isOwner: '=',
        isOnline: '=',
        isSingleItem: '@',
        isDeleteFilter: '=',
        deleting: '=',
        changing: '=',
        permDeleting: '=',
        puttingBack: '=',
        selectedArray: '=',
        displayedArray: '=',
        addFn: '&',
        changeFn: '&',
        delFn: '&',
        permDelFn: '&',
        putBackFn: '&'
      },
      // bindToController: ,
      controller: function($scope, $mdToast) {
        $scope.deleting = false;
        $scope.changing = false;
        $scope.selectedArray = [];
        $scope.displayedArray = [];

        function showToast(success,msg) {
          var theme;
          if (success) {
            theme = 'success-toast';
          } else {
            theme = 'failure-toast';
          }
          $mdToast.show(
            $mdToast.simple()
              .textContent(msg)
              .position('top right')
              .theme(theme)
              .hideDelay(1000)
          );
        }

        $scope.showPermanentDeleteOptions = function() {
          if ($scope.isSingleItem === 'true') {
            $scope.permDelFn();
          } else {
            $scope.permDeleting = true;
            $scope.puttingBack = false;
            $scope.selectedArray = [];
          }
        };
        $scope.showPutBackOptions = function() {
          if ($scope.isSingleItem === 'true') {
            $scope.putBackFn();
          } else {
            $scope.permDeleting = false;
            $scope.puttingBack = true;
            $scope.selectedArray = [];
          }
        };

        $scope.showDeleteOptions = function() {
          if ($scope.isSingleItem === 'true') {
            $scope.delFn();
          } else {
            $scope.deleting = true;
            $scope.changing = false;
            $scope.selectedArray = [];
          }
        };

        $scope.showUpdateOptions = function(event) {
          if ($scope.isSingleItem === 'true') {
            $scope.changeFn({event: event});
          } else {
            $scope.changing = true;
            $scope.deleting = false;
            $scope.selectedArray = [];
          }
        };

        $scope.showAddDialog = function(event) {
          //hide checkboxes
          $scope.deleting = false;
          $scope.changing = false;
          $scope.selectedArray = [];
          $scope.addFn({event: event});
        };

        $scope.cancelChange = function() {
          $scope.changing = false;
          $scope.selectedArray = [];
        };

        $scope.toggleAll = function() {
          // check existance of array of items to be displayed
          if ($scope.displayedArray) {
            if ($scope.selectedArray.length === $scope.displayedArray.length) {
              $scope.selectedArray = [];
            } else if ($scope.selectedArray.length >= 0) {
              $scope.selectedArray = $scope.displayedArray.slice();
            }
          }
        };

        $scope.isAllSelected = function() {
          if (!$scope.displayedArray) {
            return false;
          }
          return $scope.selectedArray.length === $scope.displayedArray.length;
        };

        $scope.cancelDelete = function() {
          $scope.deleting = false;
          $scope.permDeleting = false;
          $scope.puttingBack = false;
          $scope.selectedArray = [];
        };

        $scope.deleteSelected = function() {
          if($scope.selectedArray.length === 0) {
            showToast(false, 'Please select deck to delete.');
          } else {
            $scope.delFn();
            $scope.selectedArray = [];
            $scope.deleting = false;
          }
        };

        $scope.putBackSelected = function() {
          if($scope.selectedArray.length === 0) {
            showToast(false, 'Please select deck you want to put back.');
          } else {
            $scope.putBackFn();
            $scope.selectedArray = [];
            $scope.puttingBack = false;
          }
        };

        $scope.permDeleteSelected = function() {
          if($scope.selectedArray.length === 0) {
            showToast(false, 'Please select deck to delete permanently.');
          } else {
            $scope.permDelFn();
            $scope.selectedArray = [];
            $scope.permDeleting = false;
          }
        };
      },
      templateUrl: 'views/pageUtil.html'
    };
  });
