angular.module('AgaveToGo').controller('SchemaAddController', function ($scope, $timeout, $translate, $uibModal, ActionsService, MessageService, MetaController) {

    $scope.submit = function(){

      MetaController.addMetadataSchema(JSON.stringify($scope.schema))
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
          },
          function(response){

          }
        );
    };

    $scope.schema = {};

    $scope.submitButton = true;

    $scope.onLoad = function (instance) {
      $scope.editor = instance;
    };

    $scope.handleError = function(error){
      if (typeof error === 'undefined'){
        $scope.submitButton = true;
      } else {
        $scope.submitButton = false;
      }
    };

    $scope.options = {mode: 'code', change: $scope.handleError };

    $scope.handleError = function(error){
      if (typeof error === 'undefined'){
        $scope.submitButton = true;
      } else {
        $scope.submitButton = false;
      }
    };

});
