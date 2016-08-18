// var queryBuilder = angular.module('queryBuilder', []);
AgaveToGo.directive('queryBuilder', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            resource: '=',
            group: '='
        },
        templateUrl: 'tpl/directives/queryBuilderDirective.html',
        compile: function (element, attrs) {
            var content, directive;
            content = element.contents().remove();
            return function (scope, element, attrs) {

                scope.operators = [
                    { name: '&' },
                    // { name: 'OR' }
                ];

                switch(attrs.resource){
                  case 'apps':
                    scope.fields = [
                      {name: 'available'},                    // Whether the app is available. Boolean, default true
                      {name: 'checkpointable'},               // Whether the app is checkpointable
                      {name: 'checksum'},                     // The checksum of the public app deployment assets.
                      {name: 'created'},                      // The timestamp when the app was first registered. Results are
                                                              // rounded by day. You may specify using YYYY-MM-DD format or free
                                                              // form timeframes such as 'yesterday' or '3 days ago'.
                      {name: 'defaultmaxruntime'},            // The max run time for job requests utilizing this app.
                      {name: 'defaultmemorypernode'},         // The default memory request for job requests utilizing this app.
                      {name: 'defaultnodes'},                 // The default number of nodes requested for job requests utilizing this app.
                      {name: 'defaultprocessorspernode'},     // The default processors per node request for job requests utilizing this app.
                      {name: 'defaultqueue'},                 // The default executionSystem queue for job requests utilizing this app.
                      {name: 'deploymentpath'},               // The deployment path on the storageSystem where the app assets reside.
                      {name: 'executionsystem'},              // The id of the system where the app will run.
                      {name: 'executiontype'},                // The execution type of the app. One of HPC, CLI, CONDOR.
                      {name: 'helpuri'},                      // The URL to the help documentation for this app.
                      {name: 'icon'},                         // The icon associated with this app.
                      {name: 'id'},                           // The unique id of the app defined by <name>-<version>
                      {name: 'inputs.id'},                    // The id of one or more input definitions for the app
                      {name: 'label'},                        // The display label for the app.
                      {name: 'lastupdated'},                  // The timestamp of the last time the app was updated. Results are
                                                              // rounded by day. You may specify using YYYY-MM-DD format or free
                                                              // form timeframes such as 'yesterday' or '3 days ago'.
                      {name: 'longdescription'},              // The full description of the app.
                      {name: 'modules'},                      // The list of modules used by this app. Do not use equality
                                                              // operators with this search term.
                      {name: 'name'},                         // The name of the app
                      {name: 'ontology'},                     // The list of ontological terms used by this app. Do not use
                                                              // equality operators with this search term.
                      {name: 'outputs.id'},                   // The id of one or more output definitions for the app
                      {name: 'owner'},                        // The owner of the app.
                      {name: 'parallelism'},                  // The parallelism type of the app: One of PARALLEL, PTHREAD, SERIAL
                      {name: 'parameters.id'},                // The id of one or more parameter definitions for the app
                      {name: 'parameters.type'},              // The type of one or more parameter definitions for the app
                      {name: 'public'},                       // Whether the app is publicly available for use.
                      {name: 'publiconly'},                   // Restricts to only public apps. Present for legacy support. This is
                                                              // equivalent to public=true
                      {name: 'privateonly'},                  // Restricts to only private apps. Present for legacy support. This is
                                                              // equivalent to public=false
                      {name: 'revision'},                     // The revision count of the app. This is the number of times the
                                                              // app definition has been udpated.
                      {name: 'shortdescription'},             // The short description of the app.
                      {name: 'storagesystem'},                // The id of the system where the app assets reside.
                      {name: 'tags'},                         // The list of ontological terms used by this app. Do not use
                                                              // equality operators with this search term.
                      {name: 'templatepath'},                 // The path of the wrapper template file relative to the app's
                                                              // deploymentPath.
                      {name: 'testpath'},                     // The path of the test wrapper template relative to the app's
                                                              // deploymentPath.
                      {name: 'uuid'},                         // The uuid of the app.
                      {name: 'version'}                       // The version of the app
                    ];
                    break;

                    case 'systems':
                      scope.fields = [

                      ];
                      break;
                }



                scope.conditions = [
                    {name: '.eq='},
                    {name: '.on='},
                    {name: '.neq='},
                    {name: '.it='},
                    {name: '.before='},
                    {name: '.lte='},
                    {name: '.gt='},
                    {name: '.after='},
                    {name: '.gte='},
                    {name: '.in='},
                    {name: '.nin='},
                    {name: '.like='},
                    {name: '.nlike='},
                    {name: '.between='}
                ];

                scope.addCondition = function () {
                    scope.group.rules.push({
                        condition: '.eq=',
                        field: 'available',
                        data: ''
                    });
                };

                scope.removeCondition = function (index) {
                    scope.group.rules.splice(index, 1);
                };

                scope.addGroup = function () {
                    scope.group.rules.push({
                        group: {
                            operator: '&',
                            rules: []
                        }
                    });
                };

                scope.removeGroup = function () {
                    "group" in scope.$parent && scope.$parent.group.rules.splice(scope.$parent.$index, 1);
                };

                directive || (directive = $compile(content));

                element.append(directive(scope, function ($compile) {
                    return $compile;
                }));
            }
        }
    }
}]);
