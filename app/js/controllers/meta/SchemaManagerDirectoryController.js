angular.module('AgaveToGo').controller('SchemaManagerDirectoryController', function ($scope, $stateParams, $translate, MetaController, ActionsService, MessageService) {

    $scope._COLLECTION_NAME = 'metas';
    $scope._RESOURCE_NAME = 'meta';

    $scope[$scope._COLLECTION_NAME] = [];

    $scope.query = '';

    $scope.offset = 0;
    $scope.limit = 10;

    $scope.sortType = 'lastUpdated';
    $scope.sortReverse  = true;

    $scope.refresh = function() {
      $scope.requesting = true;

      if ($stateParams.id){
        $scope.filter = $stateParams.id;
      }

      MetaController.listMetadataSchema ($scope.query)
        .then(
          function (response) {
            $scope[$scope._COLLECTION_NAME] = response.result;
            $scope.requesting = false;
          },
          function(response){
            MessageService.handle(response, $translate.instant('error_meta_schema_list'));
            $scope.requesting = false;
          }
      );
    };

    $scope.refresh();

    $scope.confirmAction = function(resourceType, resource, resourceAction, resourceList, resourceIndex){
      resource.id = resource.uuid;
      ActionsService.confirmAction(resourceType, resource, resourceAction, resourceList, resourceIndex);
    }
});
