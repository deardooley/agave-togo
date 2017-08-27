'use strict';

angular.module('AgaveToGo').controller('NotificationsResourceAddController', function($scope, $state, $stateParams, $translate, ActionsService, MessageService, NotificationsController, UUIDsController, RequestBin) {
		$scope.model = {};
		$scope.defaultCallbackUrl = '';

		// $scope.isValidUuid = false;
		if ($stateParams.associatedUuid){
			$scope.model.associatedUuid = $stateParams.associatedUuid;
		}
		if ($stateParams.resourceType){
			$scope.model.resource = $stateParams.resourceType;
		}
		// lookup the type of the resource to get the available events
		// if not provided in the state
		else if ($stateParams.associatedUuid) {
			UUIDsController.getUUID($stateParams.associatedUuid).then(
					function(data) {
						$scope.isValidUuid = true;
						$scope.model.resource = data.result.type;
					},
					function(err) {
						$scope.isValidUuid = false;
						console.log("Failed to obtain resource type for " + $stateParams.associatedUuid);
					}
			);
		}

		$scope.schema = {
			'type': 'object',
			'properties': {
					'associatedUuid': {
							'type': 'string',
							'description': 'The associated resource uuid',
							'title': 'Associated UUID'
					},
					'resource': {
						'type': 'string',
						'description': 'The notification resource type',
						'enum': [
								'app', 'file', 'job', 'metadata', 'monitor', 'schema', 'system', 'postit', 'notification', 'profile', 'tag'
						],
						'title': 'Resource type'
					},
					'persistent': {
						'type': 'string',
						'description': 'Specifies whether the notification should remain active. If set to false, the notification will be removed after it is fired',
						'enum': [
								'true', 'false'
						],
						'title': 'Persistent',
						'default': 'false'
					},
					'url': {
						'type': 'string',
						'description': 'Where Agave should send the notification. Email addresses, Slack incoming webhook URL, standard webhook URLs, and agave URI are supported. When providing a webhook URL, a POST request will be sent with the resource json representation in the body. You may customize the URL using template variables appropriate for the resource and event to which you are subscribing.',
						'format': 'url',
						'title': 'URL',
						'default': ''
					},
					'policy': {
						'title': 'Retry Policy',
						type: 'object',
						properties: {
							'retryStrategy': {
								'type': 'string',
								'description': 'The retry strategy to employ.',
								'enum': [
									'NONE', 'IMMEDIATE', 'DELAYED', 'EXPONENTIAL'
								],
								'title': 'Retry strategy',
								'default': 'NONE'
							},
							'retryRate': {
								'type': 'integer',
								'description': 'The frequency with which attempts should be made to deliver the message.',
								'title': 'Retry rate',
								'minimum': 0,
								'maximum': 86400,
								'default': 5
							},
							'retryLimit': {
								'type': 'integer',
								'description': 'The maximum attempts that should be made to delivery the message.',
								'title': 'Retry limit',
								'minimum': 0,
								'maximum': 14400,
								'default': 20
							},
							'retryDelay': {
								'type': 'integer',
								'description': 'The initial delay between the initial delivery attempt and the first retry. This does not apply for the EXPONENTIAL retry strategy',
								'title': 'Retry delay',
								'minimum': 0,
								'maximum': 86400,
								'default': 0
							},
							'saveOnFailure': {
								'type': 'string',
								'description': 'Whether the failed message should be persisted if unable to be delivered within the retryLimit',
								'title': 'Save on failure',
								'enum': [
									'true', 'false'
								],
								'default': 'false'
							},
						}
					}
			},
			"required":[
				"associatedUuid",
				"event",
				"url",
				"description"
			]
		};
		$scope.form = [
			{
				'key': 'associatedUuid',
				onChange: function(modelValue,form) {
					if (modelValue) {
						UUIDsController.getUUID(modelValue).then(
								function (data) {
									$scope.isValidUuid = true;
									$scope.model.resource = data.result.type;
									if (! $scope.model.url) {
										RequestBin.getOrCreate(modelValue).then(function(data) {
											$scope.model.url = RequestBin.baseUrl + data.name + '?event=${EVENT}&uuid=${UUID}';
										});
									}
								},
								function (err) {
									$scope.isValidUuid = false;
									$scope.model.resource = '';
									$scope.model.event = '';
									console.log("Failed to validate uuid " + modelValue + ". " + err);
								}
						);
					}
					else {
						$scope.isValidUuid = false;
						$scope.model.resource = '';
						$scope.model.event = '';
					}
				},
				ngModelOptions: {
					updateOnDefault: true
				}
			},
			{
				'key': 'resource',
				'condition': 'false',
				ngModelOptions: {
					updateOnDefault: true
				}
			},
			{
				'key': 'event',
				'condition': 'model.resource === "app"',
				'type': 'select',
				'description': 'The events to which you want to be notified',
				'titleMap': [
						{'value': '*', 'name': 'ALL'},
						{'value': 'UPDATED', 'name': 'UPDATED'},
						{'value': 'DELETED', 'name': 'DELETED'},
						{'value': 'PUBLISHED', 'name': 'PUBLISHED'},
						{'value': 'CLONED', 'name': 'CLONED'},
						{'value': 'PERMISSION_GRANT', 'name': 'PERMISSION_GRANT'},
						{'value': 'PERMISSION_REVOKE', 'name': 'PERMISSION_REVOKE'},
						{'value': 'RESTORED', 'name': 'RESTORED'},
						{'value': 'UNPUBLISHED', 'name': 'UNPUBLISHED'},
						{'value': 'PUBLISHING_FAILED', 'name': 'PUBLISHING_FAILED'},
						{'value': 'DISABLED', 'name': 'DISABLED'},
						{'value': 'CLONING_FAILED', 'name': 'CLONING_FAILED'},
						{'value': 'REGISTERED', 'name': 'REGISTERED'}
				],
				'title': 'Events',
				ngModelOptions: {
					updateOnDefault: true
				}
			},
			{
				'key': 'event',
				'condition': 'model.resource === "file"',
				'type': 'select',
				'description': 'The events to which you want to be notified',
				'titleMap': [
						{'value': '*', 'name': 'ALL'},
						{'value': 'CREATED', 'name': 'CREATED'},
						{'value': 'DELETED', 'name': 'DELETED'},
						{'value': 'RENAME', 'name': 'RENAME'},
						{'value': 'MOVED', 'name': 'MOVED'},
						{'value': 'OVERWRITTEN', 'name': 'OVERWRITTEN'},
						{'value': 'PERMISSION_GRANT', 'name': 'PERMISSION_GRANT'},
						{'value': 'PERMISSION_REVOKE', 'name': 'PERMISSION_REVOKE'},
						{'value': 'STAGING_QUEUED', 'name': 'STAGING_QUEUED'},
						{'value': 'STAGING','name': 'STAGING'},
						{'value': 'STAGING_FAILED', 'name': 'STAGING_FAILED'},
						{'value': 'STAGING_COMPLETED', 'name': 'STAGING_COMPLETED'},
						{'value': 'PREPROCESSING', 'name': 'PREPROCESSING'},
						{'value': 'TRANSFORMING_QUEUED', 'name': 'TRANSFORMING_QUEUED'},
						{'value': 'TRANSFORMING', 'name': 'TRANSFORMING'},
						{'value': 'TRANSFORMING_FAILED', 'name': 'TRANSFORMING_FAILED'},
						{'value': 'TRANSFORMING_COMPLETED', 'name': 'TRANSFORMING_COMPLETED'},
						{'value': 'UPLOADED', 'name': 'UPLOADED'},
						{'value': 'CONTENT_CHANGED', 'name': 'CONTENT_CHANGED'}
				],
				'title': 'Events',
				ngModelOptions: {
					updateOnDefault: true
				}
			},
			{
				'key': 'event',
				'condition': 'model.resource === "job"',
				'type': 'select',
				'description': 'The events to which you want to be notified',
				'titleMap': [
						{'value': '*', 'name': 'ALL'},
						{'value': 'CREATED', 'name': 'CREATED'},
						{'value': 'UPDATED', 'name': 'UPDATED'},
						{'value': 'DELETED', 'name': 'DELETED'},
						{'value': 'PERMISSION_GRANT', 'name': 'PERMISSION_GRANT'},
						{'value': 'PERMISSION_REVOKE', 'name': 'PERMISSION_REVOKE'},
						{'value': 'PENDING', 'name': 'PENDING'},
						{'value': 'STAGING_INPUTS', 'name': 'STAGING_INPUTS'},
						{'value': 'CLEANING_UP', 'name': 'CLEANING_UP'},
						{'value': 'ARCHIVING', 'name': 'ARCHIVING'},
						{'value': 'STAGING_JOB', 'name': 'STAGING_JOB'},
						{'value': 'FINISHED', 'name': 'FINISHED'},
						{'value': 'KILLED', 'name': 'KILLED'},
						{'value': 'FAILED', 'name': 'FAILED'},
						{'value': 'STOPPED', 'name': 'STOPPED'},
						{'value': 'RUNNING', 'name': 'RUNNING'},
						{'value': 'PAUSED', 'name': 'PAUSED'},
						{'value': 'QUEUED', 'name': 'QUEUED'},
						{'value': 'SUBMITTING', 'name': 'SUBMITTING'},
						{'value': 'STAGED', 'name': 'STAGED'},
						{'value': 'PROCESSING_INPUTS', 'name': 'PROCESSING_INPUTS'},
						{'value': 'ARCHIVING_FINISHED', 'name': 'ARCHIVING_FINISHED'},
						{'value': 'ARCHIVING_FAILED', 'name': 'ARCHIVING_FAILED'},
						{'value': 'HEARTBEAT', 'name': 'HEARTBEAT'}
				],
				'title': 'Events',
				ngModelOptions: {
					updateOnDefault: true
				}
			},
			{
				'key': 'event',
				'condition': 'model.resource === "metadata"',
				'type': 'select',
				'description': 'The events to which you want to be notified',
				'titleMap': [
						{'value': '*', 'name': 'ALL'},
						{'value': 'CREATED', 'name': 'CREATED'},
						{'value': 'UPDATED', 'name': 'UPDATED'},
						{'value': 'DELETED', 'name': 'DELETED'},
						{'value': 'PERMISSION_GRANT', 'name': 'PERMISSION_GRANT'},
						{'value': 'PERMISSION_REVOKE', 'name': 'PERMISSION_REVOKE'},
				],
				'title': 'Events',
				ngModelOptions: {
					updateOnDefault: true
				}
			},
			{
				'key': 'event',
				'condition': 'model.resource === "monitor"',
				'type': 'select',
				'description': 'The events to which you want to be notified',
				'titleMap': [
						{'value': '*', 'name': 'ALL'},
						{'value': 'CREATED', 'name': 'CREATED'},
						{'value': 'CANCELLED', 'name': 'CANCELLED'},
						{'value': 'ACTIVATED', 'name': 'ACTIVATED'},
						{'value': 'DEACTIVATED', 'name': 'DEACTIVATED'},
						{'value': 'RESULT_CHANGE', 'name': 'RESULT_CHANGE'},
						{'value': 'STATUS_CHANGE', 'name': 'STATUS_CHANGE'},
						{'value': 'PASSED', 'name': 'PASSED'},
						{'value': 'FAILED', 'name': 'FAILED'},
						{'value': 'UNKNOWN', 'name': 'UNKNOWN'}
				],
				'title': 'Events',
				ngModelOptions: {
					updateOnDefault: true
				}
			},
			{
				'key': 'event',
				'condition': 'model.resource === "notification"',
				'type': 'select',
				'description': 'The events to which you want to be notified',
				'titleMap': [
					{'value': '*', 'name': 'ALL'},
					{'value': 'CREATED', 'name': 'CREATED'},
					{'value': 'DELETED', 'name': 'DELETED'},
					{'value': 'UPDATED', 'name': 'UPDATED'},
					{'value': 'PERMISSION_GRANT', 'name': 'PERMISSION_GRANT'},
					{'value': 'PERMISSION_REVOKE', 'name': 'PERMISSION_REVOKE'},
					{'value': 'DISABLED', 'name': 'DISABLED'},
					{'value': 'ENABLED', 'name': 'ENABLED'},
					{'value': 'SEND_ERROR', 'name': 'SEND_ERROR'},
					{'value': 'RETRY_ERROR', 'name': 'RETRY_ERROR'},
					{'value': 'FORCED_ATTEMPT', 'name': 'FORCED_ATTEMPT'}
				],
				'title': 'Events',
				ngModelOptions: {
					updateOnDefault: true
				}
			},
			{
				'key': 'event',
				'condition': 'model.resource === "schema"',
				'type': 'select',
				'description': 'The events to which you want to be notified',
				'titleMap': [
						{'value': '*', 'name': 'ALL'},
						{'value': 'CREATED', 'name': 'CREATED'},
						{'value': 'UPDATED', 'name': 'UPDATED'},
						{'value': 'DELETED', 'name': 'DELETED'},
						{'value': 'PERMISSION_GRANT', 'name': 'PERMISSION_GRANT'},
						{'value': 'PERMISSION_REVOKE', 'name': 'PERMISSION_REVOKE'}
				],
				'title': 'Events',
				ngModelOptions: {
					updateOnDefault: true
				}
			},
			{
				'key': 'event',
				'condition': 'model.resource === "system"',
				'type': 'select',
				'description': 'The events to which you want to be notified',
				'titleMap': [
						{'value': '*', 'name': 'ALL'},
						{'value': 'CREATED', 'name': 'CREATED'},
						{'value': 'UPDATED', 'name': 'UPDATED'},
						{'value': 'DELETED', 'name': 'DELETED'},
						{'value': 'ROLES_GRANT', 'name': 'ROLES_GRANT'},
						{'value': 'ROLES_REVOKE', 'name': 'ROLES_REVOKE'},
						{'value': 'STATUS_CHANGE', 'name': 'STATUS_CHANGE'}
				],
				'title': 'Events',
				ngModelOptions: {
					updateOnDefault: true
				}
			},
			{
				'key': 'event',
				'condition': 'model.resource === "postit"',
				'type': 'select',
				'description': 'The events to which you want to be notified',
				'titleMap': [
						{'value': '*', 'name': 'ALL'},
						{'value': 'CREATED', 'name': 'CREATED'},
						{'value': 'UPDATED', 'name': 'UPDATED'},
						{'value': 'REFRESHED', 'name': 'REFRESHED'},
						{'value': 'DELETED', 'name': 'DELETED'},
						{'value': 'REDEEMED', 'name': 'REDEEMED'}
				],
				'title': 'Events',
				ngModelOptions: {
					updateOnDefault: true
				},
			},
			{
					'key': 'event',
					'condition': 'model.resource === "profile"',
					'type': 'select',
					'description': 'The events to which you want to be notified',
					'titleMap': [
							{'value': '*', 'name': 'ALL'},
							{'value': 'CREATED', 'name': 'CREATED'},
							{'value': 'DELETED', 'name': 'DELETED'},
							{'value': 'UPDATED', 'name': 'UPDATED'}
					],
					'title': 'Events',
					ngModelOptions: {
						updateOnDefault: true
					}
			},
			{
				'key': 'event',
				'condition': 'model.resource === "tag"',
				'type': 'select',
				'description': 'The events to which you want to be notified',
				'titleMap': [
					{'value': '*', 'name': 'ALL'},
					{'value': 'CREATED', 'name': 'CREATED'},
					{'value': 'DELETED', 'name': 'DELETED'},
					{'value': 'UPDATED', 'name': 'UPDATED'},
					{'value': 'PERMISSION_GRANT', 'name': 'PERMISSION_GRANT'},
					{'value': 'PERMISSION_REVOKE', 'name': 'PERMISSION_REVOKE'},
					{'value': 'RESOURCE_ADDED', 'name': 'RESOURCE_ADDED'},
					{'value': 'RESOURCE_REMOVED', 'name': 'RESOURCE_REMOVED'},
					{'value': 'PUBLISHED', 'name': 'PUBLISHED'},
					{'value': 'UNPUBLISHED', 'name': 'UNPUBLISHED'}
				],
				'title': 'Events',
				ngModelOptions: {
					updateOnDefault: true
				}
			},
			'persistent',
			'url',
			{
				"key": "policy",
				"items": [
						{
							'key': 'policy.retryStrategy',
							onChange: function(modelValue, form) {
								if (modelValue == 'NONE' || modelValue == 'IMMEDIATE') {
									$scope.model.policy.retryDelay = 0;
								}
								else if (modelValue == 'EXPONENTIAL') {
									$scope.model.policy.retryDelay = 0;
									$scope.model.policy.retryRate = 0;
								}
							}
						},
						{
							'key': 'policy.retryRate',
							'condition': 'model.policy.retryStrategy == "DELAYED"  || model.policy.retryStrategy == "IMMEDIATE"'
						},
						{
							'key': 'policy.retryLimit',
							'condition': 'model.policy.retryStrategy !== "NONE"'
						},
						{
							'key': 'policy.retryDelay',
							'condition': 'model.policy.retryStrategy == "DELAYED"'
						},
						{
							'key': 'policy.saveOnFailure',
							'condition': 'model.policy.retryStrategy !== "NONE"'
						}
				]
			}

			// {
			//
			// 	type: "conditional",
			// 	condition: "model.retryPolicy",
			// 	items: [
			// 			'policy'
			// 			// 'retryStrategy',
			// 			// 'retryRate',
			// 			// 'retryLimit',
			// 			// {
			// 			// 	'key': 'retryDelay',
			// 			// 	'condition': 'model.policy.retryStrategy !== "EXPONENTIAL"'
			// 			// },
			// 			// 'saveOnFailure'
			// 	]
			// }

		];

		$scope.delete = function(){
			ActionsService.confirmAction('notifications', $scope.notification, 'delete');
		};

		$scope.submit = function() {
			$scope.requesting = true;
			var body = {};
			body.associatedUuid = $scope.model.associatedUuid;
			body.event = $scope.model.event;
			body.url = $scope.model.url;
			body.persistent = $scope.model.persistent;
			if ($scope.model.policy.retryStrategy && $scope.model.policy.retryStrategy != 'NONE') {
				body.policy = $scope.model.policy;
			}
			// {
			// 			"retryStrategy": $scope.model.retryStrategy,
			// 			"retryLimit": $scope.model.retryLimit,
			// 			"retryRate": $scope.model.retryRate,
			// 			"retryDelay": $scope.model.retryDelay,
			// 			"saveOnFailure": $scope.model.saveOnFailure
			// 		};
			// }


			NotificationsController.addNotification(body)
				.then(
					function(response){
						$scope.notificationId = response.result.id;
						App.alert({message: $translate.instant('success_notifications_add') + $scope.notificationId });
						$scope.requesting = false;
					},
					function(response){
						MessageService.handle(response, $translate.instant('error_notifications_add'));
						$scope.requesting = false;
					}
				);
		};

		$scope.test = function(){
			var body = {'foo': 'bar'};

			NotificationsController.fireNotification(body, $scope.notificationId)
				.then(
					function(){
						App.alert({message: $translate.instant('success_notifications_test') + $scope.notificationId});
					},
					function(response){
						MessageService.handle(response, $translate.instant('error_notifications_test'));
					}
				);
		}


	});
