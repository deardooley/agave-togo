'use strict';

angular.module('AgaveToGo').controller('NotificationsAlertsDirectoryController', function ($scope, $stateParams, $translate, MetaController, ActionsService, ActionsBulkService, MessageService) {

    $scope._COLLECTION_NAME = 'notifications';
    $scope._RESOURCE_NAME = 'notification';

    $scope[$scope._COLLECTION_NAME] = [];
    $scope.notificationSelected = [];

    $scope.query = '{"name":"notifications"}';
    $scope.queryLimit = 99999;

    $scope.offset = 0;
    $scope.limit = 10;

    $scope.sortType = 'created';
    $scope.sortReverse  = true;

    $scope.refresh = function() {
      $scope.requesting = true;

      MetaController.listMetadata($scope.query, null, $scope.offset)
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
});
