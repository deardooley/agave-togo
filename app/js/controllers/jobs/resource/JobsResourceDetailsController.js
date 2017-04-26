angular.module('AgaveToGo').controller('JobsResourceDetailsController', function($scope, $stateParams, $state, $translate, $uibModal, JobsController, ActionsService, MessageService, PermissionsService, NotificationsController) {

  $scope.job = null;

  $scope.getJob = function(){
    $scope.requesting = true;
    if ($stateParams.id !== ''){
      JobsController.getJobDetails($stateParams.id)
        .then(
          function(response){
            $scope.job = response.result;
            $scope.requesting = false;
          },
          function(response){
            MessageService.handle(response, $translate.instant('error_jobs_details'));
            $scope.requesting = false;
          }
        );
    } else {
      MessageService.handle(response, $translate.instant('error_jobs_details'));
      $scope.requesting = false;
    }
  };

  $scope.browse = function(id){
    JobsController.getJobDetails(id)
      .then(
        function(data){
          $state.go('data-explorer', {'systemId': data.archiveSystem, path: data.archivePath});
        },
        function(data){
          MessageService.handle(response, $translate.instant('error_jobs_details'));
          $scope.requesting = false;
        }
      );
  };

  
  $scope.editPermissions = function(resource, resourceType) {
    PermissionsService.editPermissions(resource, resourceType);
  }

  $scope.confirmAction = function(resourceType, resource, resourceAction, resourceList, resourceIndex){
    ActionsService.confirmAction(resourceType, resource, resourceAction, resourceList, resourceIndex);
  }

  $scope.getJob();

});
