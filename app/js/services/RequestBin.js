'use strict';
angular.module('RequestBinService',[]).service('RequestBin', ['$http','$q', 'CacheFactory', function ($http, $q, CacheFactory) {

    var requestBinCache = CacheFactory('requestbinCache', {
        maxAge: 24 * 60 * 60 * 1000, // Items added to this cache expire after 1 hour
        deleteOnExpire: 'aggressive', // Items will be deleted from this cache when they expire
        storageMode: 'localStorage',
        storagePrefix: 'agavetogo.'
    });

    var getErrorResponse = function(errorMessage) {
        var msg = errorMessage;
        return $q(function(resolve, reject) {
            setTimeout(function() {
                reject(msg);
            }, 0);
        });
    };

    this.baseUrl = 'https://requestb.in/';

    this.getOrCreate = function(uuid) {
        if (!requestBinCache.get(uuid)) {
            return this.create(uuid);
        }
        else {
            return $q(function(resolve, reject) {
                setTimeout(function() {
                    resolve(requestBinCache.get(uuid));
                }, 0);
            });
        }
    };

    this.create = function(uuid) {
        var options = {
            url: this.baseUrl + 'api/v1/bins',
            method: 'POST',
            cache: false
        };
        var deferred = $q.defer();
        var response = $http(options);

        response.then(function (resp) {
            resp.data.url = 'https://requestb.in/' + resp.data.name;
            requestBinCache.put(uuid, resp.data);
            deferred.resolve(resp.data);
        }, function (error) {
            requestBinCache.remove(uuid);
            deferred.reject(error);
        });

        return deferred.promise;
    };

    this.getBinDetails = function(id) {

        var options = {
            url: this.baseUrl + 'api/v1/bins/' + id,
            method: 'GET',
            cache: false
        };
        var deferred = $q.defer();
        var response = $http(options);

        response.then(function (resp) {
            deferred.resolve(resp);
        }, function (error) {
            delete $localStorage.images;
            deferred.reject(error);
        });

        return deferred.promise;
    };



}]);