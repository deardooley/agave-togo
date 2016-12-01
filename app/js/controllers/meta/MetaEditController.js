angular.module('AgaveToGo').controller('MetaEditController', function ($scope, $stateParams, $timeout, $translate, $uibModal, ActionsService, MessageService, MetaController, ObjectDiff) {

    $scope.uuid = $stateParams.uuid ? $stateParams.uuid : null;

    $scope.refresh = function() {
      $scope.requesting = true;
      $scope.metaOriginal = '';
      $scope.metaEdit = '';
      $scope.metaDiff = '';

      if ($scope.uuid) {
        $scope.requesting = true;
        MetaController.getMetadata($scope.uuid)
          .then(
            function(response){
              $scope.uuid = angular.copy(response.result.uuid);

              $scope.metaOriginal = {};
              $scope.metaOriginal.name = angular.copy(response.result.name);
              $scope.metaOriginal.associationIds = angular.copy(response.result.associationIds);
              $scope.metaOriginal.value = angular.copy(response.result.value);

              $scope.metaEdit = {};
              $scope.metaEdit.name = response.result.name;
              $scope.metaEdit.associationIds = response.result.associationIds;
              $scope.metaEdit.value = response.result.value;

              $scope.requesting = false;
            },
            function(response){
              MessageService.handle(response, $translate.instant('error_meta_list'));
              $scope.requesting = false;
            }
          );
      } else {
        App.alert(
          {
            type: 'danger',
            message: $translate.instant('error_meta_update_uuid')
          }
        );
        $scope.requesting = false;
      }
    };

    $scope.refresh();

    $scope.submit = function(){
      $scope.requesting = true;
      MetaController.updateMetadata(JSON.stringify($scope.metaEdit), $scope.uuid)
        .then(
          function(response){

            $uibModal.open({
              templateUrl: "views/meta/meta-edit-success.html",
              scope: $scope,
              size: 'lg',
              controller: ['$scope', '$modalInstance', function($scope, $modalInstance ) {

                $scope.meta = response.result;

                $scope.close = function()
                {
                    $modalInstance.dismiss('cancel');
                };
              }]
            });
            $scope.refresh();
          },
          function(response){
            MessageService.handle(response, $translate.instant('error_meta_add'));
            $scope.requesting = false;
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

    $scope.$watch('metaEdit', function(currentModel){
        if (currentModel){
          $scope.diff = ObjectDiff.diffOwnProperties($scope.metaOriginal, currentModel);
          $scope.metaDiff = ObjectDiff.toJsonView($scope.diff);
        }
    }, true);

});
