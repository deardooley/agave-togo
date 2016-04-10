angular.module('AgaveToGo').controller('SystemsResourceStatsController', function($scope, $stateParams) {
    if ($stateParams.systemId !== ''){
      // TO-DO
    } else {
      $scope.$parent.error = true;
      App.alert({type: 'danger',message: 'Error: Could not retrieve system'});
    }
});
