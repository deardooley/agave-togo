angular.module('AgaveToGo').controller('SystemsResourceAppsController', function($scope, $stateParams, SystemsController, AppsController) {

  $scope.limit = 99999;
  $scope.offset = 0;

  $scope.apps = null;

  if ($stateParams.systemId !== ''){
    SystemsController.getSystemDetails($stateParams.systemId)
      .then(
        function(response){
          AppsController.listApps($scope.limit, $scope.offset, { 'executionSystem.like': $stateParams.systemId })
            .then(
              function(response){
                $scope.apps = response.result;
              },
              function(response){
                var message = response.errorResponse.message ? 'Error: Could not retrieve app - ' + response.errorResponse.message : 'Error: Could not retrieve app';
                App.alert(
                  {
                    type: 'danger',
                    message: message
                  }
                );
                $scope.requesting = false;
              }
            );
        },
        function(response){
          var message = response.errorResponse.message ? 'Error: Could not retrieve system - ' + response.errorResponse.message : 'Error: Could not retrieve system';
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
      var message = response.errorResponse.message ? 'Error: Could not retrieve system - ' + response.errorResponse.message : 'Error: Could not retrieve system';
      App.alert(
        {
          type: 'danger',
          message: message
        }
      );
      $scope.requesting = false;
  }


});
