angular.module('AgaveToGo').controller('FileExplorerController', function($rootScope, $scope, $http, $timeout, $filter, $localStorage, $location, $stateParams, SystemsController) {

    $scope.system = undefined;
    $scope.systems = [];
    $scope.path = '';

    App.blockUI({
        target: '#agave-filemanager',
        overlayColor: '#FFF',
        animate: true
    });

    if ($stateParams.systemId) {

        SystemsController.getSystemDetails($stateParams.systemId).then(
            function(sys) {
                if ($stateParams.path) {
                    $scope.path = $stateParams.path;
                } else {
                    $scope.path = $localStorage.activeProfile.username;
                    $stateParams.path = $scope.path;
                    $location.path("/data/explorer/" + $stateParams.systemId + "/" + $scope.path);
                }
                $scope.system = sys;
                App.unblockUI('#agave-filemanager');
            },
            function(msg) {
                $scope.path = $stateParams.path ? $stateParams.path : '';
                $scope.system = '';
                App.alert({type: 'danger', message: "Unable to fetch system details. " + msg});
                App.unblockUI('#agave-filemanager');
            }
        );
    } else {
        SystemsController.listSystems(1, 0, true, false, 'STORAGE').then(
            function (response) {
                if (response && response.length) {
                    $location.path("/data/explorer/" + response[0].id + "/" + ($stateParams.path ? $stateParams.path : $localStorage.activeProfile.username));
                    $location.replace();
                } else {
                    $scope.path = $stateParams.path ? $stateParams.path : '';
                    $scope.system = '';
                    App.alert({type: 'danger', message: "No default storage system found for user. Please specify a system to which you would like to browse."})
                    App.unblockUI('#agave-filemanager');
                }
            },
            function (data) {
                $scope.path = $stateParams.path ? $stateParams.path : '';
                $scope.system = '';
                App.alert({type: 'danger', message: "There was an error fetching your list of available systems"});
                App.unblockUI('#agave-filemanager');
            });
    }


    //SystemsController.listSystems(1, 0, true, false).then(
    //    function (response) {
    //        $scope.systems = response;
    //        var defaultSystems = [];
    //        var currentSystem;
    //
    //        SystemsController.getSystemDetails(currentSystem.id).then(
    //            function(data) {
    //                $scope.path = $stateParams.path ? $stateParams.path : data.storage.homeDir;
    //                $scope.system = data;
    //                App.unblockUI('#agave-filemanager');
    //            },
    //            function(msg) {
    //                $scope.path = $stateParams.path ? $stateParams.path : '';
    //                $scope.system = '';
    //                App.alert({type: 'danger', message: "Unable to fetch system details. " + msg});
    //                App.unblockUI('#agave-filemanager');
    //            }
    //        );
    //    },
    //    function (data) {
    //        $scope.path = $stateParams.path ? $stateParams.path : '';
    //        $scope.system = '';
    //        App.alert({type: 'danger', message: "There was an error fetching your list of available systems"});
    //        App.unblockUI('#agave-filemanager');
    //    });
    //
    //        angular.forEach(response, function (system, key) {
    //            if ($stateParams.systemId) {
    //                if ($stateParams.systemId === system.id) {
    //                    currentSystem = system;
    //                    return false;
    //                }
    //            } else if (system.default) {
    //                currentSystem = system;
    //                return false;
    //            }
    //        });
    //
    //
    //        if ($stateParams.systemId && !currentSystem) {
    //            $scope.path = $stateParams.path ? $stateParams.path : '';
    //            $scope.system = '';
    //            App.alert({type: 'danger', message: "No system found with the given system id."})
    //            App.unblockUI('#agave-filemanager');
    //        } else {
    //            SystemsController.getSystemDetails(currentSystem.id).then(
    //                function(data) {
    //                    $scope.path = $stateParams.path ? $stateParams.path : data.storage.homeDir;
    //                    $scope.system = data;
    //                    App.unblockUI('#agave-filemanager');
    //                },
    //                function(msg) {
    //                    $scope.path = $stateParams.path ? $stateParams.path : '';
    //                    $scope.system = '';
    //                    App.alert({type: 'danger', message: "Unable to fetch system details. " + msg});
    //                    App.unblockUI('#agave-filemanager');
    //                }
    //            );
    //        }
    //
    //    },
    //    function (data) {
    //        $scope.path = $stateParams.path ? $stateParams.path : '';
    //        $scope.system = '';
    //        App.alert({type: 'danger', message: "There was an error fetching your list of available systems"});
    //        App.unblockUI('#agave-filemanager');
    //    });

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