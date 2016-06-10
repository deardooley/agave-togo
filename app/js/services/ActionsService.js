angular.module('AgaveToGo', []).service('ActionsService',['$uibModal', '$rootScope', '$location', '$state', 'AppsController', 'SystemsController', function($uibModal, $rootScope, $location, $state, AppsController, SystemsController){

  this.confirmAction = function(resourceType, resource, resourceAction, resourceList, resourceIndex){
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modals/ModalConfirmResourceAction.html',
        scope: $rootScope,
        resolve:{
            resource: function() {
              return resource;
            },
            resourceType: function() {
              return resourceType;
            },
            resourceAction: function() {
              return resourceAction;
            },
            resourceList: function(){
              return resourceList;
            },
            resourceIndex: function(){
              return resourceIndex;
            }
        },
        controller: ['$scope', '$modalInstance', 'resourceType', 'resource', 'resourceAction', 'resourceList', 'resourceIndex',
          function($scope, $modalInstance, resourceType, resource, resourceAction, resourceList, resourceIndex ){
            $scope.resourceType = resourceType;
            $scope.resource = resource;
            $scope.resourceAction = resourceAction;
            $scope.resourceIndex = resourceIndex;
            $scope.resourceList = resourceList;

            $scope.ok = function(){
              switch(resourceType){
                case 'apps':
                  switch(resourceAction){
                    case 'enable':
                    case 'disable':
                    case 'publish':
                    case 'unpublish':
                      var body = {'action': resourceAction};
                      AppsController.updateInvokeAppAction(resource.id, body)
                        .then(
                          function(response){
                            angular.copy(response, resource);
                            // $scope.$apply();
                            $modalInstance.dismiss();
                          },
                          function(response){
                          var message = response.errorMessage ?  "Error trying to " + resourceAction + " " + resource.id + " - " + response.errorMessage : "Error trying to " + resourceAction + " " + resource.id;
                            App.alert({
                               type: 'danger',
                               message: message
                            });
                            $modalInstance.dismiss();
                          });
                      break;
                    case 'delete':
                    AppsController.deleteApp(resource.id)
                      .then(
                        function(response){
                          if (typeof resourceList === 'undefined' || resourceList === ''){
                            $location.path('/apps');
                          } else {
                            $scope.appsDetailsList.splice($scope.appsDetailsList.indexOf($scope.resourceIndex), 1);
                          }
                          $modalInstance.dismiss();
                        },
                        function(response){
                          var message = response.errorMessage ?  "Error trying to " + resourceAction + " " + resource.id + " - " + response.errorMessage : "Error trying to " + resourceAction + " " + resource.id;
                          App.alert({
                             type: 'danger',
                             message: message
                          });
                          $modalInstance.dismiss();
                        });
                      break;
                  }
                  break;
                case 'systems':
                  switch(resourceAction){
                    case 'enable':
                    case 'disable':
                    case 'publish':
                    case 'unpublish':
                      var body = {'action': resourceAction};
                      SystemsController.updateInvokeSystemAction(body, resource.id)
                        .then(
                          function(response){
                            angular.copy(response, resource);
                            $scope.$apply();
                            $modalInstance.dismiss();
                          },
                          function(response){
                          var message = response.errorMessage ?  "Error trying to " + resourceAction + " " + resource.id + " - " + response.errorMessage : "Error trying to " + resourceAction + " " + resource.id;
                            App.alert({
                               type: 'danger',
                               message: message
                            });
                            $modalInstance.dismiss();
                          });
                      break;
                    case 'delete':
                      SystemsController.deleteSystem(resource.id)
                        .then(
                          function(response){
                            if (typeof resourceList === 'undefined' || resourceList === ''){
                              $location.path('/systems');
                            } else {
                              var removeIndex = _.findIndex($scope.resourceList, function(res){
                                return res.id === resource.id;
                              });
                              $scope.resourceList.splice(removeIndex, 1);
                            }
                            $modalInstance.dismiss();
                          },
                          function(response){
                          var message = response.errorMessage ?  "Error trying to " + resourceAction + " " + resource.id + " - " + response.errorMessage : "Error trying to " + resourceAction + " " + resource.id;
                            App.alert({
                               type: 'danger',
                               message: message
                            });
                            $modalInstance.dismiss();
                          });
                          break;
                  }
              }
          };

          $scope.cancel = function()
          {
              $modalInstance.dismiss('cancel');
          };
        }]

      });
  };

  this.edit = function(resourceType, resource){
    switch(resourceType){
      case 'apps': $state.go('apps-edit', {'appId': resource.id });
        break;
      case 'systems': $state.go('systems-edit', {'systemId': resource.id });
        break;
    }
  }
}]);
