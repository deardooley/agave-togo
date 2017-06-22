angular.module('AgaveToGo').controller('ContainerResourceStatsController', function($scope, $state, $stateParams, $timeout, $translate, Quay, SystemExecutionTypeEnum, SystemsController, AppsController, MessageService) {
  $scope.stats = [];
  $scope.image = {};
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

          Quay.getImageTags($stateParams.id).then(
              function (response) {
                $scope.stats = response;
              },
              function (errorResponse) {
                MessageService.handle(response, $translate.instant('error_container_stats'));
              });

        },
        function (errorResponse) {
          MessageService.handle(response, $translate.instant('error_container_details'));
        });


  }
  else {
    $state.go("containers-browser");
  }

});
