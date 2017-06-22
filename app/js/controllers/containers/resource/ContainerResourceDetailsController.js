angular.module('AgaveToGo').controller('ContainerResourceDetailsController', function($scope, $stateParams, $translate, $timeout, AppsController, ActionsService, MessageService, Quay, SystemExecutionTypeEnum) {

  $scope.requesting = true;
  $scope.image = {};

  $(".knob").knob();

  // $scope.refresh = function() {
    $scope.requesting = true;
    if ($stateParams.id) {
      Quay.getImageDetails($stateParams.id).then(
          function (image) {
            image.available = true;
            image.version = '--';
            image.runtimes = {
              docker: {
                executionType: SystemExecutionTypeEnum.CLI,
                url: 'https://quay.io/repository/biocontainers/' + image.name
              },
              singularity: {
                executionType: SystemExecutionTypeEnum.CLI,
                url: 'https://public.agaveapi.co/files/v2/download/dooley/system/singularity-storage/' + image.name + '_' + Object.keys(image.tags)[0] +'.img.bz2'
              },
              native: {
                executionType: SystemExecutionTypeEnum.CLI,
                url: ''
              }
              // rocket: {executionType: SystemExecutionTypeEnum.CLI}
            };

            $scope.image = image;
            $scope.requesting = false;

            $timeout(function() {


            $(".knob").val(image.popularity).trigger('change');

            },50);

          },
          function (errorResponse) {
            $scope.requesting = false;
            MessageService.handle(response, $translate.instant('error_container_details'));
          });
    }
    else {
      $scope.requesting = false;
      $state.go("containers-browser");
    }
  // };

  $scope.confirmAction = function(resourceType, resource, resourceAction, resourceIndex){
    ActionsService.confirmAction(resourceType, resource, resourceAction, resourceIndex);
  };

  $scope.getNotifications = function(resourceType, resource){
    ActionsService.getNotifications(resourceType, resource);
  };

  // $scope.refresh();

});
