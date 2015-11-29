angular.module('AgaveToGo').controller('AppBuilderWizardController', function ($injector, $timeout, $rootScope, $scope, $state, $stateParams, $q, Commons, AppsController) {

    //var handleTitle = function(tab, navigation, index) {
    //    var total = navigation.find('li').length;
    //    var current = index + 1;
    //    // set wizard title
    //    $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
    //    // set done steps
    //    jQuery('li', $('#form_wizard_1')).removeClass("done");
    //    var li_list = navigation.find('li');
    //    for (var i = 0; i < index; i++) {
    //        jQuery(li_list[i]).addClass("done");
    //    }
    //
    //    if (current == 1) {
    //        $('#form_wizard_1').find('.button-previous').hide();
    //    } else {
    //        $('#form_wizard_1').find('.button-previous').show();
    //    }
    //
    //    if (current >= total) {
    //        $('#form_wizard_1').find('.button-next').hide();
    //        $('#form_wizard_1').find('.button-submit').show();
    //        displayConfirm();
    //    } else {
    //        $('#form_wizard_1').find('.button-next').show();
    //        $('#form_wizard_1').find('.button-submit').hide();
    //    }
    //    App.scrollTo($('.page-title'));
    //}
    //
    //// default form wizard
    //$('#form_wizard_1').bootstrapWizard({
    //    'nextSelector': '.button-next',
    //    'previousSelector': '.button-previous',
    //    onTabClick: function (tab, navigation, index, clickedIndex) {
    //        return false;
    //
    //        success.hide();
    //        error.hide();
    //        if (form.valid() == false) {
    //            return false;
    //        }
    //
    //        handleTitle(tab, navigation, clickedIndex);
    //    },
    //    onNext: function (tab, navigation, index) {
    //        success.hide();
    //        error.hide();
    //
    //        if (form.valid() == false) {
    //            return false;
    //        }
    //
    //        handleTitle(tab, navigation, index);
    //    },
    //    onPrevious: function (tab, navigation, index) {
    //        success.hide();
    //        error.hide();
    //
    //        handleTitle(tab, navigation, index);
    //    },
    //    onTabShow: function (tab, navigation, index) {
    //        var total = navigation.find('li').length;
    //        var current = index + 1;
    //        var $percent = (current / total) * 100;
    //        $('#form_wizard_1').find('.progress-bar').css({
    //            width: $percent + '%'
    //        });
    //    }
    //});
    //
    //$('#form_wizard_1').find('.button-previous').hide();
    //$('#form_wizard_1 .button-submit').click(function () {
    //    alert('Finished! Hope you like it :)');
    //}).hide();



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