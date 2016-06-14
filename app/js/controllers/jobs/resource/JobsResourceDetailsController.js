angular.module('AgaveToGo').controller('JobsResourceDetailsController', function($scope, $stateParams, $state, JobsController, ActionsService, PermissionsService) {

  $scope.job = null;

  $scope.getJob = function(){
    $scope.requesting = true;
    if ($stateParams.id !== ''){
      JobsController.getJobDetails($stateParams.id)
        .then(
          function(response){
            $scope.job = response;
            $scope.requesting = false;
          },
          function(response){
            var message = response.errorMessage ? 'Error: Could not retrieve job - ' + response.errorMessage : 'Error: Could not retrieve job';
            App.alert(
              {
                type: 'danger',
                message: message
              }
            );
            $scope.requesting = false;
          }
        );
    } else {
      var message = response.errorMessage ? 'Error: Could not retrieve job - ' + response.errorMessage : 'Error: Could not retrieve job';
      App.alert(
        {
          type: 'danger',
          message: message
        }
      );
    }
  };

  $scope.browse = function(id){
    JobsController.getJobDetails(id)
      .then(
        function(data){
          $state.go('data-explorer', {'systemId': data.archiveSystem, path: data.archivePath});
        },
        function(data){
          var message = response.errorMessage ? 'Error: Could not retrieve job - ' + response.errorMessage : 'Error: Could not retrieve job';
          App.alert(
            {
              type: 'danger',
              message: message
            }
          );
          $scope.requesting = false;
        }
      );
  }

  // $scope.confirmAction = function(resourceType, resource, resourceAction, resourceIndex){
  //   ActionsService.confirmAction(resourceType, resource, resourceAction, resourceIndex);
  // };
  //
  // $scope.editPermissions = function(resource) {
  //   PermissionsService.editPermissions(resource);
  // }
  //
  // $scope.edit = function(resourceType, resource){
  //   ActionsService.edit(resourceType, resource);
  // };

  $scope.getJob();

});
