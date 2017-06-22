angular.module('SessionCredentialService', ['ngStorage', 'AlertsService', 'MessageService', 'EncryptionService',])
    .service('SessionCredential', ['$rootScope', '$sessionStorage', '$q', 'AlertsService', 'MessageService', 'EncryptionService', '$uibModal',
      function ($rootScope, $sessionStorage, $q, AlertsService, MessageService, EncryptionService, $uibModal) {
        
        this.get = function() {
          if ($sessionStorage.tmpCredentials) {
            var tmpCreds = EncryptionService.decrypt(key, $sessionStorage.tmpCredentials);
            return JSON.parse(tmpCreds);
          }
          else {
            return $uibModal.open({
              templateUrl: 'tpl/modals/SessionCredentialConfirmAction.html',
              scope: $rootScope,
              controller: ['$scope', '$modalInstance', 'resourceType', 'resource', 'resourceAction', 'resourceList', 'resourceIndex',
                function($scope, $modalInstance, resourceType, resource, resourceAction, resourceList, resourceIndex ){

                  $('.login-form').validate({
                    errorElement: 'span', //default input error message container
                    errorClass: 'help-block', // default input error message class
                    focusInvalid: false, // do not focus the last invalid input
                    rules: {
                      username: {
                        required: true
                      },
                      password: {
                        required: true
                      },
                      remember: {
                        required: false
                      }
                    },

                    messages: {
                      username: {
                        required: "Username is required."
                      },
                      password: {
                        required: "Password is required."
                      }
                    },

                    invalidHandler: function (event, validator) { //display error alert on form submit
                      $('.alert-danger', $('.login-form')).show();
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

                      var tmpCreds = EncryptionService.encrypt(key, $sessionStorage.tmpCredentials);
                      return JSON.parse(tmpCreds);
                      
                      var data = {
                        grant_type: 'password',
                        username: $scope.user.username,
                        password: $scope.user.password
                      };

                      data = queryString.stringify(data);

                      options = angular.extend({
                        headers: {
                          'Content-Type': 'application/x-www-form-urlencoded',
                          'Authorization': btoa($scope.user.client_key + ':' + $scope.user.client_secret)
                        }
                      }, options);

                      
                    }
                  });
                  
                  $('.session-credential-form input').keypress(function (e) {
                    if (e.which == 13) {
                      if ($('.login-form').validate().form()) {
                        $('.login-form').submit(); //form validation success, call ajax form submit
                      }
                      return false;
                    }
                  });

                  $scope.ok = function() {

                    return $sessionStorage.tmpCredentials;
                  };
                }]
            });
          }
        }
        /* Encrypt a message */
        this.encrypt = function (passwd, plaintextData) {
          return sjcl.encrypt(passwd, plaintextData)
        };

        /* Decrypt a message */
        this.decrypt = function (passwd, encryptedData) {
          return sjcl.decrypt(passwd, encryptedData);
        };
      }]);
