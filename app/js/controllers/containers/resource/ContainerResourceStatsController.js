angular.module('AgaveToGo').controller('ContainerResourceStatsController', function($scope, $state, $stateParams, $timeout, $translate, Quay, SystemsController, AppsController, MessageService) {
  $scope.stats = [];

  if ($stateParams.id) {
    Quay.getImageTags($stateParams.id).then(
        function (response) {
          $scope.stats = response;
        },
        function (errorResponse) {
          MessageService.handle(response, $translate.instant('error_image_stats'));
        });
  }
  else {
    $state.go("containers-browser");
  }

});
