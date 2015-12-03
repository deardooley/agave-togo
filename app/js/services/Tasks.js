'use strict';
angular.module('AgaveToGo').service('Tasks', function ($rootScope, $window, $localStorage, $q, Commons, MetaController, ProfilesController, Tags, Configuration, Projects) {

    var metadataKey =  function() {
        return App.getClientKey() + '-project-task';
    };

    var getErrorResponse = function(errorMessage) {
        var msg = errorMessage;
        return $q(function(resolve, reject) {
            setTimeout(function() {
                reject(msg);
            }, 0);
        });
    };

    this.createTaskForProject = function(project) {
        var task = new Metadata()
        task.setName(metadataKey());
        task.setValue({
                name: '',
                description: '',
                status: Projects.StatusEnum.PENDING,
                project: project.id,
                visible: true
            });
        task.setOwner(App.getAuthenticatedUserProfile.username);
        task.setAssociationIds[project.id];
        return task;
    };

    this.list = function(projectId, limit, offset) {
        return MetaController.listMetadata({"key": metadataKey(), project: projectId}, limit, offset);
    };

    this.listByStatus = function(status, limit, offset) {
        return MetaController.listMetadata({"key": metadataKey(), project: projectId, 'value.status': status}, limit, offset);
    };

    this.listByTag = function(tag, limit, offset) {
        return MetaController.listMetadata({"key": metadataKey(), project: projectId, 'value.tags': tag}, limit, offset);
    };

    this.add = function(task) {
        if (task) {
            if (task.value.project) {
                if (task.associationIds && task.associationIds.indexOf(task.value.project) > -1) {
                    return MetaController.addMetadata(task);
                } else {
                    task.associationIds = [task.value.project];
                    return MetaController.addMetadata(task);
                }
            } else {
                return getErrorResponse("Please associate the task with a project before saving.");
            }
        } else {
            return getErrorResponse("Please provide a valid task to add.");
        }
    };

    this.update = function(task) {
        if (task && task.id) {
            if (task.value.project) {
                if (task.associationIds && task.associationIds.indexOf(task.value.project) > -1) {
                    return MetaController.updateMetadata(task, task.id);
                }
                else {
                    return getErrorResponse("Task does not seem to be associated with the current project.");
                }
            }
        } else {
            return getErrorResponse("Please provide a valid existing task to update.");
        }
    };

    this.delete = function(task) {
        if (task && task.id) {
            task.value.visible = false;
            return MetaController.updateMetadata(task, task.id);
        } else {
            return getErrorResponse("Please provide a valid project to delete.");
        }
    };

    this.setPermission = function(permission, taskId) {
        if (!taskId) {
            return getErrorResponse("Please provide a valid task to which the permission applies.");
        }
        else if (permission) {
            return MetaController.addMetadataPermission(permission, taskId);
        } else {
            return getErrorResponse("Please provide a valid permission to apply.");
        }
    };

});