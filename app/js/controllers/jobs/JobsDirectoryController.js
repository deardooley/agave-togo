angular.module('AgaveToGo').controller('JobsDirectoryController', function ($injector, $timeout, $rootScope, $scope, $state, $stateParams, $q, $uibModal, $http, Commons, AppsController, JobsController, ActionsService) {


    $scope._COLLECTION_NAME = $scope._COLLECTION_NAME || 'jobs';

    $scope._RESOURCE_NAME = $scope._RESOURCE_NAME || 'job';

    $scope.limit = 10;

    $scope.sortType = 'id';

    $scope.sortReverse  = false;

    $scope.refresh = function() {
      $scope.requesting = true;

      $scope.appId = $scope.appId === '' ? null : $scope.appId;
      $scope.archive = $scope.archive === '' ? null : $scope.archive;
      $scope.archivePath = $scope.archivePath === '' ? null : $scope.archivePath;
      $scope.archiveSystem = $scope.archiveSystem === '' ? null : $scope.archiveSystem;
      $scope.batchQueue = $scope.batchQueue === '' ? null : $scope.batchQueue;
      $scope.executionSystem = $scope.executionSystem === '' ? null : $scope.executionSystem;
      $scope.id = $scope.id === '' ? null : $scope.id;
      $scope.inputs = $scope.inputs === '' ? null : $scope.inputs;
      // $scope.limit = $scope.limi === '' ? null : $scope.limit;
      $scope.localId = $scope.localId === '' ? null : $scope.localId,
      $scope.maxRuntime = $scope.maxRuntime === '' ? null : $scope.maxRuntime;
      $scope.memoryPerNode = $scope.memoryPerNode === '' ? null : $scope.memoryPerNode;
      $scope.name = $scope.name === '' ? null : $scope.name;
      $scope.nodeCount = $scope.nodeCount === '' ? null : $scope.nodeCount;
      // $scope.offset = $scope.offset === '' ? null : $scope.offset;
      $scope.outputPath = $scope.outputPath === '' ? null : $scope.outputPath;
      $scope.owner = $scope.owner === '' ? null : $scope.owner;
      $scope.processorsPerNode = $scope.processorsPerNode === '' ? null : $scope.processorsPerNode;
      $scope.retries = $scope.retried === '' ? null : $scope.retries;
      $scope.startTime = $scope.startTime === '' ? null : $scope.startTime;
      $scope.status = $scope.status === '' ? null : $scope.status;
      $scope.submitTime = $scope.submitTime === '' ? null : $scope.submitTime;
      $scope.visible = $scope.visible === '' ? null : $scope.visible;

      JobsController.listJobs(
        $scope.appId,
        $scope.archive,
        $scope.archivePath,
        $scope.archiveSystem,
        $scope.batchQueue,
        $scope.executionSystem,
        $scope.id,
        $scope.inputs,
        null, // limit
        $scope.localId,
        $scope.maxRuntime,
        $scope.memoryPerNode,
        $scope.name,
        $scope.nodeCount,
        $scope.offset,
        $scope.outputPath,
        $scope.parameters,
        $scope.processorsPerNode,
        $scope.retries,
        $scope.startTime,
        $scope.status,
        $scope.submitTime,
        $scope.visible
      )
        .then(
          function (response) {
            $scope.totalItems = response.length;
            $scope.pagesTotal = Math.ceil(response.length / $scope.limit);
            $scope[$scope._COLLECTION_NAME] = response;
            $scope.requesting = false;
          },
          function(response){
            var message = response.errorMessage ? 'Error: Could not retrieve jobs - ' + response.errorMessage : 'Error: Could not retrieve jobs';
            App.alert(
              {
                type: 'danger',
                message: message
              }
            );
            $scope.requesting = false;
          }
      );

    };

    $scope.search = function(){
      $scope.refresh();
    }

    $scope.browse = function(id){
      JobsController.getJobDetails(id)
        .then(
          function(data){
            $state.go('data-explorer', {'systemId': data.archiveSystem, path: data.archivePath});
          },
          function(data){
            var message = response.errorMessage ? 'Error: Could not retrieve job - ' + response.errorMessage : 'Error: Could not retrieve job';
            App.alert(
              {
                type: 'danger',
                message: message
              }
            );
            $scope.requesting = false;
          }
        );
    }

    $scope.search = function(){
      $scope.refresh();
    }


    $scope.refresh();

    $scope.getPage = function(newPageNumber, oldPageNumber, resourceType){
      $scope.requesting = true;
      $scope.offset = (newPageNumber - 1) * $scope.limit;

      JobsController.listJobs(
        $scope.appId,
        $scope.archive,
        $scope.archivePath,
        $scope.archiveSystem,
        $scope.batchQueue,
        $scope.executionSystem,
        $scope.id,
        $scope.inputs,
        $scope.limit,
        $scope.localId,
        $scope.maxRuntime,
        $scope.memoryPerNode,
        $scope.name,
        $scope.nodeCount,
        $scope.offset,
        $scope.outputPath,
        $scope.parameters,
        $scope.processorsPerNode,
        $scope.retries,
        $scope.startTime,
        $scope.status,
        $scope.submitTime,
        $scope.visible
      )
        .then(
          function (response) {
            $scope.pagesTotal = Math.ceil(response.length / $scope.limit);
            $scope[$scope._COLLECTION_NAME] = response;
            $scope.requesting = false;
          },
          function(response){
            var message = response.errorMessage ? 'Error: Could not retrieve job - ' + response.errorMessage : 'Error: Could not retrieve job';
            App.alert({
               type: 'danger',
               message: message
            });
            $scope.requesting = false;
          }
      );
    }

    // $scope.confirmAction = function(resourceType, resource, resourceAction, resourceList, resourceIndex){
    //   ActionsService.confirmAction(resourceType, resource, resourceAction, resourceList, resourceIndex);
    // }
    //
    // $scope.edit = function(resourceType, resource){
    //   ActionsService.edit(resourceType, resource);
    // };
    //
    // $scope.editPermissions = function(resource) {
    //     PermissionsService.editPermissions(resource);
    // }


});
