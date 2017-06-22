angular.module('AgaveToGo').controller("ContainerResourceController", function ($scope, $state, $stateParams, Quay, SystemExecutionTypeEnum) {

  $scope.imageName = $stateParams.id;
  
  $scope.refresh = function () {
    if ($stateParams.id) {
      Quay.getImageDetails($stateParams.id).then(
          function (response) {
            $scope.$parent.image = response;
          },
          function (errorResponse) {
            MessageService.handle(response, $translate.instant('error_container_details'));
          });
    }
    else {
      $state.go("containers-browser");
    }
  };

  $scope.go = function (route) {
    $state.go(route);
  };

  $scope.active = function (route) {
    // default to details tab
    if ($state.current.name === "containers") {
      $state.go("containers.details")
    }

    return $state.is(route);
  };

  $scope.tabs = [
    {heading: "Details", route: "containers.details", active: false},
    {heading: "Tags", route: "containers.tags", active: false},
    {heading: "History", route: "containers.history", active: false},
    {heading: "Run", route: "containers.run", active: false},

  ];

  $scope.$on("$stateChangeSuccess", function () {
    $scope.tabs.forEach(function (tab) {
      tab.active = $scope.active(tab.route);
    });
  });


});
