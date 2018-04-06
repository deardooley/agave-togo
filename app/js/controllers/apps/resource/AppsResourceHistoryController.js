angular.module('AgaveToGo').controller('AppsResourceHistoryController', function($scope, $stateParams, AppsController, ActionsService) {
  $scope.sortType = 'created';
  $scope.sortReverse  = true;

  AppsController.listAppHistory($stateParams.appId)
    .then(
      function(response){
        $scope.appHistory = response.result;
        $scope.requesting = false;
      },
      function(response){
        MessageService.handle(response, $translate.instant('error_app_details'));
        $scope.requesting = false;
      }
    );

});
