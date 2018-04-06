angular.module('AgaveToGo').controller('SystemsResourceHistoryController', function ($scope, $stateParams, SystemsController, ActionsService) {
    $scope.sortType = 'created';
    $scope.sortReverse = true;

    SystemsController.listSystemHistory($stateParams.systemId)
        .then(
            function (response) {
                $scope.systemHistory = response.result;
                $scope.requesting = false;
            },
            function (response) {
                MessageService.handle(response, $translate.instant('error_system_details'));
                $scope.requesting = false;
            }
        );

});
