'use strict';
angular.module('AgaveToGo').service('Projects', function ($rootScope, $window, $localStorage, $q, Commons, MetaController, ProfilesController, Tags, Configuration) {

    this.StatusEnum = Object.freeze({
        TESTING: "Testing",
        IMPORTANT: "Important",
        INFO: "Info",
        PENDING: "Pending",
        COMPLETED: "Completed",
        REQUESTED: "Requested",
        APPROVED: "Approved",
        FROZEN: "Frozen"
    });

    var metadataKey =  function() {
        return App.getClientKey() + '-project';
    };

    this.createProject = function() {
            var project = new Metadata()
        project.setName(metadataKey());
        project.setValue({
                name: '',
                description: '',
                status: this.PENDING,
                visible: true
            });
        project.setOwner(App.getAuthenticatedUserProfile.username);
        return project;
    };

    this.list = function(limit, offset) {
      return MetaController.listMetadata({"key": metadataKey()}, limit, offset);
    };

    this.listByStatus = function(status, limit, offset) {
        return MetaController.listMetadata({"key": metadataKey(), 'value.status': status}, limit, offset);
    };

    this.listByTag = function(tag, limit, offset) {
        return MetaController.listMetadata({"key": metadataKey(), 'value.tags': tag}, limit, offset);
    };

    this.add = function(project) {
        if (project) {
            project.name = metadataKey();
            return MetaController.addMetadata(project);
        } else {
            return getErrorResponse("Please provide a valid project to add.");
        }
    };

    this.update = function(project) {
        if (project && project.id) {
            return MetaController.updateMetadata(project, project.id);
        } else {
            return getErrorResponse("Please provide a valid project to update.");
        }
    };

    this.delete = function(project) {
        if (project && project.id) {
            project.value.visible = false;
            return MetaController.updateMetadata(project, project.id);
        } else {
            return getErrorResponse("Please provide a valid project to delete.");
        }
    };

    this.setPermission = function(permission, projectId) {
        if (!projectId) {
            return getErrorResponse("Please provide a valid project to which the permission applies.");
        }
        else if (permission) {
            return MetaController.addMetadataPermission(permission, projectId);
        } else {
            return getErrorResponse("Please provide a valid permission to apply.");
        }
    };

});