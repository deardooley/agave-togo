'use strict';

angular.module('AgaveToGo').controller('NotificationsAlertsDirectoryController', function ($scope,$state, $rootScope, $stateParams, toastr,$translate, MetaController, ActionsService, ActionsBulkService, MessageService) {

    $scope._COLLECTION_NAME = 'notifications';
    $scope._RESOURCE_NAME = 'notification';

    $scope[$scope._COLLECTION_NAME] = [];
    $scope.notificationSelected = [];

    $scope.query = '{"name":"notifications"}';
    $scope.queryLimit = 99999;

    $scope.offset = 0;
    $scope.limit = 5;

    $scope.sortType = 'created';
    $scope.sortReverse  = true;
    toastr.options = {
        timeOut: 100000,
        extendedTimeOut: 100000,
        hideDuration: 10000000

    };
    $scope.refresh = function() {
      $scope.requesting = true;

      MetaController.listMetadata($scope.query, $scope.limit, $scope.offset)
        .then(
          function (response) {
            $scope.totalItems = response.result.length;
            $scope.pagesTotal = Math.ceil(response.result.length / $scope.limit);
            $scope[$scope._COLLECTION_NAME] = response.result;
            $scope.requesting = false;

          },
          function(response){
            MessageService.handle(response, $translate.instant('error_notifications_alerts'));
            $scope.requesting = false;
          }
      );
    };

    function getNotificationText(notification) {
        var toastData;
        if (notification.event === 'FORCED_EVENT') {
            toastData = 'FORCED_EVENT - ' + notification.value.source;
        } else {

            if (notification.value.source.match(/-005$/)) {
                toastData = 'APP - ' + notification.value.event;
            } else if (notification.value.source.match(/-002$/)) {
                toastData = 'FILE - ' + notification.value.event;
            } else if (notification.value.source.match(/-007$/)) {
                toastData = 'JOB - ' + notification.value.event;
            } else if (notification.value.source.match(/-006$/)) {
                toastData = 'SYSTEM - ' + notification.value.event;
            } else {
                toastData = notification.value.event;
            }
        }

        return toastData;
    }

    $scope.previewToastNotification = function(notification) {
        toastr.info(getNotificationText(notification));
    };

    // $scope.previewDesktopNtofication = function(notification) {
    //     if (Notification.permission !== "granted")
    //         window.Notification.requestPermission();
    //     else {
    //         var notif = new window.Notification("Agave ToGo", {
    //             icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
    //             body: getNotificationText(notif)
    //         });
    //
    //         notif.onclick = function () {
    //             console.log("Clicked on desktop notification for " + notification);
    //         };
    //     }
    // };

    $scope.selectAllNotifications = function(checkAll){
      if (checkAll){
        _.each($scope[$scope._COLLECTION_NAME], function(notification){
          $scope.notificationSelected.push(notification);
        });
      } else {
        $scope.notificationSelected = [];
      }
    };

    $scope.confirmBulkAction = function(collectionType, collection, selected, collectionAction){
      ActionsBulkService.confirmBulkAction(collectionType, collection, selected, collectionAction );

    };

    $scope.confirmAction = function(resourceType, resource, resourceAction, resourceList, resourceIndex){
      resource.id = resource.uuid;
      ActionsService.confirmAction(resourceType, resource, resourceAction, resourceList, resourceIndex);
    };

    $scope.$on('ActionsBulkService:done', function() {
      $scope.notificationSelected = [];
    });

    $scope.refresh();

    // // request permission on page load
    // document.addEventListener('DOMContentLoaded', function () {
    //     if (!Notification) {
    //         alert('Desktop notifications not available in your browser. Try Chromium.');
    //         return;
    //     }
    //
    //     if (Notification.permission !== "granted") {
    //         Notification.requestPermission().then(
    //             function(permission) {
    //                 $localStorage.isNotificationGranted = permission === 'granted';
    //             },
    //             function(permission) {
    //                 $localStorage.isNotificationGranted = false;
    //             });
    //     };
    // });
});
