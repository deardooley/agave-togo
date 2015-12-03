'use strict';
angular.module('AgaveToGo').service('DatasetCollections', function ($rootScope, $window, $localStorage, $q, Commons, MetaController, ProfilesController, Tags, Configuration) {

    var metadataKey =  App.getClientKey() + '-collectioncollection';

    this.createCollection = function() {
        var collection = new Metadata()
        collection.setName(metadataKey);
        collection.setValue({
            icon: '',
            name: '',
            description: '',
            collectionCount: 0,
            visible: true
        });
        collection.setOwner(App.getAuthenticatedUserProfile.username);
        return collection;
    };

    this.list = function(limit, offset) {
        return MetaController.listMetadata({'key': metadataKey}, limit, offset);
    };

    this.add = function(collection) {
        if (collection) {
            var metadata = new Metadata();
            metadata.setName(metadataKey);
            return MetaController.addMetadata(metadata);
        } else {
            return getErrorResponse("Please provide a valid collection to add.");
        }
    };

    this.update = function(collection) {
        if (collection && collection.id) {
            return MetaController.updateMetadata(collection, collection.id);
        } else {
            return getErrorResponse("Please provide a valid collection to update.");
        }
    };

    this.delete = function(collection) {
        if (collection && collection.id) {
            collection.value.visible = false;
            return MetaController.updateMetadata(collection, collection.id);
        } else {
            return getErrorResponse("Please provide a valid collection to delete.");
        }
    };

    this.setPermission = function(permission, collectionId) {
        if (!collectionId) {
            return getErrorResponse("Please provide a valid collection to which the permission applies.");
        }
        else if (permission) {
            return MetaController.addMetadataPermission(permission, collectionId);
        } else {
            return getErrorResponse("Please provide a valid permission to apply.");
        }
    };

});