'use strict';
angular.module('AgaveToGo').service('Datasets', function ($rootScope, $window, $localStorage, $q, Commons, MetaController, ProfilesController, Tags, Configuration) {

    var metadataKey =  function() {
        return App.getClientKey() + '-datasetcollection-dataset';
    };

    this.createDataset = function() {
        var dataset = new Metadata()
        dataset.setName(metadataKey);
        dataset.setValue({
            icon: '',
            name: '',
            description: '',
            collections: [],
            fileItems: [],
            license: "",
            visible: true
        });
        dataset.setOwner(App.getAuthenticatedUserProfile.username);
        return dataset;
    };

    this.list = function(limit, offset) {
        return MetaController.listMetadata({"key": metadataKey()}, limit, offset);
    };

    this.listForCollection = function(collectionId, limit, offset) {
        return MetaController.listMetadata({"key": metadataKey(), collections: collectionId}, limit, offset);
    };

    this.add = function(dataset) {
        if (dataset) {
            dataset.name = metadataKey();
            return MetaController.addMetadata(dataset);
        } else {
            return getErrorResponse("Please provide a valid dataset to add.");
        }
    };

    this.update = function(dataset) {
        if (dataset && dataset.id) {
            return MetaController.updateMetadata(dataset, dataset.id);
        } else {
            return getErrorResponse("Please provide a valid dataset to update.");
        }
    };

    this.delete = function(dataset) {
        if (dataset && dataset.id) {
            dataset.value.visible = false;
            return MetaController.updateMetadata(dataset, dataset.id);
        } else {
            return $q(function(resolve, reject) {
                setTimeout(function() {
                    reject("Please provide a valid dataset to delete.");
                }, 0);
            });
        }
    };

    this.setPermission = function(permission, datasetId) {
        if (!datasetId) {
            return getErrorResponse("Please provide a valid dataset to which the permission applies.");
        }
        else if (permission) {
            return MetaController.addMetadataPermission(permission, datasetId);
        } else {
            return getErrorResponse("Please provide a valid permission to apply.");
        }
    };

});