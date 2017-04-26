angular.module('AgaveToGo').controller('ContainerResourceHistoryController', function($scope, $state, $stateParams, $timeout, $translate, Quay, SystemsController, AppsController, MessageService) {

  $scope.history = [];

  if ($stateParams.id) {
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
          MessageService.handle(response, $translate.instant('error_image_history'));
        });
  }
  else {
    $state.go("containers-browser");
  }

});
