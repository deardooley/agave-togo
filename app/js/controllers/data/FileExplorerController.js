angular.module('AgaveToGo').controller('FileExplorerController', function($rootScope, $scope, $http, $timeout, $filter, $localStorage, $location, $state, $stateParams, $uibModal, $translate, SystemsController, FilesController, MessageService, resolvedSystem, resolvedPath) {
    // $scope.system = resolvedSystem;
    $scope.systems = [];
    $scope.path = '';

    // ui-router filters out the double slashes, so the only way to catch an absolute
    // path in a default system url is to look for an empty system id. If they specify
    // a relative path to the system url, it will not be match the path pattern and,
    // therefore, not be present in the $stateParams object.

    // if (angular.hasOwnProperty('systemId', $stateParams) && $stateParams.systemId == '') {
    //   $stateParams.path = '/' + $stateParams.path;
    // }

    $scope.error = true;
    $scope.requesting = true;

    if (resolvedSystem) {
      $scope.system = resolvedSystem;
      $scope.path = resolvedPath;
      $scope.error = false;
      $scope.requesting = false;

    }
    // no default system was found for the user 
    // we will prompt for a system to list
    else if (!resolvedSystem) {
      $uibModal.open({
        templateUrl: "views/data/system-selector.html",
        scope: $scope,
        size: 'lg',
        controller: ['$scope', '$modalInstance', function($scope, $modalInstance ) {
          $scope.getSystems = function(){
            SystemsController.listSystems(99999, 0, false, null, 'STORAGE')
                .then(function(response){
                  if (response.result && response.result.length){
                    $scope.systems = response.result;
                  } else {
                    MessageService.handle(response, $translate.instant('error_systems_default'));
                    $scope.close();
                    $('.modal-backdrop').remove();
                  }
                })
                .catch(function(response){
                  $scope.requesting = false;
                  MessageService.handle(response, $translate.instant('error_systems_default'));
                  $scope.close();
                });
          };

          $scope.makeDefault = function(system){

            var body = {'action': 'setDefault'};

            SystemsController.updateInvokeSystemAction(body, system)
                .then(function(response){
                  if ($rootScope.locationChange){
                    var updatedPath = resolvedPath;
                    if (resolvedPath) {
                      updatedPath = resolvedPath;
                    }
                    else if (system.public) {
                      updatedPath = $localStorage.activeProfile.username;
                    }
                    else {
                      updatedPath = '';
                    }

                    $state.go('data-explorer-noslash', { systemId: systemId, path: updatedPath });
                    // $location.path("/data/explorer/" + systemId + "/" + $localStorage.activeProfile.username);
                  }
                  $scope.close();
                })
                .catch(function(response){
                  $scope.requesting = false;
                  MessageService.handle(response, $translate.instant('error_systems_default'));
                  $scope.close();

                });
          };

          $scope.close = function(){
            $modalInstance.close();
          };

          $scope.cancel = function()
          {
            $modalInstance.dismiss('cancel');
          };
        }]
      });
    }
    // no system matching the system id was found for the user
    else if ($stateParams.systemId) {
      $scope.path = $stateParams.path ? $stateParams.path : '';
      $scope.system = '';
      $scope.requesting = false;
      MessageService.handle(response, $translate.instant('error_systems_list'));
      App.unblockUI('#agave-filemanager');
    }
    
    else {
      $scope.requesting = false;
      MessageService.handle(response, $translate.instant('error_systems_default'));
      App.unblockUI('#agave-filemanager');
    }

    // if ($stateParams.systemId) {
    //     SystemsController.getSystemDetails($stateParams.systemId)
    //       .then(function(response) {
    //             $scope.system = response.result;
    //             if ($scope.system.public && (typeof $stateParams.path === 'undefined' || $stateParams.path === "") ) {
    //                 // check if username path is browsable
    //                 FilesController.listFileItems(response.result.id, $localStorage.activeProfile.username, 1, 0)
    //                   .then(
    //                     function(rootFiles){
    //                       $scope.path = $localStorage.activeProfile.username;
    //                       $stateParams.path = $scope.path;
    //                       if ($rootScope.locationChange){
    //                         $state.go('data-explorer-noslash', { systemId: $stateParams.systemId, path: $scope.path });
    //                         // $location.path("/data/explorer/" + $stateParams.systemId + "/" + $scope.path);
    //                       }
    //                       $scope.error = false;
    //                       $scope.requesting = false;
    //                     },
    //                     function(rootFiles){
    //                       // check if / is browsable
    //                       FilesController.listFileItems(response.result.id, '/', 1, 0)
    //                         .then(
    //                           function(usernameFiles){
    //                             // $scope.path = '/';
    //                             // $stateParams.path = $scope.path;
    //                             if ($rootScope.locationChange){
    //                               $state.go('data-explorer', { systemId: $stateParams.systemId, path: '/'});
    //                               // $location.path("/data/explorer/" + $stateParams.systemId + "/");
    //                             }
    //                             $scope.error = false;
    //                             $scope.requesting = false;
    //                           },
    //                           function(response){
    //                             MessageService.handle(response, $translate.instant('error_files_list'));
    //                             $scope.requesting = false;
    //                           }
    //                         )
    //                   }
    //                 );
    //             } else {
    //                 $scope.path = $stateParams.path;
    //
    //                 // if ($rootScope.locationChange){
    //                 //   $state.go('data-explorer', { systemId: $stateParams.systemId, path: $scope.path });
    //                 //   // $location.path("/data/explorer/" + $stateParams.systemId + "/" + $scope.path);
    //                 // }
    //                 $scope.error = false;
    //                 $scope.requesting = false;
    //             }
    //
    //         },
    //         function(response) {
    //             $scope.path = $stateParams.path ? $stateParams.path : '';
    //             $scope.system = '';
    //             $scope.requesting = false;
    //             MessageService.handle(response, $translate.instant('error_systems_list'));
    //             App.unblockUI('#agave-filemanager');
    //         }
    //       );
    //
    // } else {
    //     SystemsController.listSystems(99999, 0, true)
    //       .then(function (response) {
    //           if (response.result && response.result.length > 0) {
    //               $scope.system = response.result[0];
    //               $scope.path = $stateParams.path;
    //               if (! $scope.path && $scope.system.public) {
    //                 $stateParams.path = $localStorage.activeProfile.username;
    //               }
    //
    //               // check if username path is browsable
    //               FilesController.listFileItems(response.result[0].id, $stateParams.path, 1, 0)
    //                 .then(
    //                   function(usernameFiles){
    //                     $stateParams.systemId = response.result[0].id;
    //                     if ($rootScope.locationChange){
    //                       $state.go('data-explorer-noslash', { systemId: $stateParams.systemId, path: $scope.path });
    //                       // $location.path("/data/explorer/" + $stateParams.systemId + "/" + $scope.path);
    //                     }
    //                     $scope.error = false;
    //                     $scope.requesting = false;
    //                   },
    //                   function(err){
    //                     // check if / is browsable
    //                     FilesController.listFileItems(response.result[0].id, '/', 1, 0)
    //                       .then(
    //                         function(rootFiles){
    //                           $scope.path = '/';
    //                           $stateParams.path = $scope.path;
    //                           $stateParams.systemId = response.result[0].id;
    //                           if ($rootScope.locationChange){
    //                             $state.go('data-explorer-noslash', { systemId: $stateParams.systemId, path: '' });
    //                             // $location.path("/data/explorer/" + $stateParams.systemId + "/");
    //                           }
    //                           $scope.error = false;
    //                           $scope.requesting = false;
    //                         },
    //                         function(response){
    //                           $scope.requesting = false;
    //                           MessageService.handle(response, $translate.instant('error_files_list'));
    //                         }
    //                       );
    //                   }
    //                 );
    //           } else {
    //               $uibModal.open({
    //                   templateUrl: "views/data/system-selector.html",
    //                   scope: $scope,
    //                   size: 'lg',
    //                   controller: ['$scope', '$modalInstance', function($scope, $modalInstance ) {
    //                       $scope.getSystems = function(){
    //                           SystemsController.listSystems(99999, 0, false, null, 'STORAGE')
    //                               .then(function(response){
    //                                   if (response.result && response.result.length){
    //                                     $scope.systems = response.result;
    //                                   } else {
    //                                     MessageService.handle(response, $translate.instant('error_systems_default'));
    //                                     $scope.close();
    //                                     $('.modal-backdrop').remove();
    //                                   }
    //                               })
    //                               .catch(function(response){
    //                                   $scope.requesting = false;
    //                                   MessageService.handle(response, $translate.instant('error_systems_default'));
    //                                   $scope.close();
    //                               });
    //                       };
    //
    //                       $scope.makeDefault = function(systemId){
    //                         var body = {'action': 'setDefault'};
    //
    //                         SystemsController.updateInvokeSystemAction(body, systemId)
    //                           .then(function(response){
    //                             if ($rootScope.locationChange){
    //                               $state.go('data-explorer-noslash', { systemId: systemId, path: $localStorage.activeProfile.username });
    //                               // $location.path("/data/explorer/" + systemId + "/" + $localStorage.activeProfile.username);
    //                             }
    //                             $scope.close();
    //                           })
    //                           .catch(function(response){
    //                             $scope.requesting = false;
    //                             MessageService.handle(response, $translate.instant('error_systems_default'));
    //                             $scope.close();
    //
    //                           });
    //                       };
    //
    //                       $scope.close = function(){
    //                           $modalInstance.close();
    //                       };
    //
    //                       $scope.cancel = function()
    //                       {
    //                           $modalInstance.dismiss('cancel');
    //                       };
    //                   }]
    //               });
    //           }
    //       },
    //       function (response) {
    //           $scope.path = $stateParams.path ? $stateParams.path : '';
    //           $scope.system = '';
    //           $scope.requesting = false;
    //           MessageService.handle(response, $translate.instant('error_systems_list'));
    //       }
    //     );
    // }

    $scope.lazyLoadFileManagerParams = [
      '../bower_components/angular-cookies/angular-cookies.min.js',
      // '../bower_components/angular-filebrowser/dist/agave-angular-filemanager.min.js',
      '../bower_components/angular-filebrowser/dist/agave-angular-filemanager.min.css',
      '../bower_components/codemirror/lib/codemirror.css',
      '../bower_components/codemirror/theme/neo.css',
      '../bower_components/codemirror/theme/solarized.css',
      '../bower_components/codemirror/mode/javascript/javascript.js',
      '../bower_components/codemirror/mode/markdown/markdown.js',
      '../bower_components/codemirror/mode/clike/clike.js',
      '../bower_components/codemirror/mode/shell/shell.js',
      '../bower_components/codemirror/mode/python/python.js',
      '../bower_components/angular-ui-codemirror/ui-codemirror.min.js',
    ];

});
