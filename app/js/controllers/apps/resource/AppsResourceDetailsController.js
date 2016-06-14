angular.module('AgaveToGo').controller('AppsResourceDetailsController', function($scope, $stateParams, AppsController, ActionsService, PermissionsService) {

  $scope.app = null;

  $scope.getApp = function(){
    if ($stateParams.appId !== ''){
      AppsController.getAppDetails($stateParams.appId)
        .then(
          function(response){
            $scope.app = response;
          },
          function(response){
            var message = response.errorMessage ? 'Error: Could not retrieve app - ' + response.errorMessage : 'Error: Could not retrieve app';
            App.alert(
              {
                type: 'danger',
                message: message
              }
            );
          }
        );
    } else {
      var message = response.errorMessage ? 'Error: Could not retrieve app - ' + response.errorMessage : 'Error: Could not retrieve app';
      App.alert(
        {
          type: 'danger',
          message: message
        }
      );
    }
  };

  $scope.confirmAction = function(resourceType, resource, resourceAction, resourceIndex){
    ActionsService.confirmAction(resourceType, resource, resourceAction, resourceIndex);
  };

  $scope.editPermissions = function(resource) {
    PermissionsService.editPermissions(resource);
  }

  $scope.edit = function(resourceType, resource){
    ActionsService.edit(resourceType, resource);
  };

  $scope.getApp();

});
