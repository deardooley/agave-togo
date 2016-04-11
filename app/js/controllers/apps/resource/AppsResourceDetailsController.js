angular.module('AgaveToGo').controller('AppsResourceDetailsController', function($scope, $stateParams, AppsController) {

  $scope.$parent.error = false;

  $scope.app = null;

  if ($stateParams.appId !== ''){
    AppsController.getAppDetails($stateParams.appId)
      .then(
        function(response){
          $scope.app = response;
        },
        function(response){
          $scope.$parent.error = true;
          App.alert({type: 'danger', message: 'Error: Could not retrieve app'});
        }
      );
  } else {
    $scope.$parent.error = true;
    App.alert({type: 'danger', message: 'Error: Could not retrieve app'});
  }

});
