(function(window, angular) {
    "use strict";
    angular.module('FileManagerApp').service('fileUploader', ['$http', '$q', 'fileManagerConfig', 'Configuration', 'Upload', 'PostitsController', 'FilesController', function ($http, $q, fileManagerConfig, Configuration, Upload, PostitsController, FilesController) {

        function deferredHandler(data, deferred, errorMessage) {
            if (!data || typeof data !== 'object') {
                return deferred.reject('Bridge response error, please check the docs');
            }
            if (data.result && data.result.error) {
                return deferred.reject(data);
            }
            if (data.error) {
                return deferred.reject(data);
            }
            if (errorMessage) {
                return deferred.reject(errorMessage);
            }
            deferred.resolve(data);
        }

        this.files = [];

        this.uploadFile = function(file, form, filesUri, callback) {
          var self = this;
          var filepath = file.path.split('/')
          filepath.pop();

          return Upload.upload({
              url: filesUri + '/' + filepath.join('/') + "?naked=true",
              data: {
                file: file,
                fileToUpload: file,
                append: false,
                fileType: 'raw'
              },
              method: 'POST',
              headers: {
                "Content-Type": undefined,
                "Authorization": "Bearer " + Configuration.oAuthAccessToken
              }
          }).then(function (resp) {
              return callback(resp.data);
          }, function (resp) {
          }, function (evt) {
              file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          });
        }
        this.makeFolders = function(fileList, system, path){
          var promises = [];
          var self = this;
          var foldersUri = Configuration.BASEURI + 'files/v2/media/system/' + system.id + '/'+"/?naked=true&action=mkdir";
           //create directories first
          angular.forEach(fileList, function (fileObj, key) {
            self.requesting = true;
            if (fileObj.type == 'directory'){
             var body = {};
             body.action = 'mkdir'
             body.path = fileObj.path;
             promises.push(
               FilesController.updateInvokeFileItemAction(body, system.id, path.join('/'))
                   .then(function(data) {
                       //self.deferredHandler(data, deferred);
                   }, function(data) {
                       //self.deferredHandler(data, deferred, $translate.instant('error_creating_folder'));
                   })
               //self.createFolder(fileObj, foldersUri, path, function(value){
               //})
             )
            }
          })
          var deferred = $q.defer();

          return $q.all(promises).then(
            function(data) {
              deferredHandler(data, deferred);
              return true;
            },
            function(data) {
              deferredHandler(data, deferred, $translate.instant('error_uploading_directory'));
              return false;
            }
          )
          return true;
        }
        this.requesting = false;
        //
        // this.createDirectoryTree = function(fileList, system, path) {
        //   if (! window.FormData) {
        //     throw new Error('Unsupported browser version');
        //   }
        //
        //   var promises = [];
        //   var totalCreated = 0;
        //
        //   // iterate through the files to find the list of maximum unique relative paths
        //   // in the list. This is the fastest way to mirror the directory tree of the
        //   // relative paths of the upload list.
        //   var relativePaths = [];
        //   var maxPaths = [];
        //   angular.forEach(fileList, function (fileObj, key) {
        //     var form = new window.FormData();
        //
        //     if (fileObj instanceof window.File && fileObj.path) {
        //       relativePaths[fileObj.path] = 1;
        //     }
        //   });
        //   console.log(_.keys(relativePaths));
        //
        //   _.sortBy(relativePaths, "key");
        //
        //   var uniqueRelativePaths = _.keys(relativePaths);
        //
        //   console.log(uniqueRelativePaths);
        //
        //   var uniqueLongestRelativePaths = [];
        //
        //   var len = uniqueRelativePaths.length;
        //   var longestPrefix = '';
        //   for (var i=len-1;i>0; i--) {
        //     if (longestPrefix == '') {
        //       longestPrefix = uniqueRelativePaths[i];
        //     }
        //     else if (!longestPrefix.startsWith(uniqueRelativePaths[i])) {
        //       longestPrefix = uniqueRelativePaths[i];
        //       uniqueLongestRelativePaths.push(longestPrefix);
        //     }
        //     else {
        //       // ignore the prefix match. it's not a longest path.
        //     }
        //   }
        //
        //   console.log(uniqueLongestRelativePaths);
        //
        //   angular.forEach(uniqueLongestRelativePaths, function (relativeDirectoryPath, key) {
        //
        //     self.requesting = true;
        //     var mkdirAction = new FileMkdirAction();
        //     mkdirAction.setName(relativeDirectoryPath);
        //
        //     promises.push(
        //       FilesController.updateInvokeFileItemAction(mkdirAction, systemId, path).then(
        //         function(response) {
        //           console.log("Successfully created " + relativeDirectoryPath);
        //           console.log(response);
        //           return response;
        //         },
        //         function(message) {
        //           console.error("Failed to create remote directory at " + relativeDirectoryPath + ". " + message);
        //           return message;
        //         })
        //     );
        //   });
        //
        //   var deferred = $q.defer();
        //
        //   return $q.all(promises).then(
        //       function(data) {
        //         deferredHandler(data, deferred);
        //       },
        //       function(data) {
        //         deferredHandler(data, deferred, $translate.instant('error_creating_directories'));
        //       })
        //       ['finally'](function (data) {
        //     self.requesting = false;
        //   });
        // };

        this.upload = function(fileList, system, path) {
          if (! window.FormData) {
            throw new Error('Unsupported browser version');
          }
          var self = this;

          var promises = [];
          var totalUploaded = 0;
          return self.makeFolders(fileList, system, path)
            .then(function(response){
              angular.forEach(fileList, function (fileObj, key) {
                if(fileObj.type != 'directory'){
                  var form = new window.FormData();

                  if (fileObj instanceof window.File) {
                    form.append('fileToUpload', fileObj);
                    form.append('append', false);
                    form.append('fileType', 'raw');
                  }

                  self.requesting = true;

                  var filesUri = Configuration.BASEURI + 'files/v2/media/system/' + system.id + '/' + path.join('/');

                  promises.push(
                    self.uploadFile(fileObj, form, filesUri, function(value){
                      self.files.push(value);
                    })
                  );
                }
              });

              var deferred = $q.defer();

              return $q.all(promises).then(
                function(data) {
                  deferredHandler(data, deferred);
                },
                function(data) {
                  deferredHandler(data, deferred, $translate.instant('error_uploading_files'));
              })
              ['finally'](function (data) {
                self.requesting = false;
              });
           })
        };

        this.download = function(file, callback) {
            var data = {
                force: "true"
            };

            var postitIt = new PostItRequest();
            postitIt.setMaxUses(2);
            postitIt.setMethod("GET");
            postitIt.setUrl([decodeURIComponent(file.model._links.self.href), $.param(data)].join('?'));

            return PostitsController.addPostit(postitIt)
                .then(function(resp) {
                    if (file.model.type !== 'dir') {
                      var link = document.createElement('a');
                      link.setAttribute('download', null);
                      link.setAttribute('href', resp._links.self.href);
                      link.style.display = 'none';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                    return callback(resp.data);
                });
        };

        this.downloadSelected = function(fileListSelected){
          var self = this;
          var promises = [];

          angular.forEach(fileListSelected, function(file){
            promises.push(
              self.download(file, function(value){
                self.files.push(value);
              })
            );
          });

          var deferred = $q.defer();

          return $q.all(promises).then(
            function(data) {
              deferredHandler(data, deferred);
            },
            function(data) {
              deferredHandler(data, deferred, $translate.instant('error_dowwnloading_files'));
          });
        };

        this.delete = function(file, callback) {
            if (file.model.path && file.model.name){
              var path = file.model.path.join('/') + '/' + file.model.name;
              var systemId = file.model.system.id;
              return FilesController.deleteFileItem(path, systemId)
                .then(
                  function(resp){
                    return callback(resp.data);
                  }
                );
            }
        };

        this.deleteSelected = function(fileListSelected){
          var self = this;
          var promises = [];

          angular.forEach(fileListSelected, function(file){
            promises.push(
              self.delete(file, function(value){
                self.files.push(value);
              })
            );
          });

          var deferred = $q.defer();

          return $q.all(promises).then(
            function(data) {
              deferredHandler(data, deferred);
            },
            function(data) {
              deferredHandler(data, deferred, 'Error deleting files');
          });
        };

    }]);
})(window, angular);
