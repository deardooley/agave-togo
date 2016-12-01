angular.module('AgaveToGo').controller('MetaAddController', function ($scope, $translate, $uibModal, ActionsService, MessageService, MetaController) {
  
  $scope.submit = function(){
    $scope.requesting = true;
    MetaController.addMetadata(JSON.stringify($scope.meta))
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
          $scope.requesting = false;
        },
        function(response){
            MessageService.handle(response, $translate.instant('error_meta_add'));
            $scope.requesting = false;
        }
      );
  };

  $scope.meta = {};

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

});
