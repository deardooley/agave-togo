angular.module('AgaveToGo').controller('AppBuilderWizardController', function ($injector, $timeout, $rootScope, $scope, $state, $stateParams, $q, Commons, AppsController, WizardHandler, SystemsController, Tags, FilesController) {

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


    //$scope.schema = {
    //    "type": "object",
    //    "title": "Comment",
    //    "properties": {
    //        "name": {
    //            "title": "Name",
    //            "type": "string"
    //        },
    //        "email": {
    //            "title": "Email",
    //            "type": "string",
    //            "pattern": "^\\S+@\\S+$",
    //            "description": "Email will be used for evil."
    //        },
    //        "comment": {
    //            "title": "Comment",
    //            "type": "string"
    //        }
    //    },
    //    "required": ["name", "email", "comment"]
    //};
    //
    //$scope.form = [
    //    {
    //        key: 'name',
    //        placeholder: 'Anything but "Bob"',
    //        $asyncValidators: {
    //            'async': function (name) {
    //                var deferred = $q.defer();
    //                $timeout(function () {
    //                    if (angular.isString(name) && name.toLowerCase().indexOf('bob') !== -1) {
    //                        deferred.reject();
    //                    } else {
    //                        deferred.resolve();
    //                    }
    //                }, 500);
    //                return deferred.promise;
    //            }
    //        },
    //        validationMessage: {
    //            'async': "Wooohoo thats not an OK name!"
    //        }
    //
    //    },
    //    {
    //        key: 'email',
    //        placeholder: 'Not MY email',
    //        ngModel: function (ngModel) {
    //            ngModel.$validators.myMail = function (value) {
    //                return value !== 'david.lgj@gmail.com';
    //            };
    //        },
    //        validationMessage: {
    //            'myMail': "Thats my mail!"
    //        }
    //    },
    //    {
    //        "key": "comment",
    //        "type": "textarea",
    //        "placeholder": "Make a comment, write 'damn' and check the model",
    //        $parsers: [
    //            function (value) {
    //                if (value && value.replace) {
    //                    return value.replace(/(damn|fuck|apple)/, '#!@%&');
    //                }
    //                return value;
    //            }
    //        ]
    //    },
    //    {
    //        "type": "submit",
    //        "style": "btn-info",
    //        "title": "OK"
    //    }
    //];

    $scope.schema = {
        "type": "object",
        "title": "Interactive app registration form for the Agave platform.",
        "properties": {
            "name": {
                "type": "string",
                "description": "The name of the application. The name does not have to be unique, but the combination of name and version does.",
                "title": "Name",
                "validator": "[a-zA-Z_\\-\\.]+",
                "minLength": 3,
                "maxLength": 64
            },
            "version": {
                "type": "string",
                "description": "The version of the application in #.#.# format. While the version does not need to be unique, the combination of name and version does have to be unique.",
                "title": "Version",
                "validator": "\\d+(\\.\\d+)+",
                "minLength": 3,
                "maxLength": 16
            },
            "helpURI": {
                "type": "string",
                "description": "The URL where users can go for more information about the app.",
                "format": "url",
                "title": "Help URL",
                "validator": "(http|https)://[\\w-]+(\\.[\\w-]*)+([\\w.,@?^=%&amp;:/~+#-]*[\\w@?^=%&amp;/~+#-])?"
            },
            "label": {
                "type": "string",
                "description": "Label for use in forms generated by the jobs service",
                "title": "Label"
            },
            "icon": {
                "type": "string",
                "description": "The icon url to associate with this app.",
                "title": "Icon",
                "validator": "(http|https)://[\\w-]+(\\.[\\w-]*)+([\\w.,@?^=%&amp;:/~+#-]*[\\w@?^=%&amp;/~+#-])?"
            },
            "shortDescription": {
                "type": "string",
                "description": "Short description of this app",
                "maxLength": 128,
                "title": "Short description"
            },
            "longDescription": {
                "type": "string",
                "description": "Full description of this app",
                "maxLength": 32768,
                "title": "Long description"
            },
            "defaultQueue": {
                "type": "string",
                "description": "Default queue to use when submitting this job if none is provided in the job request. Can be left blank and a queue will be determined at run time.",
                "maxLength": 128,
                "format": 'uiselect',
                "title": "Default queue",
                "items": ["normal"]
            },
            "defaultNodeCount": {
                "type": "integer",
                "description": "Default number of nodes to be used when running this app if no node count is given in the job request",
                "maxLength": 12,
                "minimum": 0,
                "exclusiveMinimum": true,
                "title": "Default node count",
                "x-schema-form": {
                    "type": "number",
                    "placeholder": 1
                }
            },
            "defaultMemoryPerNode": {
                "type": "number",
                "description": "Default memory in GB to be used when running this app if no memory is given in the job request",
                "maxLength": 9,
                "minimum": 0,
                "exclusiveMinimum": true,
                "title": "Default memory (GB)",
                "x-schema-form": {
                    "type": "number",
                    "placeholder": 4
                }
            },
            "defaultProcessorsPerNode": {
                "type": "integer",
                "description": "Default number of processors per node to be used when running this app if no processor count is given in the job request",
                "maxLength": 12,
                "title": "Default processor count",
                "x-schema-form": {
                    "type": "number",
                    "placeholder": 1
                }
            },
            "defaultRequestedTime": {
                "type": "string",
                "description": "Default max run time to be used when running this app if no requested run time is given in the job request",
                "maxLength": 10,
                "title": "Default run time",
                "validator": "^(?:[0-9]{1,3}?[0-9]):[0-5][0-9]:[0-5][0-9]$",
                "x-schema-form": {
                    "type": "input",
                    "placeholder": "24:00:00"
                }
            },
            "ontology": {
                "type": "array",
                "description": "An array of ontology terms describing this app.",
                "items": {
                    "type": "string"
                },
                "title": "Ontology"
            },
            "executionSystem": {
                "type": "string",
                "description": "The ID of the execution system where this app should run.",
                "format": 'uiselect',
                "items": [],
                "title": "Execution system"
            },
            "executionType": {
                "type": "string",
                "description": "The execution type of the application. If you're unsure, it's probably HPC.",
                "format": 'uiselect',
                "items": [
                    "CLI", "HPC", "CONDOR"
                ],
                "title": "Execution type",
                "x-schema-form": {
                    "type": "uiselect",
                    "placeholder": "CLI"
                }
            },
            "parallelism": {
                "type": "string",
                "description": "The parallelism type of the application. If you're unsure, it's probably SERIAL.",
                "format": 'uiselect',
                "items": [
                    "SERIAL",
                    "PARALLEL",
                    "PTHREAD"
                ],
                "title": "Parallelism",
                "x-schema-form": {
                    "type": "uiselect",
                    "placeholder": "SERIAL"
                }
            },
            "deploymentPath": {
                "type": "string",
                "description": "The path to the folder on the deployment system containing the application wrapper and dependencies.",
                "title": "Deployment path"
            },
            "deploymentSystem": {
                "type": "string",
                "description": "The ID of the storage system where this app's assets should be stored.",
                "format": 'uiselect',
                "items": [],
                "title": "Deployment system"
            },
            "templatePath": {
                "type": "string",
                "description": "The path to the wrapper script relative to the deploymentPath.",
                "title": "Wrapper script"
            },
            "testPath": {
                "type": "string",
                "description": "The path to the test script relative to the deploymentPath.",
                "title": "Test script"
            },
            "checkpointable": {
                "type": "boolean",
                "description": "Does this app support checkpointing?",
                "title": "Checkpointable",
                "x-schema-form": {
                    "type": "radiobuttons",
                    "placeholder": false
                }
            },
            "tags": {
                "type": "array",
                "description": "Array of text values used to search and group apps",
                format: "uiselect",
                "items": {
                    "type": "string"
                },
                "title": "Tags"
            },
            "modules": {
                "type": "array",
                "description": "An array of modules to load prior to the execution of the application. This is only relevant when you use the unix Modules or LMOD utilities to manage dependencies on the app execution system.",
                "items": {
                    "type": "string"
                },
                "title": "Modules"
            },
            "inputs": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "The unique identifier for this input file. This will be referenced in the wrapper script.",
                            "required": true,
                            "title": "ID",
                            "valueInLegend": true
                        },
                        "details": {
                            "type": "object",
                            "description": "Descriptive details about this app input file used in form generation.",
                            "title": "Details",
                            "properties": {
                                "label": {
                                    "type": "string",
                                    "description": "The label for this input.",
                                    "title": "Label"
                                },
                                "description": {
                                    "type": "string",
                                    "description": "Description of this input.",
                                    "title": "Description"
                                },
                                "argument": {
                                    "type": "string",
                                    "description": "The command line value of this input (ex -n, --name, -name, etc)",
                                    "title": "Command line argument",
                                    "default": ""
                                },
                                "showArgument": {
                                    "type": "boolean",
                                    "description": "Whether the argument value should be passed into the wrapper at run time?",
                                    "title": "Add command line argument?",
                                    "default": false
                                },
                                "repeatArgument": {
                                    "type": "boolean",
                                    "description": "Whether the argument value should be repeated in front of each user-supplied input before injection into the wrapper template at runtime?",
                                    "title": "Add command line argument?",
                                    "default": false
                                }
                            }
                        },
                        "semantics": {
                            "type": "object",
                            "description": "Semantic information about the input field.",
                            "title": "Semantics",
                            "properties": {
                                "minCardinality": {
                                    "type": "integer",
                                    "description": "Minimum number of instances of this input per job.",
                                    "title": "Min cardinality",
                                    "default": 0,
                                    "required": false
                                },
                                "maxCardinality": {
                                    "title": "Max cardinality",
                                    "type": "integer",
                                    "description": "Max number of instances of this input per job.",
                                    "default": -1,
                                    "required": false
                                },
                                "ontology": {
                                    "title": "Ontology",
                                    "type": "array",
                                    "description": "Array of ontology terms describing this app.",
                                    "items": {
                                        "type": "string"
                                    }
                                },
                                "fileTypes": {
                                    "type": "array",
                                    "description": "Array of file types required for this input.",
                                    "items": {
                                        "type": "string"
                                    },
                                    "title": "File types"
                                }
                            }
                        },
                        "value": {
                            "type": "object",
                            "description": "Default value and validations for the input field.",
                            "title": "Value",
                            "properties": {
                                "default": {
                                    "type": "string",
                                    "description": "The default value to use for this input.",
                                    "title": "Default value"
                                },
                                "validator": {
                                    "type": "string",
                                    "description": "The regular expression used to validate this input value.",
                                    "title": "Validator"
                                },
                                "required": {
                                    "type": "boolean",
                                    "description": "Is this input required? If visible is false, this must be true.",
                                    "title": "Required",
                                    "default": 1,
                                    "required": true
                                },
                                "visible": {
                                    "type": "boolean",
                                    "description": "Should this parameter be visible? If not, there must be a default and it will be required..",
                                    "title": "Visible",
                                    "default": true,
                                    "required": true
                                },
                                "order": {
                                    "type": "integer",
                                    "description": "The order in which this parameter should be printed when generating an execution command for forked execution. This will also be the order in which inputs are returned in the response json.",
                                    "title": "Order",
                                    "default": 0
                                },
                                "enquote": {
                                    "type": "boolean",
                                    "description": "Should this value be double quoted prior to injection in the wrapper template.",
                                    "title": "Visible",
                                    "default": true,
                                    "required": true
                                }
                            }
                        }
                    }
                }
            },
            "parameters": {
                "type": "array",
                "description": "Non-file inputs supported by this application.",
                "items": {
                    "type": "object",
                    "title": "Parameter",
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "The unique identifier for this parameter. This will be referenced in the wrapper script.",
                            "required": true,
                            "title": "ID"
                        },
                        "details": {
                            "type": "object",
                            "description": "Descriptive details about this app parameter used in form generation.",
                            "title": "Details",
                            "properties": {
                                "label": {
                                    "type": "string",
                                    "description": "The label displayed for this parameter .",
                                    "title": "Label"
                                },
                                "description": {
                                    "type": "string",
                                    "description": "Verbose information on what this parameter does.",
                                    "title": "Description"
                                },
                                "attribute": {
                                    "type": "string",
                                    "description": "Name of the command line flag or argument (including dashes) for this parameter.",
                                    "title": "Command line argument",
                                },
                                "showAttribute": {
                                    "type": "boolean",
                                    "description": "Should this command line argument be injected into the submit script preceding the parameter?",
                                    "title": "Add command line argument?",
                                    "default": false
                                },
                                "repeatAttribute": {
                                    "type": "boolean",
                                    "description": "In instances where multiple values are supplied for this parameter, should this command line argument be repeatedly injected into the submit script preceding every instance of the parameter value?",
                                    "title": "Add command line argument?",
                                    "default": false
                                }
                            }
                        },
                        "semantics": {
                            "type": "object",
                            "description": "Semantic information about the parameter field.",
                            "title": "Semantics",
                            "properties": {
                                "minCardinality": {
                                    "type": "integer",
                                    "description": "Minimum number of instances of this parameter per job.",
                                    "title": "Min cardinality",
                                    "default": 0,
                                    "minimum": 0,
                                    "required": false
                                },
                                "maxCardinality": {
                                    "title": "Max cardinality",
                                    "type": "integer",
                                    "description": "Max number of instances of this parameter per job.",
                                    "default": -1,
                                    "minimum": -1,
                                    "required": false
                                },
                                "ontology": {
                                    "title": "Ontology",
                                    "type": "array",
                                    "description": "Array of ontology terms describing this parameter.",
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    },
                    "value": {
                        "type": "object",
                        "description": "Default value and validations for the parameter field.",
                        "title": "Value",
                        "properties": {
                            "default": {
                                "type": "string",
                                "description": "Description of this parameter.",
                                "title": "Default value"
                            },
                            "type": {
                                "type": "string",
                                "description": "The content type of the parameter.",
                                "enum": ["number", "string", "boolean", "enumeration", "flag"],
                                "title": "Content type",
                                "default": "string"
                            },
                            "validator": {
                                "type": "string",
                                "description": "The regular expression used to validate this parameter value.",
                                "title": "Validator regex"
                            },
                            "enum_values": {
                                "type": "array",
                                "description": "The possible values this parameter accepts. A JSON array of string values should be provided.",
                                "title": "Enumerated values",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "required": {
                                "type": "boolean",
                                "description": "Is this parameter required? If visible is false, this must be true.",
                                "title": "Required",
                                "default": 1,
                                "required": true
                            },
                            "visible": {
                                "type": "boolean",
                                "description": "Should this parameter be visible? If not, there must be a default and it will be required.",
                                "title": "Visible",
                                "default": true,
                                "required": true
                            },
                            "order": {
                                "type": "integer",
                                "description": "The order in which this parameter should be printed when generating an execution command for forked execution. This will also be the order in which paramters are returned in the response json.",
                                "title": "Order",
                                "default": 0
                            }
                        }
                    }
                }
            }
        },
        "required": ["name", "version", "label", "executionSystem", "executionType", "deploymentSystem", "deploymentPath"]//, "inputs.id", "parameters.id"]
    };

    $scope.form = [{
        "type": "wizard",
        "legend": "General Info",
        "tabs": [
            {
                "title": "Basics",
                "items": [
                    "name",
                    "version",
                    "label",
                    "helpURI",
                    "shortDescription",
                    "longDescription",
                    {
                        key: 'tags',
                        placeholder: 'One or more tags', //default will translate placeholder.select
                        notitle: true,
                        options: {
                            tagging: '',
                            taggingLabel: '(new)',
                            taggingTokens: 'SPACE|ENTER|,'
                        }
                    },
                    {
                        key: 'ontology',
                        placeholder: 'Semantic terms', //default will translate placeholder.select
                        notitle: true,
                        options: {
                            tagging: '',
                            taggingLabel: '(new)',
                            taggingTokens: 'SPACE|ENTER|,'
                        }
                    }
                ]
            },
            {
                "title": "Dependencies",
                "items": [
                    "deploymentPath",
                    {
                        "key": "deploymentSystem",
                        "placeholder": "storage.example.com",
                        "options": {
                            uiClass: 'short',
                            refreshDelay: 100,
                            callback: $scope.searchStorageSystems
                        }
                    },
                    "templatePath",
                    "testPath",
                    {
                        key: 'modules',
                        placeholder: 'Module command(s)', //default will translate placeholder.select
                        notitle: true,
                        options: {
                            tagging: '',
                            taggingLabel: '(new)',
                            taggingTokens: ',|ENTER|,'
                        }
                    }
                ]
            },
            {
                "title": "Execution Environment",
                "items": [
                    "executionType",
                    {
                        "key": "executionSystem",
                        "placeholder": "compute.example.com",
                        "titleMap": {
                            uiClass: 'short',
                            refreshDelay: 100,
                            callback: $scope.searchExecutionSystems
                        }
                    },
                    {
                        "key": "defaultQueue",
                        "placeholder": "compute.example.com",
                        "options": {
                            uiClass: 'short',
                            refreshDelay: 100,
                            callback: $scope.searchExecutionSystems
                        }
                    },
                    "defaultNodeCount",
                    "defaultMemoryPerNode",
                    "defaultProcessorsPerNode",
                    "defaultRequestedTime",
                    "parallelism",
                    "checkpointable"
                ]
            },
    //        {
    //            "title": "Data Inputs",
    //            "items": [
    //                {
    //                    "type": "tabarray",
    //                    "items": [
    //                        {
    //                            "key": "inputs[]",
    //                            "legend": "Input {{idx}}"
    //                        }
    //                    ]
    //                }
    //            ]
    //        },
            {
                "title": "Parameters",
                "items": [
                    {
                        "type": "tabarray",
                        "items": [
                            {
                                "key": "fieldset",
                                "title": "{{model.parameters[arrayIndex].id}}",
                                "items": [
                                    "id",
                                    {
                                        "key": "fieldset",
                                        "title": "Details",
                                        "description": "Descriptive details about this app parameter used in form generation.",
                                        "items": [
                                            "model.parameters[].details.label",
                                            "model.parameters[].details.description",
                                            {
                                                "key": "model.parameters[].details.showArgument",
                                                type: "radiobuttons",
                                                style: {
                                                    selected: "btn-success",
                                                    unselected: "btn-default"
                                                },
                                                titleMap: [
                                                    {value: true, name: "True"},
                                                    {value: false, name: "False"}
                                                ]
                                            },
                                            {
                                                "key": "model.parameters[].details.argument",
                                                "condition": "model.parameters[arrayIndex].details.showArgument",
                                                "title": "Command line argument"
                                            },
                                            {
                                                "key": "model.parameters[].details.repeatArgument",
                                                "type": "radiobuttons",
                                                "condition": "model.parameters[arrayIndex].details.showArgument",
                                                "style": {
                                                    selected: "btn-success",
                                                    unselected: "btn-default"
                                                },
                                                titleMap: [
                                                    {value: true, name: "True"},
                                                    {value: false, name: "False"}
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "key": "fieldset",
                                        "title": "Semantics",
                                        "description": "Semantic information about the parameter field.",
                                        "items": [
                                            "model.parameters[].semantics.ontology",
                                            {
                                                key: "model.parameters[].semantics.minCardinality",
                                                type: "number",
                                                validationMessage: {
                                                    'minLessThanMax': 'Minimum number of values allowed by this parameter must be a non-negative integer value less than or equal to the maximum number of values.',
                                                    'gtzeroWhenRequired': 'Minimum number of values allowed by this parameter must be greater than zero when required.',
                                                },
                                                $validators: {
                                                    minLessThanMax: function(value) {
                                                        if (model.parameters[arrayIndex].semantics.maxCardinality > 0 &&
                                                                value > model.parameters[arrayIndex].semantics.maxCardinality)
                                                        {
                                                            return false;
                                                        }
                                                        return true
                                                    },
                                                    gtzeroWhenRequired: function(value) {
                                                        if (model.parameters[arrayIndex].semantics.maxCardinality > 0 &&
                                                            value > model.parameters[arrayIndex].semantics.maxCardinality)
                                                        {
                                                            return false;
                                                        }
                                                        return true
                                                    }
                                                },
                                            },
                                            {
                                                key: "model.parameters[].semantics.maxCardinality",
                                                type: "number",
                                                validationMessage: {
                                                    'maxGreaterThanMax': 'Maximum number of values allowed by this parameter must be a non-negative integer value less than or equal to the maximum number of values.',
                                                    'oneWhenBoolish': 'Maximum number of values is one when parameter is of type bool or flag.',
                                                },
                                                $validators: {
                                                    minLessThanMax: function(value) {
                                                        if (model.parameters[arrayIndex].semantics.maxCardinality > 0 &&
                                                            value > model.parameters[arrayIndex].semantics.maxCardinality)
                                                        {
                                                            return false;
                                                        }
                                                        return true
                                                    },
                                                    oneWhenBoolish: function(value) {
                                                        if ((model.parameters[arrayIndex].value.type == 'bool' ||
                                                                model.parameters[arrayIndex].value.type == 'flag') || &&
                                                            model.parameters[arrayIndex].semantics.maxCardinality > 1)
                                                        {
                                                            return false;
                                                        }
                                                        return true
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        "key": "fieldset",
                                        "title": "Values",
                                        "description": "Default value and validations for the parameter field.",
                                        "items": [
                                            {
                                                key: "model.parameters[].value.default",
                                                validationMessage: {
                                                    'maxGreaterThanMax': 'Maximum number of values allowed by this parameter must be a non-negative integer value less than or equal to the maximum number of values.',
                                                    'oneWhenBoolish': 'Maximum number of values is one when parameter is of type bool or flag.',
                                                },
                                                $validators: {
                                                    minLessThanMax: function(value) {
                                                        if (model.parameters[arrayIndex].semantics.maxCardinality > 0 &&
                                                            value > model.parameters[arrayIndex].semantics.maxCardinality)
                                                        {
                                                            return false;
                                                        }
                                                        return true
                                                    },
                                                    oneWhenBoolish: function(value) {
                                                        if ((model.parameters[arrayIndex].value.type == 'bool' ||
                                                            model.parameters[arrayIndex].value.type == 'flag') || &&
                                                            model.parameters[arrayIndex].semantics.maxCardinality > 1)
                                                        {
                                                            return false;
                                                        }
                                                        return true
                                                    }
                                                }
                                            },

                                    "value": {
                                        "type": "object",
                                        "description": "Default value and validations for the parameter field.",
                                        "title": "Value",
                                        "properties": {
                                            "default": {
                                                "type": "string",
                                                "description": "Description of this parameter.",
                                                "title": "Default value"
                                            },
                                            "type": {
                                                "type": "string",
                                                "description": "The content type of the parameter.",
                                                "enum": ["number", "string", "boolean", "enumeration", "flag"],
                                                "title": "Content type",
                                                "default": "string"
                                            },
                                            "validator": {
                                                "type": "string",
                                                "description": "The regular expression used to validate this parameter value.",
                                                "title": "Validator regex"
                                            },
                                            "enum_values": {
                                                "type": "array",
                                                "description": "The possible values this parameter accepts. A JSON array of string values should be provided.",
                                                "title": "Enumerated values",
                                                "items": {
                                                    "type": "string"
                                                }
                                            },

            {
                "key": "required",
                                                "type": "boolean",
                                                "description": "Is this parameter required? If visible is false, this must be true.",
                                                "title": "Required",
                                                "default": 1,
                                                "required": true,
                                                onChange: function(modelValue,form) {
                                                    if (modelValue && model.parameters[arrayIndex].semantics.minCardinality == 0) {
                                                        console.log("Updating model.parameters[" + arrayIndex + "].semantics.minCardinality to 1 to satisfy the requirement attribute.");
                                                        model.parameters[arrayIndex].semantics.minCardinality = 1;
                                                    } else if (!modelValue && model.parameters[arrayIndex].semantics.minCardinality > 0) {
                                                        console.log("Updating model.parameters[" + arrayIndex + "].semantics.minCardinality to 0 to satisfy the non-requirement attribute.");
                                                        model.parameters[arrayIndex].semantics.minCardinality = 0;
                                                    }
                                                }
                                            },
                                            "visible": {
                                                "type": "boolean",
                                                "description": "Should this parameter be visible? If not, there must be a default and it will be required.",
                                                "title": "Visible",
                                                "default": true,
                                                "required": true
                                            },
                                            "order": {
                                                "type": "integer",
                                                "description": "The order in which this parameter should be printed when generating an execution command for forked execution. This will also be the order in which paramters are returned in the response json.",
                                                "title": "Order",
                                                "default": 0
                                            }
                                        }
                                    }
                                }

                            {
                                "key": "parameters",
                                "legend": "Parameter: {{idx}}"
                            }
                        ]
                    }
                ]
            },
    //        {
    //            "title": "Data Output Data",
    //            "items": [
    //                {
    //                    "type": "tabarray",
    //                    "items": [
    //                        {
    //                            "key": "outputs[]",
    //                            "legend": "Parameter: {{idx}}"
    //                        }
    //                    ]
    //                }
    //            ]
    //        }
        ]
    }];

    $scope.systems = {
        execution: [],
        storage: []
    }

    $scope.defaultSystems = {
        execution: null,
        storage: null
    }

    $scope.fetchUserSystems = function(query) {
        SystemsController.listSystems(null, null).then(
            function(systems) {
                angular.forEach(systems, function (system, key) {
                    if (system.type === SystemTypeEnum.STORAGE.toString) {
                        $scope.system.storage.push(system);
                        if (system.default == true) {
                            $scope.defaultSystems.storage = system;
                        }
                    } else {
                        $scope.system.storage.push(system);
                        if (system.default == true) {
                            $scope.defaultSystems.execution = system;
                        }
                    }
                });


            },
            function(response) {
                console.log(response);
                App.alert({
                    type: 'danger',
                    message: "Error fetching execution systems."
                });
            }
        );
    };

    $scope.onSubmit = function(form) {
        // First we broadcast an event so all fields validate themselves
        $scope.$broadcast('schemaFormValidate');

        // Then we check if the form is valid
        if (form.$valid) {
            // ... do whatever you need to do with your data.
        }
    };

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

    $scope.currentTabIndex = 0;

    WizardHandler.activateTab($scope, $scope.currentTabIndex);

    //$scope.editorConfig = {
    //    lineWrapping : true,
    //    lineNumbers: true,
    //    matchBrackets: true,
    //    styleActiveLine: false,
    //    theme:"neat",
    //    mode: 'javascript'
    //};

    $scope.submit = function () {
        $scope.$broadcast('schemaFormValidate');
        if ($scope.myForm.$valid) {
            console.log($scope.model);
        }
    };

    $scope.nextStep = function () {
        WizardHandler.validateTab($scope, $scope.currentTabIndex).then(function () {
            WizardHandler.activateTab($scope, ++$scope.currentTabIndex);
        });


    };

    $scope.previousStep = function () {
        WizardHandler.activateTab($scope, --$scope.currentTabIndex);
    };

    $scope.valueChanged = function (key, modelValue) {
        if (key[0] === 'category') {
            $scope.loadForm(modelValue);
        }
    };

    $scope.$watch('model', function(value){
        if (value) {
            $scope.prettyModel = JSON.stringify(value, undefined, 2);
        }
    }, true);

    $scope.model = {};

    $scope.$watch('model', function (value) {
        if (value) {
            $scope.prettyModel = JSON.stringify(value, undefined, 2);
        }
    }, true);

});