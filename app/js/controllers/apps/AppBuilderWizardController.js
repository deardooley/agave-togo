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

    $scope.schema = {
        "type": "object",
        "title": "Comment",
        "properties": {
            "name": {
                "type" : "string",
                    "description": "The name of your application",
                    "required": true,
                    "maxLength": 32,
                    "title": "Name",
                    "default": "whizbang"
            },
                "version": {
                "type" : "string",
                    "description": "Version in #.#.# format. The name-version must be globally unique.",
                    "required": true,
                    "pattern": "",
                    "title": "Version",
                    "default": "1.0"
            },
                "helpURI": {
                "type": "string",
                    "description": "Any valid url",
                    "format": "url",
                    "title": "Help URL"
            },
                "label": {
                "type" : "string",
                    "description": "Label for use in forms generated by the jobs service",
                    "required": true,
                    "title": "Label"
            },
                "shortDescription": {
                "type" : "string",
                    "description": "Short description of this app",
                    "maxLength": 128,
                    "title": "Short description"
            },
                "longDescription": {
                "type" : "string",
                    "description": "Full description of this app",
                    "maxLength": 32768,
                    "title": "Long description"
            },
                "defaultQueue": {
                "type" : "string",
                    "description": "Default queue to use when submitting this job if none is provided in the job request. Can be left blank and a queue will be determined at run time.",
                    "maxLength": 128,
                    "title": "Default queue",
                    "enum": ["normal"],
                    "default": "normal"
            },
                "defaultNodeCount": {
                "type" : "integer",
                    "description": "Default number of nodes to be used when running this app if no node count is given in the job request",
                    "maxLength": 12,
                    "title": "Default node count",
                    "default": 1
            },
                "defaultMemoryPerNode": {
                "type" : "integer",
                    "description": "Default memory in GB to be used when running this app if no memory is given in the job request",
                    "maxLength": 9,
                    "title": "Default memory (GB)",
                    "default": 4
            },
                "defaultProcessorsPerNode": {
                "type" : "integer",
                    "description": "Default number of processors per node to be used when running this app if no processor count is given in the job request",
                    "maxLength": 12,
                    "title": "Default processor count",
                    "default": 1
            },
                "defaultRequestedTime": {
                "type" : "string",
                    "description": "Default max run time to be used when running this app if no requested run time is given in the job request",
                    "maxLength": 10,
                    "title": "Default run time",
                    "default": "24:00:00"
            },
                "ontology": {
                "type" : "array",
                    "description": "Array of ontology terms describing this app.",
                    "items": {
                    "type": "string"
                },
                "title": "Ontology"
            },
                "executionSystem": {
                "type" : "string",
                    "description": "The unique system id where this app will run",
                    "required": true,
                    "enum": ["stampede.tacc.utexas.edu"],
                    "title": "Execution system",
                    "default": "stampede.tacc.utexas.edu"
            },
                "executionType": {
                "type" : "string",
                    "description": "The execution mechanism needed to run this application.",
                    "enum": [ "HPC", "CONDOR", "CLI" ],
                    "title": "Execution type",
                    "default": "HPC"
            },
                "parallelism":  {
                "type" : "string",
                    "description": "The execution mechanism needed to run this application.",
                    "enum": [ "SERIAL", "PARALLEL" ],
                    "title": "Parallelism",
                    "default": "SERIAL"
            },
                "deploymentPath": {
                "type" : "string",
                    "description": "The path to the folder with the application assets on the deployment system.",
                    "title": "Deployment path"
            },
                "deploymentSystem": {
                "type" : "system",
                    "description": "The unique system id where this application's assets are stored.",
                    "required": true,
                    "enum": [ "data.iplantcollaborative.org" ],
                    "title": "Deployment system",
                    "default": "data.iplantcollaborative.org"
            },
                "templatePath": {
                "type" : "string",
                    "description": "Path of the application wrapper script relative to the deployment path.",
                    "title": "Wrapper script"
            },
                "testPath": {
                "type" : "string",
                    "description": "Path of the application test script relative to the deployment path.",
                    "title": "Test script"
            },
                "checkpointable": {
                "type" : "boolean",
                    "description": "Does this app support checkpointing?",
                    "title": "Checkpointable",
                    "default": false
            },
                "tags": {
                "type" : "array",
                    "description": "Array of text values used to search and group apps",
                    "items": {
                    "type": "string"
                } ,
                "title": "Tags"
            },
                "modules":  {
                "type" : "array",
                    "description": "Which modules are needed to run this app. If you don't know, leave it empty.",
                    "items": {
                    "type": "string"
                },
                "title": "Modules"
            },
            "inputs": {
                "type" : "array",
                    "items": {
                    "type": "object",
                        "properties": {
                        "id" : {
                            "type": "string",
                                "description": "The unique identifier for this input file. This will be referenced in the wrapper script.",
                                "required": true,
                                "title": "Id",
                                "valueInLegend": true
                        },
                        "details" : {
                            "type": "object",
                                "description": "Descriptive details about this app input file used in form generation.",
                                "title": "Details",
                                "properties": {
                                "label" : {
                                    "type": "string",
                                        "description": "The label displayed for this input file.",
                                        "title": "Label"
                                },
                                "description" : {
                                    "type": "string",
                                        "description": "Verbose info on what this input file does.",
                                        "title": "Description"
                                },
                                "attribute" : {
                                    "type": "string",
                                        "description": "Name of the command line flag or argument (including dashes) for this input file.",
                                        "title": "Command line argument",
                                        "default": ""
                                },
                                "showAttribute": {
                                    "type" : "boolean",
                                        "description": "Should this command line argument be injected into the submit script preceding the input file value?",
                                        "title": "Add command line argument?",
                                        "default": false
                                }
                            }
                        },
                        "semantics" : {
                            "type": "object",
                                "description": "Semantic information about the input field.",
                                "title": "Semantics",
                                "properties": {
                                "minCardinality": {
                                    "type" : "integer",
                                        "description": "Minimum number of instances of this file per job.",
                                        "title": "Minimum cardinality",
                                        "default": 1,
                                        "required": true
                                },
                                "ontology": {
                                    "type" : "array",
                                        "description": "Array of ontology terms describing this app.",
                                        "items": {
                                        "type": "string"
                                    },
                                    "title": "Ontology"
                                },
                                "fileTypes": {
                                    "type" : "array",
                                        "description": "Array of file types required for this input.",
                                        "items": {
                                        "type": "string"
                                    },
                                    "title": "File types"
                                }
                            }
                        },
                        "value" : {
                            "type": "object",
                                "description": "Default value and validations for the input field.",
                                "title": "Value",
                                "properties": {
                                "default": {
                                    "type" : "string",
                                        "description": "The default value to use for this input.",
                                        "title": "Default value"
                                },
                                "validator": {
                                    "type" : "string",
                                        "description": "Regex to use on the input file name to validate it.",
                                        "title": "Validator"
                                },
                                "required": {
                                    "type" : "boolean",
                                        "description": "Is this field required when jobs are submitted.",
                                        "title": "Required",
                                        "default": 1,
                                        "required": true
                                },
                                "visible": {
                                    "type" : "boolean",
                                        "description": "Should this value be included in form generation.",
                                        "title": "Visible",
                                        "default": true,
                                        "required": true
                                },
                                "order": {
                                    "type" : "integer",
                                        "description": "The order this parameter should appear when generating a command line. Defaults to 0. Ignore if your wrapper script builds your cli for you.",
                                        "title": "Order",
                                        "default": 0
                                },

                            }
                        }
                    }
                }
            },
            "parameters": {
                "type" : "array",
                    "description": "Non-file inputs supported by this application.",
                    "items": {
                    "type": "object",
                        "title": "Parameter",
                        "properties": {
                        "id" : {
                            "type": "string",
                                "description": "The unique identifier for this parameter. This will be referenced in the wrapper script.",
                                "required": true,
                                "title": "Id"
                        },
                        "details" : {
                            "type": "object",
                                "description": "Descriptive details about this app parameter used in form generation.",
                                "title": "Details",
                                "properties": {
                                "label" : {
                                    "type": "string",
                                        "description": "The label displayed for this parameter .",
                                        "title": "Label"
                                },
                                "description" : {
                                    "type": "string",
                                        "description": "Verbose information on what this parameter does.",
                                        "title": "Description"
                                },
                                "attribute" : {
                                    "type": "string",
                                        "description": "Name of the command line flag or argument (including dashes) for this input file.",
                                        "title": "Command line argument",
                                        "default": ""
                                },
                                "showAttribute": {
                                    "type" : "boolean",
                                        "description": "Should this command line argument be injected into the submit script preceding the input file value?",
                                        "title": "Add command line argument?",
                                        "default": false
                                }
                            }
                        },
                        "semantics" : {
                            "type": "object",
                                "description": "Semantic information about the input field.",
                                "title": "Semantics",
                                "properties": {
                                "ontology": {
                                    "type" : "array",
                                        "description": "Array of ontology terms describing this app.",
                                        "items": {
                                        "type": "string"
                                    },
                                    "title": "Ontology"
                                }
                            }
                        },
                        "value" : {
                            "type": "object",
                                "description": "Default value and validations for the input field.",
                                "title": "Value",
                                "properties": {
                                "default": {
                                    "type" : "string",
                                        "description": "The default value to use for this input.",
                                        "title": "Default value"
                                },
                                "type": {
                                    "type" : "string",
                                        "description": "The content type of the parameter.",
                                        "enum": [ "number", "string", "boolean", "enumeration", "flag" ],
                                        "title": "Content type",
                                        "default": "string"
                                },
                                "validator": {
                                    "type" : "string",
                                        "description": "Regex to use on the input file name to validate it.",
                                        "title": "Validator regex"
                                },
                                "enum_values": {
                                    "type" : "array",
                                        "description": "Regex to use on the input file name to validate it.",
                                        "title": "Enumerated values",
                                        "items": {
                                        "type": "string"
                                    }

                                },
                                "required": {
                                    "type" : "boolean",
                                        "description": "Is this field required when jobs are submitted.",
                                        "title": "Required",
                                        "default": 1,
                                        "required": true
                                },
                                "visible": {
                                    "type" : "boolean",
                                        "description": "Should this value be included in form generation.",
                                        "title": "Visible",
                                        "default": true,
                                        "required": true
                                },
                                "order": {
                                    "type" : "integer",
                                        "description": "The order this parameter should appear when generating a command line. Defaults to 0. Ignore if your wrapper script builds your cli for you.",
                                        "title": "Order",
                                        "default": 0
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    $scope.form = [
        {
            "type": "wizard",
            "legend": "General Info",
            "tabs": [
                {
                    "title": "Details",
                    "items": [
                        "name",
                        "version",
                        "label",
                        "helpURI",
                        "shortDescription",
                        "longDescription",
                        "tags",
                        "ontology"
                    ]
                },
                {
                    "title": "Code",
                    "items": [
                        "deploymentPath",
                        "deploymentSystem",
                        "templatePath",
                        "testPath",
                        "modules"
                    ]
                },
                {
                    "title": "Runtime",
                    "items": [
                        "executionType",
                        "executionSystem",
                        "defaultQueue",
                        "defaultNodeCount",
                        "defaultMemoryPerNode",
                        "defaultProcessorsPerNode",
                        "defaultRequestedTime",
                        "parallelism",
                        "checkpointable"
                    ]
                },
                {
                    "title": "Input Data",
                    "items": [
                        {
                            "type": "tabarray",
                            "items": [
                                {
                                    "key": "inputs[]",
                                    "legend": "Input {{idx}}"
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "Input Parameters",
                    "items": [
                        {
                            "type": "tabarray",
                            "items": [
                                {
                                    "key": "parameters[]",
                                    "legend": "Parameter: {{idx}}"
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "Output Data",
                    "items": [
                        {
                            "type": "tabarray",
                            "items": [
                                {
                                    "key": "outputs[]",
                                    "legend": "Parameter: {{idx}}"
                                }
                            ]
                        }
                    ]
                }

            ]
        },

    ]
        ;
    //,
    //    onSubmitValid: function (values) {
    //    if (errors) {
    //        alert('Check the form for invalid values!');
    //        return;
    //    } else {
    //        alert(values);
    //    }
    //
    //    editor.setValue(values);
    //    // "values" follows the schema, yeepee!
    //    console.log(values);
    //};

    $scope.model = {};

    $scope.$watch('model', function(value){
        if (value) {
            $scope.prettyModel = JSON.stringify(value, undefined, 2);
        }
    }, true);

});