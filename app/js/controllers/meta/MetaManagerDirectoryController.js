angular.module('AgaveToGo').controller('MetaManagerDirectoryController', function ($scope, $stateParams, MetaController, ActionsService) {

    $scope._COLLECTION_NAME = 'metas';
    $scope._RESOURCE_NAME = 'meta';

    $scope[$scope._COLLECTION_NAME] = [];

    $scope.query = '';
    // $scope.query = '{"associationIds": {"$in": ["2228133651943526886-242ac113-0001-002", "8441553504926232090-242ac112-0001-002"]}}';

    $scope.offset = 0;
    $scope.limit = 99999;

    $scope.sortType = 'event';
    $scope.sortReverse  = true;

    $scope.refresh = function() {
      $scope.requesting = true;

      if ($stateParams.id){
        $scope.filter = $stateParams.id;
      }

      MetaController.listMetadata($scope.query, $scope.limit, $scope.offset)
        .then(
          function (response) {
            $scope[$scope._COLLECTION_NAME] = response.result;
            $scope.requesting = false;
          },
          function(response){
            MessageService.handle(response, $translate.instant('error_meta_list'));
            $scope.requesting = false;
          }
      );
    };

    $scope.refresh();

    // $scope.confirmAction = function(resourceType, resource, resourceAction, resourceList, resourceIndex){
    //   resource.id = resource.uuid;
    //   ActionsService.confirmAction(resourceType, resource, resourceAction, resourceList, resourceIndex);
    // }
});
