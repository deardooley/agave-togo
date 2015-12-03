'use strict';
angular.module('AgaveToGo').service('Comments', function ($rootScope, $window, $localStorage, $q, Commons, MetaController, ProfilesController, Tags, Configuration, Projects) {

    var metadataKey =  function() {
        return App.getClientKey() + '-project-task-comment';
    };

    var getErrorResponse = function(errorMessage) {
        var msg = errorMessage;
        return $q(function(resolve, reject) {
            setTimeout(function() {
                reject(msg);
            }, 0);
        });
    };

    this.createCommentForTask = function(task) {
        var task = new Metadata()
        task.setName(metadataKey());
        task.setValue({
            name: '',
            text: '',
            task: task.id,
            visible: true
        });
        task.setOwner(App.getAuthenticatedUserProfile.username);
        task.setAssociationIds[task.id];
        return task;
    };

    this.list = function(taskId, limit, offset) {
        return MetaController.listMetadata({"key": metadataKey(), task: taskId}, limit, offset);
    };

    this.add = function(comment) {
        if (comment) {
            if (comment.value.task) {
                if (comment.associationIds && comment.associationIds.indexOf(comment.value.task) > -1) {
                    comment.name = metadataKey();
                    return MetaController.addMetadata(comment);
                } else {
                    task.associationIds = [comment.value.task];
                    return MetaController.addMetadata(comment);
                }
            } else {
                return getErrorResponse("Please associate the comment with a task before saving.");
            }
        } else {
            return getErrorResponse("Please provide a valid comment to add.");
        }
    };

    this.update = function(comment) {
        if (comment && comment.id) {
            if (comment.value.task) {
                if (task.associationIds && task.associationIds.indexOf(comment.value.task) > -1) {
                    return MetaController.updateMetadata(comment, comment.id);
                }
                else {
                    return getErrorResponse("Task does not seem to be comment with the current task.");
                }
            }
        } else {
            return getErrorResponse("Please provide a valid existing comment to update.");
        }
    };

    this.delete = function(comment) {
        if (comment && comment.id) {
            comment.value.visible = false;
            return MetaController.updateMetadata(comment, comment.id);
        } else {
            return getErrorResponse("Please provide a valid comment to delete.");
        }
    };

    this.setPermission = function(permission, commentId) {
        if (!commentId) {
            return getErrorResponse("Please provide a valid comment to which the permission applies.");
        }
        else if (permission) {
            return MetaController.addMetadataPermission(permission, commentId);
        } else {
            return getErrorResponse("Please provide a valid permission to apply.");
        }
    };

});