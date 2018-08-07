angular.module('AgaveAuth').controller('TenantSelectionController', function ($injector, $timeout, $rootScope, $scope, $state, $location, settings, $localStorage, $window, TenantsController, Commons, Alerts) {

  settings.layout.tenantPage = true;
  settings.layout.loginPage = false;

  $scope.getTenantByCode = function (tenantId) {
    var namedTenant = false;
    angular.forEach(settings.tenants, function (tenant, key) {
      if (tenant.code === tenantId) {
        namedTenant = tenant;
        return false;
      }
    });

    if (namedTenant) {
      return namedTenant;
    } else {
      Alerts.danger({message: 'No tenant found matching ' + tenantId});
    }
  };

  $scope.openLoginForm = function () {
    if ($scope.tenant) {
      $state.go('login', {tenantId: $scope.tenant.code});
    }
    else {
      Alerts.danger({message: 'Please select the tenant you would like to login to. If you do not have an account with any of the listed tenants, you can create an account in the Agave public tenant using the link below the form.'});
    }
  };

  $scope.isDevEnvironment = function () {
    return settings.environment == 'deveopment' || settings.environemnt == 'devel' || settings.environment == 'dev';
  };

  $scope.updateTenant = function (item, model) {
    $scope.displayTenant = item;
    $scope.tenant = $scope.getTenantByCode($scope.displayTenant.code);
    $localStorage.tenant = $scope.displayTenant;

  };

  $scope.redirectToSignup = function ($event) {
    $event.stopPropagation();
    if ($scope.displayTenant && $scope.displayTenant.signupUrl) {
      alert($scope.displayTenant.signupUrl);
      $window.location.href = $scope.displayTenant.signupUrl;
      return false;
    } else {
      Alerts.danger({container: ".lock-body .message", message: "Select an organization to create an account."});
    }
  };

  $scope.loadTenant = function () {
    if ($scope.displayTenant && $scope.displayTenant.code) {
      $localStorage.tenant = $scope.displayTenant;
      $location.path('login/' + $scope.displayTenant.code);
      $location.replace();
    } else {
      Alerts.danger({container: ".lock-body .message", message: "Select an organization to login."});
    }
  };

  if (angular.isUndefined($localStorage.tenant)) {
    $localStorage.tenant = {};
  }

  $scope.tenants = [];


  $scope.displayTenant = $scope.getTenantByCode($localStorage.tenant.code || settings.tenants[0].code);
  $scope.tenant = $scope.displayTenant;

  // show content on state change success
  $scope.$on('$stateChangeSuccess', function () {
    jQuery('.content.hide, .copyright.hide').removeClass('hide'); // show content area
  });

  // show content on state change success
  $scope.$on('$stateChangeError', function () {
    jQuery('.content.hide, .copyright.hide').removeClass('hide'); // show content area
  });

  // show content on state change success
  $scope.$on('$stateNotFound', function () {
    jQuery('.content.hide, .copyright.hide').removeClass('hide'); // show content area
  });
  
});
