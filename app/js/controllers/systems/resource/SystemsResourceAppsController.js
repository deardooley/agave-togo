angular.module('AgaveToGo').controller('SystemsResourceAppsController', function($scope, $stateParams, SystemsController, AppsController) {

  $scope.limit = 99999;
  $scope.offset = 0;

  SystemsController.getSystemDetails($stateParams.systemId)
    .then(
      function(response){
        AppsController.listApps($scope.limit, $scope.offset, { 'executionSystem.like': $stateParams.systemId })
          .then(
            function(response){
              $scope.apps = response;
            },
            function(response){
              $scope.$parent.error = true;
              App.alert({type: 'danger',message: 'Error: Could not retrieve system apps'});
            }
          );
      },
      function(response){
          $scope.$parent.error = true;
          App.alert({type: 'danger',message: 'Error: Could not retrieve system'});
      }
    );


});
