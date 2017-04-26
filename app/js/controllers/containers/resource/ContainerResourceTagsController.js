angular.module('AgaveToGo').controller('ContainerResourceTagsController', function($scope, $state, $stateParams, SystemsController, Quay) {

  $scope.tags = [];

  if ($stateParams.id) {
    Quay.getImageTags($stateParams.id).then(
        function (response) {
          $scope.tags = response;
          $scope.requesting = false;
        },
        function (errorResponse) {
          MessageService.handle(response, $translate.instant('error_image_tags'));
        });
  }
  else {
    $state.go("containers-browser");
  }

});
