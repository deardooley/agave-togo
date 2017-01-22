angular.module('AgaveToGo').controller('MetaAddController', ['$scope', '$translate', '$uibModal', '$q', 'ActionsService', 'MessageService', 'MetaController', 'Upload', function ($scope, $translate, $uibModal, $q, ActionsService, MessageService, MetaController, Upload) {

  /************** upload files tab ************/
  $scope.schema = {
    'type': 'object',
    'properties': {
      'name': {
        'type': 'string',
        'description': 'A non-unique key you can use to reference and group your metadata',
        'title': 'Name'
      },
      'associationIds': {
        'title': 'Association IDs',
        'type': 'string',
        'description': 'Enter UUIDs separated by commas to which the image(s) should be associated'
      }
    }
  };

  $scope.form = [
    {
      'key': 'name',
      $validators: {
        required: function(value) {
          return value ? true : false;
        }
      },
      validationMessage: {
        'required': 'Missing required'
      }
    },
    {
      'key': 'associationIds',
      'type': 'textarea',
      'required': false
    }
  ];

  $scope.model = {};

  $scope.submitMetadataFiles = function(){

    $scope.$broadcast('schemaFormValidate');


    if ($scope.myForm.$valid) {
      var promisesBase64 = [];
      var promisesBase64Names = [];

      // first convert all files to base64
      _.each($scope.uploadFileList, function(file){
         promisesBase64Names .push(file);
         promisesBase64.push(Upload.base64DataUrl(file));
      });


      $q.allSettled(promisesBase64)
        .then(
          function(promisesBase64Result) {
            var promises = [];
            var promisesUuids = [];
            var failed = [];
            var success = [];

            // zipping promises to associate files info and be able to display errors
            var promisesZipped = _.zip(promisesBase64Names, promisesBase64Result);

            // only insert metadata if all image conversions are succesful
            if (typeof _.findWhere(promisesBase64Result, {'status': 'rejected'}) === 'undefined'){
                var metadata = {};
                metadata.name = $scope.model.name;
                try {
                  if ($scope.model.associationIds){
                    metadata.associationIds = $scope.model.associationIds.replace(/\s/g,'').split(',');
                  }
                } catch(error){
                  App.alert(
                    {
                      type: 'danger',
                      message: $translate.instant('error_meta_image_add_parse')
                    }
                  );
                }

                metadata.value = {'files': []};

                _.each(promisesZipped, function(zipped){
                  metadata.value.files.push(
                    {
                      'info': {
                        'lastModified': zipped[0].lastModified,
                        'name': zipped[0].name,
                        'size': zipped[0].size,
                        'type': zipped[0].type
                      },
                      'data': zipped[1].value
                    }
                  );
                });

                MetaController.addMetadata(JSON.stringify(metadata))
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

            } else {
              _.each(promisesZipped, function(zipped){
                if (zipped[1].status === 'rejected'){
                  failed.push(zipped[0]);
                }
              });

              if (failed.length > 0){
                App.alert(
                 {
                   type: 'danger',
                   message: $translate.instant('error_meta_files_add') + JSON.stringify(failed)
                 }
               );
              }
            }
          },
          function(promisesBase64Result) {
            App.alert(
             {
               type: 'danger',
               message: $translate.instant('error_meta_files_add') + JSON.stringify(failed)
             }
           );
          }
        );
    }
  };

  // keep only unique files in uploader
  $scope.uniqueFiles = function(array) {
      var a = array.concat();
      for(var i=0; i<a.length; ++i) {
          for(var j=i+1; j<a.length; ++j) {
              if(a[i].name === a[j].name){
                a.splice(j--, 1);
              }

          }
      }
      return a;
  }

  $scope.uploadFileList = [];
  $scope.addForUpload = function($files) {
    $scope.uploadFileList =  $scope.uniqueFiles($scope.uploadFileList.concat($files));
  };

  $scope.removeFromUpload = function(index) {
     $scope.uploadFileList.splice(index, 1);
  };

  /************** upload files tab ************/

  $scope.submitMetadata = function(meta){
    $scope.requesting = true;
    MetaController.addMetadata(JSON.stringify(meta))
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

}]);
