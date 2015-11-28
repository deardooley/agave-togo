angular.module('AgaveToGo').controller('SystemWizardController', function ($injector, $timeout, $rootScope, $scope, $state, $stateParams, $q, Commons, SystemsController) {

    $scope.schema = {
        "type": "object",
        "title": "Comment",
        "properties": {
            "name":  {
                "title": "Name",
                "type": "string"
            },
            "email":  {
                "title": "Email",
                "type": "string",
                "pattern": "^\\S+@\\S+$",
                "description": "Email will be used for evil."
            },
            "comment": {
                "title": "Comment",
                "type": "string"
            }
        },
        "required": ["name","email","comment"]
    };

    $scope.form = [
        {
            key: 'name',
            placeholder: 'Anything but "Bob"',
            $asyncValidators: {
                'async': function(name) {
                    var deferred = $q.defer();
                    $timeout(function(){
                        if (angular.isString(name) && name.toLowerCase().indexOf('bob') !== -1) {
                            deferred.reject();
                        } else {
                            deferred.resolve();
                        }
                    }, 500);
                    return deferred.promise;
                }
            },
            validationMessage: {
                'async': "Wooohoo thats not an OK name!"
            }

        },
        {
            key: 'email',
            placeholder: 'Not MY email',
            ngModel: function(ngModel) {
                ngModel.$validators.myMail = function(value) {
                    return value !== 'david.lgj@gmail.com';
                };
            },
            validationMessage: {
                'myMail': "Thats my mail!"
            }
        },
        {
            "key": "comment",
            "type": "textarea",
            "placeholder": "Make a comment, write 'damn' and check the model",
            $parsers: [
                function(value) {
                    if (value && value.replace) {
                        return value.replace(/(damn|fuck|apple)/,'#!@%&');
                    }
                    return value;
                }
            ]
        },
        {
            "type": "submit",
            "style": "btn-info",
            "title": "OK"
        }
    ];

    $scope.model = {};

    $scope.$watch('model', function(value){
        if (value) {
            $scope.prettyModel = JSON.stringify(value, undefined, 2);
        }
    }, true);

});