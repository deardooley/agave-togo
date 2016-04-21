angular.module('AgaveToGo').controller('SystemsResourceQueuesController', function($scope, $stateParams, SystemsController) {
  SystemsController.getSystemDetails($stateParams.systemId)
    .then(
      function(response){
        $scope.queues = response.queues;
        $scope.$parent.systemId = $stateParams.systemId;
      },
      function(response){
        $scope.$parent.error = true;
        App.alert({type: 'danger',message: 'Error: Could not retrieve system'});
      }
    );
});
