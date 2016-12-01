angular.module('AgaveToGo').controller('SchemaEditController', function ($scope, $stateParams, $timeout, $translate, $uibModal, ActionsService, MessageService, MetaController, ObjectDiff) {

    $scope.uuid = $stateParams.uuid ? $stateParams.uuid : null;

    $scope.refresh = function() {
      $scope.schemaOriginal = '';
      $scope.schemaEdit = '';
      $scope.schemaDiff = '';

      if ($scope.uuid) {
        $scope.requesting = true;
        MetaController.getMetadataSchema($scope.uuid)
          .then(
            function(response){
              $scope.schemaOriginal = angular.copy(response.result);
              $scope.schemaEdit = response.result.schema;
              $scope.requesting = false;
            },
            function(response){
              MessageService.handle(response, $translate.instant('error_meta_schema_list'));
            }
          );
      } else {
        App.alert(
          {
            type: 'danger',
            message: $translate.instant('error_meta_schema_update_uuid')
          }
        );
      }
    };

    $scope.refresh();

    $scope.submit = function(){

      MetaController.updateMetadataSchema(JSON.stringify($scope.schemaEdit), $scope.schemaOriginal.uuid)
        .then(
          function(response){
            $uibModal.open({
              templateUrl: "views/meta/schema-edit-success.html",
              scope: $scope,
              size: 'lg',
              controller: ['$scope', '$modalInstance', function($scope, $modalInstance ) {

                $scope.schema = response.result;

                $scope.close = function()
                {
                    $modalInstance.dismiss('cancel');
                };
              }]
            });
            $scope.refresh();
          },
          function(response){

          }
        );

    }

    $scope.submitButton = true;

    $scope.handleError = function(error){
      if (typeof error === 'undefined'){
        $scope.submitButton = true;
      } else {
        $scope.submitButton = false;
      }
    };

    $scope.options = {mode: 'code', change: $scope.handleError };

    $scope.onLoad = function (instance) {
      $scope.editor = instance;
    };

    $scope.$watch('schemaEdit', function(currentModel){
        if (currentModel){
          $scope.diff = ObjectDiff.diffOwnProperties($scope.schemaOriginal.schema, currentModel);
          $scope.schemaDiff = ObjectDiff.toJsonView($scope.diff);
        } 
    }, true);

});
