angular.module('AgaveToGo').controller('SystemsResourceDetailsController', function($scope, $stateParams, SystemsController) {

  $scope.$parent.error = false;

  $scope.system = null;

  if ($stateParams.systemId !== ''){
    SystemsController.getSystemDetails($stateParams.systemId)
      .then(
        function(response){
          $scope.system = response;
          $scope.$parent.systemId = $stateParams.systemId;
        },
        function(response){
          $scope.$parent.error = true;
          App.alert({type: 'danger',message: 'Error: Could not retrieve system'});
        }
      );
  } else {
    $scope.$parent.error = true;
    App.alert({type: 'danger',message: 'Error: Could not retrieve system'});
  }

});
