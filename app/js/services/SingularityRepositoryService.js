angular.module('QuayRepositoryService', []).service('Quay', ['$rootScope', '$http', '$q', '$localStorage',
function ($rootScope, $http, $q, $localStorage) {

    this.failedPromise = function (message) {
        "use strict";
        var deferred = $q.defer();
        deferred.reject({data: {message: [message], code: 400}});
        return deferred.promise;
    };

    this.list = function(limit, page) {

      page = page || 0;
      limit = limit || 25;

      // check for the image list cached in local storage
      if ($localStorage.singularityImages) {
        return $q(function (resolve, reject) {
          setTimeout(function () {
            if (limit == -1) {
              resolve($localStorage.singularityImages);
            }
            else {
              resolve($localStorage.singularityImages.slice(page * limit, Math.min($localStorage.images.length, (page + 1) * limit)));
            }
          }, 0);
        });
      }
      // otherwise make the remote call
      else {
        FilesController.listFileItems().then(
            function(response) {
              $localStorage.singularityImages = resp;
              if (limit == -1) {
                resolve(resp);
              }
              else {
                response.slice(page*limit, Math.min(resp.data.repositories.length, (page+1)*limit));
              }
        }, function (error) {
          delete $localStorage.images;
          deferred.reject(error);
        });

        return deferred.promise;
      }
    };

    this.getImageDetails = function(imageName) {

      // check for the image list cached in local storage
      if (imageName !== '' && $localStorage['image-' + imageName]) {
        return $q(function (resolve, reject) {
          setTimeout(function () {
            resolve($localStorage['image-' + imageName]);
          }, 0);
        });
      }
      // otherwise make the remote call
      else {
        var options = {
          url: this.baseUrl + '/biocontainers/jq?includeStats=true',
          method: 'GET'
        };
        var deferred = $q.defer();
        var response = $http(options);

        response.then(function (resp) {
          $localStorage['image-' + imageName] = resp.data;
          deferred.resolve(resp.data);

        }, function (error) {
          deferred.reject(error);
        });

        return deferred.promise;
      }

    }
}]);
