'use strict';

angular.module('AgaveToGo').controller('TagsResourceEditController', ['$scope', '$state', '$stateParams', '$translate', 'ActionsService', 'MessageService', 'TagsController' , function($scope, $state, $stateParams, $translate, ActionsService, MessageService, TagsController) {

		if ($stateParams.id){
			$scope.requesting = true;

			TagsController.getTag($stateParams.id)
				.then(
					function(response){
						$scope.tag = response.result;
						$scope.requesting = false;

						$scope.model = {
							'name': response.result.name,
							'associationIds': response.result.associationIds
						};

						$scope.schema = {
						  'type': 'object',
						  'properties': {
						    'name': {
						      'type': 'string',
						      'description': 'A non-unique key you can use to reference and group your resources',
						      'title': 'Name'
						    },
						    'associationIds': {
						      'title': 'Association IDs',
						      'type': 'string',
						      'description': 'Enter UUIDs separated by commas to which the image(s) should be associated'
						    }
						  }
						};

						$scope.form = [
				      {
				        'key': 'name',
				        $validators: {
				          required: function(value) {
				            return value ? true : false;
				          }
				        },
				        validationMessage: {
				          'required': 'Missing required'
				        }
				      },
				      {
				        'key': 'associationIds',
				        'type': 'textarea',
				        'required': false
				      }
				    ];

					},
					function(response){
						MessageService.handle(response, $translate.instant('error_tags_add'));
						$scope.requesting = false;
					}
				);

		}

		$scope.delete = function(){
			ActionsService.confirmAction('tags', $scope.tag, 'delete');
		};

		$scope.update = function(){
			$scope.requesting = true;
			var body = {};
			body.name = $scope.model.name;

			try {
				if ($scope.model.associationIds){
					body.associationIds = $scope.model.associationIds.replace(/\s/g,'').split(',');
				}
			} catch(error){
				App.alert(
					{
						type: 'danger',
						message: $translate.instant('error_meta_image_add_parse')
					}
				);
			}

			TagsController.addTag(body)
				.then(
					function(response){
						App.alert({message: $translate.instant('success_tags_add') + response.result.id });
						$scope.requesting = false;
					},
					function(response){
						MessageService.handle(response, $translate.instant('error_tags_add'));
						$scope.requesting = false;
					}
				);
		};


	}]);
