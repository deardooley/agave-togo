'use strict';

angular.module('AgaveToGo').service('ActionsBulkService',['$uibModal', '$rootScope', '$state', '$stateParams', '$translate', '$modalStack', '$q', 'NotificationsController', 'MetaController', function($uibModal, $rootScope, $state, $stateParams, $translate, $modalStack, $q, NotificationsController, MetaController){

  this.confirmBulkAction = function(collectionType, collection, selected, collectionAction){
        $uibModal.open({
          templateUrl: 'tpl/modals/ModalConfirmCollectionAction.html',
          scope: $rootScope,
          resolve:{
              collection: function() {
                return collection;
              },
              collectionType: function() {
                return collectionType;
              },
              selected: function(){
                return selected;
              },
              collectionAction: function() {
                return collectionAction;
              }
        },
        controller: ['$scope', '$modalInstance', 'collectionType', 'collection', 'selected', 'collectionAction',
          function($scope, $modalInstance, collectionType, collection, selected, collectionAction){
            $scope.collectionType = collectionType;
            $scope.collection = collection;
            $scope.selected = selected;
            $scope.collectionAction = collectionAction;

            $scope.ok = function(){
              switch(collectionType){
                case 'metas':
                  switch(collectionAction){
                    case 'delete':
                      $scope.requesting = true;
                      var promisesUuids = [];
                      var promises = [];

                      _.each(selected, function(meta){
                        promisesUuids.push(meta);
                        promises.push(
                          MetaController.deleteMetadata(meta.uuid)
                        );
                      });


                      $q.allSettled(promises)
                      .then(
                        function (promisesResult) {
                          var failed = [];
                          var success = [];
                          var promisesZipped = _.zip(promisesUuids, promisesResult);

                          _.each(promisesZipped, function(zipped){
                              if (zipped[1].status === 'fulfilled'){
                                success.push(zipped[0].uuid);
                                $scope.collection.splice($scope.collection.indexOf(zipped[0]), 1);
                              } else {
                                failed.push(zipped[0].uuid);
                              }
                          });

                          if (success.length > 0){
                            App.alert(
                             {
                               type: 'success',
                               message: $translate.instant('success_meta_delete') + JSON.stringify(success)
                             }
                           );
                          }

                          if (failed.length > 0){
                            App.alert(
                             {
                               type: 'danger',
                               message: $translate.instant('error_meta_delete') + JSON.stringify(failed)
                             }
                           );
                          }
                          $rootScope.$broadcast('ActionsBulkService:done');
                          $scope.requesting = false;
                          $modalInstance.dismiss();
                        }
                      );
                      break;
                  }
                break;

                case 'schemas':
                  switch(collectionAction){
                    case 'delete':
                      promisesUuids = [];
                      promises = [];

                      _.each(selected, function(schema){
                        promisesUuids.push(schema);
                        promises.push(
                          MetaController.deleteMetadataSchema(schema.uuid)
                        );
                      });

                      $q.allSettled(promises)
                      .then(
                        function (promisesResult) {
                          var failed = [];
                          var success = [];
                          var promisesZipped = _.zip(promisesUuids, promisesResult);

                          _.each(promisesZipped, function(zipped){
                              if (zipped[1].status === 'fulfilled'){
                                success.push(zipped[0].uuid);
                                $scope.collection.splice($scope.collection.indexOf(zipped[0]), 1);
                              } else {
                                failed.push(zipped[0].uuid);
                              }
                          });

                          if (success.length > 0){
                            App.alert(
                             {
                               type: 'success',
                               message: $translate.instant('success_meta_schema_delete') + JSON.stringify(success)
                             }
                           );
                          }

                          if (failed.length > 0){
                            App.alert(
                             {
                               type: 'danger',
                               message: $translate.instant('error_meta_schema_delete') + JSON.stringify(failed)
                             }
                           );
                          }
                          $rootScope.$broadcast('ActionsBulkService:done');
                          $modalInstance.dismiss();
                        }
                      );
                      break;
                  }
                break;

                case 'notifications':
                  switch(collectionAction){
                    case 'delete':
                      $scope.requesting = true;
                      promisesUuids = [];
                      promises = [];

                      _.each(selected, function(notification){
                        promisesUuids.push(notification);
                        promises.push(
                          NotificationsController.deleteNotification(notification.id)
                        );
                      });


                      $q.allSettled(promises)
                      .then(
                        function (promisesResult) {
                          var failed = [];
                          var success = [];
                          var promisesZipped = _.zip(promisesUuids, promisesResult);

                          _.each(promisesZipped, function(zipped){
                              if (zipped[1].status === 'fulfilled'){
                                success.push(zipped[0].id);
                                $scope.collection.splice($scope.collection.indexOf(zipped[0]), 1);
                              } else {
                                failed.push(zipped[0].id);
                              }
                          });

                          if (success.length > 0){
                            App.alert(
                             {
                               type: 'success',
                               message: $translate.instant('success_notifications_delete') + JSON.stringify(success)
                             }
                           );
                          }

                          if (failed.length > 0){
                            App.alert(
                             {
                               type: 'danger',
                               message: $translate.instant('error_notifications_delete') + JSON.stringify(failed)
                             }
                           );
                          }
                          $rootScope.$broadcast('ActionsBulkService:done');
                          $scope.requesting = false;
                          $modalInstance.dismiss();
                        }
                      );
                      break;
                  }
                break;

                case 'alerts':
                  switch(collectionAction){
                    case 'delete':
                      $scope.requesting = true;
                      promisesUuids = [];
                      promises = [];

                      _.each(selected, function(notification){
                        promisesUuids.push(notification);
                        promises.push(
                          MetaController.deleteMetadata(notification.uuid)
                        );
                      });


                      $q.allSettled(promises)
                        .then(
                          function (promisesResult) {
                            var failed = [];
                            var success = [];
                            var promisesZipped = _.zip(promisesUuids, promisesResult);

                            _.each(promisesZipped, function(zipped){
                                if (zipped[1].status === 'fulfilled'){
                                  success.push(zipped[0].uuid);
                                  $scope.collection.splice($scope.collection.indexOf(zipped[0]), 1);
                                } else {
                                  failed.push(zipped[0].uuid);
                                }
                            });

                            if (success.length > 0){
                              App.alert(
                               {
                                 type: 'success',
                                 message: $translate.instant('success_notifications_delete') + JSON.stringify(success)
                               }
                             );
                            }

                            if (failed.length > 0){
                              App.alert(
                               {
                                 type: 'danger',
                                 message: $translate.instant('error_notifications_delete') + JSON.stringify(failed)
                               }
                             );
                            }
                            $rootScope.$broadcast('ActionsBulkService:done');
                            $scope.requesting = false;
                            $modalInstance.dismiss();
                          }
                        );
                      break;
                  }
                break;

              }
            };

            $scope.cancel = function(){
                $modalInstance.dismiss('cancel');
            };

        }]

      });
  };

}]);
