angular.module('AgaveToGo', []).service('ActionsService',['$uibModal', '$rootScope', '$location', '$state', 'AppsController', function($uibModal, $rootScope, $location, $state, AppsController){


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

            // Make available for template
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
                      var body = {'action': resourceAction};
                      AppsController.updateInvokeAppAction(resource.id, body)
                        .then(
                          function(response){
                            angular.copy(response, resource);
                            $scope.$apply();
                          },
                          function(response){
                            App.alert({
                               type: 'danger',
                               message: "Error on " + resourceAction + " " + resource.id
                            });
                          });
                      break;
                    case 'delete':
                    AppsController.deleteApp(resource.id)
                      .then(
                        function(response){
                          if (resourceList === ''){
                            $location.path('/apps');
                          } else {
                            $scope.appsDetailsList.splice($scope.appsDetailsList.indexOf($scope.resourceIndex), 1);
                          }
                        },
                        function(response){
                          App.alert({
                             type: 'danger',
                             message: "Error on " + resourceAction + " " + resourceId
                          });
                        });
                      break;
                  }
                  break;
              }
              $modalInstance.close(resource.name);
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
