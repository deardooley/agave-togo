'use strict';

angular.module('AgaveToGo').controller('TagsResourceAddController', ['$scope', '$state', '$stateParams', '$translate', 'ActionsService', 'MessageService', 'TagsController' , function($scope, $state, $stateParams, $translate, ActionsService, MessageService, TagsController) {
		$scope.model = {};

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

		$scope.delete = function(){
			ActionsService.confirmAction('tags', $scope.tag, 'delete');
		};

		$scope.submit = function(){
			$scope.requesting = true;
			var body = {};
			body.name = $scope.model.name;

			try {
				if ($scope.model.associationIds){
					body.associationIds = $scope.model.associationIds.replace(/\s/g,'').split(',');
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
				}
			} catch(error){
				App.alert(
					{
						type: 'danger',
						message: $translate.instant('error_meta_image_add_parse')
					}
				);
			}
		};


	}]);
