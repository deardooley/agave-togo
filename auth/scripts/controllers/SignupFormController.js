angular.module('AgaveAuth').controller('SignupFormController', function ($injector, $timeout, $rootScope, $scope, $state, $stateParams, $filter, settings, $localStorage, AccessToken, TenantsController, Commons, Alerts) {

  $scope.tenantId = $stateParams.tenantId || "agave.prod";

  $scope.selectedTenant = $filter('filter')($rootScope.settings.tenants, {"code": $scope.tenantId});

  $scope.profile = {
    username: null,
    password: null,
    firstName: null,
    lastName: null,
    organization: null,
    title: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    tnc: 0
  };


  function format(state) {
    if (!state.id) {
      return state.text;
    }
    var $state = $(
        '<span><img src="../assets/global/img/flags/' + state.element.value.toLowerCase() + '.png" class="img-flag" /> ' + state.text + '</span>'
    );

    return $state;
  }

  if (jQuery().select2 && $('#country_list').size() > 0) {
    $("#country_list").select2({
      placeholder: '<i class="fa fa-map-marker"></i>&nbsp;Select a Country',
      templateResult: format,
      templateSelection: format,
      width: 'auto',
      escapeMarkup: function (m) {
        return m;
      }
    });


    $('#country_list').change(function () {
      $('.register-form').validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
    });
  }

  $('.register-form').validate({
    errorElement: 'span', //default input error message container
    errorClass: 'help-block', // default input error message class
    focusInvalid: false, // do not focus the last invalid input
    ignore: "",
    rules: {

      fullname: {
        required: true
      },
      email: {
        required: true,
        email: true
      },
      address: {
        required: true
      },
      city: {
        required: true
      },
      country: {
        required: true
      },

      username: {
        required: true
      },
      password: {
        required: true
      },
      rpassword: {
        equalTo: "#register_password"
      },

      tnc: {
        required: true
      }
    },

    messages: { // custom messages for radio buttons and checkboxes
      tnc: {
        required: "Please accept TNC first."
      }
    },

    invalidHandler: function (event, validator) { //display error alert on form submit

    },

    highlight: function (element) { // hightlight error inputs
      $(element)
          .closest('.form-group').addClass('has-error'); // set error class to the control group
    },

    success: function (label) {
      label.closest('.form-group').removeClass('has-error');
      label.remove();
    },

    errorPlacement: function (error, element) {
      if (element.attr("name") == "tnc") { // insert checkbox errors after the container
        error.insertAfter($('#register_tnc_error'));
      } else if (element.closest('.input-icon').size() === 1) {
        error.insertAfter(element.closest('.input-icon'));
      } else {
        error.insertAfter(element);
      }
    },

    submitHandler: function (form) {

      $http.post($scope.selectedTenant.baseUrl + '/profiles/v2', $scope.profile, {}).then(
          function (response) {
            $localStorage.token = response;
            $localStorage.client = $scope.user;
            $localStorage.tenant = $scope.tenant;
            console.log(response);

            $state.go('login', {'tenantId': $scope.tenant.code});
          },
          function (response) {
            console.log(response);
            $rootScope.broadcast('oauth:denied', response);
          });
    }
  });

  $('.register-form input').keypress(function (e) {
    if (e.which == 13) {
      if ($('.register-form').validate().form()) {
        $('.register-form').submit();
      }
      return false;
    }
  });

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
