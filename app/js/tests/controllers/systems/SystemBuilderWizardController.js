describe('SystemBuilderWizardController', function() {
    // var tester, injector, systemId, limit, offset, apps, TestConfiguration, $injector, $rootScope, $scope, $stateParams, $translate, SystemsController, MessageService;
    var tester, injector, $timeout, $rootScope, $scope, $state, $stateParams, $uibModal, $localStorage, $location, $translate, WizardHandler, SystemsController, FilesController, MessageService;

    beforeEach(function(){
      module('AgaveToGo');
      module('AgavePlatformScienceAPILib');
      module('pascalprecht.translate');
      module('schemaForm');
      module('schemaFormWizard');
      module('ui.bootstrap');
      module('ui.router');
      module('ui.select');
    });

    beforeEach(function() {
      // increase request timeouts
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      tester = ngMidwayTester('AgavePlatformScienceAPILib');
      TestConfiguration = tester.inject('TestConfiguration');
      Configuration = tester.injector().get('Configuration');
      Configuration.BASEURI = TestConfiguration.BASEURI;
      Configuration.oAuthAccessToken = TestConfiguration.oAuthAccessToken;

      SystemsController = tester.inject('SystemsController');
      FilesController = tester.inject('FilesController');
      tester.digest();
    });

    afterEach(function() {
      tester.destroy();
      tester = null;
    });

    // it('$scope.refresh AppsController.listApp real https', function(done) {
    //   systemId = 'docker.tacc.utexas.edu'
    //   limit = 99999
    //   offset = 0
    //   AppsController.listApps(limit, offset, { 'executionapps[0].like': systemId })
    //     .then(function(response) {
    //         apps = response.result;
    //         expect(apps).not.toEqual(undefined);
    //         expect(apps[0].id).toBeDefined();
    //         expect(apps[0].name).toBeDefined();
    //         expect(apps[0].version).toBeDefined();
    //         expect(apps[0].revision).toBeDefined();
    //         expect(apps[0].executionSystem).toBeDefined();
    //         expect(apps[0].shortDescription).toBeDefined();
    //         expect(apps[0].isPublic).toBeDefined();
    //         expect(apps[0].label).toBeDefined();
    //         expect(apps[0].lastModified).toBeDefined();
    //         expect(apps[0]._links.self.href).toBeDefined();
    //         done();
    //     }, function(response) {
    //         var errorMessage = 'https fail';
    //         if (response.errorResponse){
    //           if (typeof response.errorResponse.message !== 'undefined') {
    //             errorMessage = response.errorResponse.message
    //           } else if (typeof response.errorResponse.fault !== 'undefined'){
    //             errorMessage = response.errorResponse.fault.message;
    //           }
    //             done(errorMessage);
    //         } else {
    //             done.fail(errorMessage);
    //         }
    //     });
    // });

    it('SystemBuilderWizardController mock', inject(function($rootScope, $controller, $timeout, $state, $stateParams, $uibModal, $localStorage, $location, $translate, WizardHandler, SystemsController, FilesController, MessageService) {

    //   var listSystems = function() {
    //    return {
    //      then: function(callback) {
    //        return callback({result:[
    //          {
    //         	"id": "docker.tacc.utexas.edu",
    //         	"name": "Demo Docker VM",
    //         	"type": "EXECUTION",
    //         	"description": "Cloud VM used for Docker demonstrations and tutorials.",
    //         	"status": "UP",
    //         	"public": true,
    //         	"lastUpdated": "2016-09-15T05:20:16.000-05:00",
    //         	"default": false,
    //         	"_links": {
    //         		"self": {
    //         			"href": "https://public.agaveapi.co/systems/v2/docker.tacc.utexas.edu"
    //         		}
    //         	}
    //         }
    //        ]});
    //      }
    //    };
    //  };
     //
    //   spyOn(SystemsController, 'listSystems').and.callFake(listSystems);
      var scope = $rootScope.$new();

      var SystemBuilderWizardController = $controller('SystemBuilderWizardController', {
        $scope: scope,
        $rootScope: $rootScope,
        $timeout: $timeout,
        $state: $state,
        $stateParams: $stateParams,
        $uibModal: $uibModal,
        $localStorage: $localStorage,
        $location: $location,
        $translate: $translate,
        WizardHandler: WizardHandler,
        SystemsController: SystemsController,
        FilesController: FilesController,
        MessageService: MessageService
      });

      // scope.systemsTitleMap = [{'value': 'Local Disk', 'name': 'Local Disk'}, {'value': 'docker.tacc.utexas.edu', 'name': 'docker.tacc.utexas.edu'}];

      expect(SystemBuilderWizardController).toBeDefined();

    }));
});
