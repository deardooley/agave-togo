angular.module('AgaveToGo').controller('FileExplorerController', function($rootScope, $scope, $http, $timeout, $stateParams, SystemsController) {

    $scope.system = undefined;
    $scope.systems = [];
    $scope.path = '';

    App.blockUI({
        target: '#agave-filemanager',
        overlayColor: '#FFF',
        animate: true
    });


    if ($stateParams.systemId) {

        SystemsController.getSystemDetails($stateParams.systemIdg).then(
            function(data) {
                $scope.path = $stateParams.path ? $stateParams.path : data.storage.homeDir;
                $scope.system = data;
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
        SystemsController.listSystems(1, 0, true, false).then(
            function (response) {
                if (response) {
                    $scope.systems = response;

                    SystemsController.getSystemDetails(response.id).then(
                        function (data) {
                            $scope.path = $stateParams.path ? $stateParams.path : data.storage.homeDir;
                            $scope.system = data;
                            App.unblockUI('#agave-filemanager');
                        },
                        function (msg) {
                            $scope.path = $stateParams.path ? $stateParams.path : '';
                            $scope.system = '';
                            App.alert({type: 'danger', message: "Unable to fetch system details. " + msg});
                            App.unblockUI('#agave-filemanager');
                        }
                    );
                } else {
                    $scope.path = $stateParams.path ? $stateParams.path : '';
                    $scope.system = '';
                    App.alert({type: 'danger', message: "No system found with the given system id."})
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