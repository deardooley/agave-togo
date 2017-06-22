angular.module('AgaveToGo').controller('ContainerResourceHistoryController', function($scope, $state, $stateParams, $timeout, $translate, Quay, SystemsController, SystemExecutionTypeEnum, AppsController, MessageService) {

  $scope.history = [];
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

          Quay.getImageHistory($stateParams.id).then(
              function (response) {
                $scope.history = response;

                var statData = [];
                angular.forEach(response, function(stat,index) {
                  statData.push([moment(stat.date).valueOf(), stat.count]);
                });

                console.log(statData);
                $timeout(function() {
                  var options = {
                    series: {
                      color: "#83ce16",
                      bars: {
                        show: true
                      }
                    },

                    grid: {
                      tickColor: "#eee",
                      borderColor: "#eee",
                      borderWidth: 1
                    },
                    yaxis: {
                      tickDecimals: 0
                    },
                    xaxis: {
                      mode: "time",
                      minTickSize: [1, "day"]
                    }
                  };

                  var lopts = {
                    series: {
                      color: "#83ce16"
                    },
                    xaxis: {
                      mode: "time",
                      minTickSize: [1, "day"]
                    }
                  };

                  $.plot($("#image-stats-chart"), [statData], options);
                }, 500);
              },
              function (errorResponse) {
                MessageService.handle(response, $translate.instant('error_container_history'));
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
