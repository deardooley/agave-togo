angular.module('AgaveAuth').controller('PasswordResetController', function ($rootScope, $scope, $state, $stateParams) {

  $scope.tenantId = $stateParams.tenantId || 'agave.prod';
  $scope.email = '';

  $('.forget-form').validate({
    errorElement: 'span', //default input error message container
    errorClass: 'help-block', // default input error message class
    focusInvalid: false, // do not focus the last invalid input
    ignore: "",
    rules: {
      email: {
        required: true,
        email: true
      }
    },

    messages: {
      email: {
        required: "Email is required."
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
      error.insertAfter(element.closest('.input-icon'));
    },

    submitHandler: function (form) {
      form.submit();
    }
  });

  $('.forget-form input').keypress(function (e) {
    if (e.which == 13) {
      if ($('.forget-form').validate().form()) {
        $('.forget-form').submit();
      }
      return false;
    }
  });

  $scope.doLoginForm = function() {
    $state.go('login-form',{tenantId: $scope.tenantId});
  }


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