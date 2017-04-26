angular.module('QuayRepositoryService', []).service('Quay', ['$rootScope', '$http', '$q', '$localStorage',
function ($rootScope, $http, $q, $localStorage) {

    this.baseUrl = "https://quay.io/api/v1/repository";

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
      if ($localStorage.images) {
        return $q(function (resolve, reject) {
          setTimeout(function () {
            resolve($localStorage.images.slice(page*limit, Math.min($localStorage.images.length, (page+1)*limit)));
          }, 0);
        });
      }
      // otherwise make the remote call
      else {
        var options = {
          url: this.baseUrl + '?private=false&public=true&namespace=biocontainers&popularity=true',
          method: 'GET',
          cache: true
        };
        var deferred = $q.defer();
        var response = $http(options);

        response.then(function (resp) {
          $localStorage.images = resp.data.repositories;
          deferred.resolve(resp.data.repositories.slice(page*limit, Math.min(resp.data.repositories.length, (page+1)*limit)));
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
          url: this.baseUrl + '/biocontainers/' + imageName + '?includeStats=true',
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

    };

  this.getImageHistory = function(imageName) {

    var deferred = $q.defer();
    var response = this.getImageDetails(imageName);

    response.then(function (resp) {
      deferred.resolve(resp.stats);
    }, function (error) {
      deferred.reject(error);
    });

    return deferred.promise;
  };

  this.getImageTags = function(imageName) {

    var deferred = $q.defer();
    var response = this.getImageDetails(imageName);

    response.then(function (resp) {
      deferred.resolve(resp.tags);
    }, function (error) {
      deferred.reject(error);
    });

    return deferred.promise;
  }

}]);
