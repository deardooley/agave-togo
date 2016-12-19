angular.module('AgaveToGo').controller('MetaAddController', function ($scope, $translate, $uibModal, ActionsService, MessageService, MetaController) {
  
  $scope.submit = function(){
    $scope.requesting = true;
    MetaController.addMetadata(JSON.stringify($scope.meta))
      .then(
        function(response){
          $uibModal.open({
            templateUrl: "views/meta/meta-edit-success.html",
            scope: $scope,
            size: 'lg',
            controller: ['$scope', '$modalInstance', function($scope, $modalInstance ) {

              $scope.meta = response.result;

              $scope.close = function()
              {
                  $modalInstance.dismiss('cancel');
              };
            }]
          });
          $scope.requesting = false;
        },
        function(response){
            MessageService.handle(response, $translate.instant('error_meta_add'));
            $scope.requesting = false;
        }
      );
  };

  $scope.meta = {};

  $scope.submitButton = true;

  $scope.onLoad = function (instance) {
    $scope.editor = instance;

    // jsoneditor currently has no support for menu extension
    // or autocompletion callbacks. The ace editor supports both
    // these features. The following code would add autocompletion
    // to the "schemaId" field. One could also listen for a valid
    // schema selection event and load that schema to do client-side
    // validation in the editor...
    //
    // $scope.editor.setOptions({enableBasicAutocompletion: true});
    //
    // var schemaCompleter = {
    //   getCompletions: function(editor, session, pos, prefix, callback) {
    //     if (!prefix.contains('"schemaId":')) { callback(null, []); return }
    //     var schemaQuery = {uuid: "/" + prefix.subString(prefix.indexOf(':')) + "*/"};
    //
    //     MetaController.listMetadataSchema(JSON.stringify(schemaQuery), $scope.limit, $scope.offset)
    //         .then(
    //             function (response) {
    //               callback(null, response.result.map(function(ea) {
    //                 return {name: ea.uuid, value: ea.uuid, score: 300, meta: ea.schema}
    //               }));
    //             },
    //             function(response){
    //               MessageService.handle(response, $translate.instant('error_meta_schema_list'));
    //             }
    //         );
    //   }
    // }
    // langTools.addCompleter(schemaCompleter);
  };

  $scope.handleError = function(error){
    if (typeof error === 'undefined'){
      $scope.submitButton = true;
    } else {
      $scope.submitButton = false;
    }
  };

  $scope.options = {mode: 'code', change: $scope.handleError };

});
