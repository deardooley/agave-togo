angular.module('AgaveToGo').controller('FileExplorerController', function($rootScope, $scope, $http, $timeout, $filter, $localStorage, $location, $state, $stateParams, $uibModal, SystemsController) {

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
        SystemsController.listSystems(99999, 0, false, false, 'STORAGE').then(
            function (response) {
                if (response && response.length) {
                    $location.path("/data/explorer/" + response[0].id + "/" + ($stateParams.path ? $stateParams.path : $localStorage.activeProfile.username));
                    $location.replace();
                } else {
                    $uibModal.open({
                        templateUrl: "views/data/system-selector.html",
                        scope: $scope,
                        size: 'lg',
                        controller: ['$scope', '$modalInstance', function($scope, $modalInstance ) {
                            $scope.getSystems = function(){
                                SystemsController.listSystems(99999, 0, 'STORAGE')
                                    .then(function(response){
                                        if (response && response.length){
                                          $scope.systems = response;
                                        } else {
                                          App.alert({type: 'danger', message: "There was an error setting your default system"});
                                          $scope.close();

                                          $('.modal-backdrop').remove();
                                        }

                                    })
                                    .catch(function(response){
                                        App.alert({type: 'danger', message: "There was an error setting your default system"});
                                        $scope.close();
                                    });
                            };

                            $scope.makeDefault = function(systemId){
                              var body = {'action': 'setDefault'};

                              SystemsController.updateInvokeSystemAction(body, systemId)
                                .then(function(response){
                                  $location.path("/data/explorer/" + systemId + "/" + $localStorage.activeProfile.username);
                                  $scope.close();
                                  App.unblockUI('#agave-filemanager');
                                })
                                .catch(function(response){
                                  App.alert({type: 'danger', message: "There was an error setting your default system"});
                                  $scope.close();

                                });
                            };

                            $scope.close = function(){
                                $modalInstance.close();
                            }

                            $scope.cancel = function()
                            {
                                $modalInstance.dismiss('cancel');
                            };
                        }]
                    });

                    // $scope.path = $stateParams.path ? $stateParams.path : '';
                    // $scope.system = '';
                    // App.alert({type: 'danger', message: "No default storage system found for user. Please specify a system to which you would like to browse."})
                    // App.unblockUI('#agave-filemanager');
                }
            },
            function (data) {
                $scope.path = $stateParams.path ? $stateParams.path : '';
                $scope.system = '';
                App.alert({type: 'danger', message: "There was an error fetching your list of available systems"});
                App.unblockUI('#agave-filemanager');
            });
    }
});
