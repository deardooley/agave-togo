angular.module('AgaveToGo').controller('FileExplorerController', function($rootScope, $scope, $http, $timeout, $stateParams, SystemsController) {

    $scope.system = undefined;

    SystemsController.listSystems(9999, 0).then(
        function (response) {
            $scope.systems = response;
            var defaultSystems = [];
            angular.forEach(response, function (system, key) {
                if ($stateParams.systemId) {
                    if ($stateParams.systemId === system.id) {
                        $scope.system = system;
                        return false;
                    }
                } else if (system.default) {
                    $scope.system = system;
                    return false;
                }
            });

            if ($stateParams.systemId && !$scope.system) {
                App.alert({type: 'danger', message: "No system found with the given system id."})
            }
        },
        function (data) {
            $scope.resource = undefined;
            App.alert({type: 'danger', message: "There was an error fetching your list of available systems"})
        });

    //if ($stateParams.systemId) {
    //    SystemsController.getSystemDetails($stateParams.systemId).then(
    //        function (data) {
    //            $scope.system = data;
    //        },
    //        function (data) {
    //            $scope.system = undefined;
    //            self.deferredHandler(data, deferred, $translate.instant('error_fetching_system'));
    //        });
    //} else {
    //
    //}



});