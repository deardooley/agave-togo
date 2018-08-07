angular.module('AgaveAuth').controller('LoginFormController', function ($rootScope, $scope, $state, $stateParams, $http, $window, $localStorage, $filter, settings, Commons, Alerts, TokensController, ProfilesController, APIHelper, Configuration) {

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
      return {};
    }
  };

  $scope.processAuthFile = function (files) {

    // loop through all the files, looking for a valid Agave auth file
    angular.forEach(files, function (file) {

      // if it's a directory, skip it
      if (file.type !== "dir") {

        if (file.size > 16384) {
          Alerts.danger({
            container: '#form-title-header',
            message: file.name + ' is not a valid Agave auth file.'
          });
        }
        else {
          var reader = new FileReader();

          reader.onerror = function (e) {
            Alerts.danger({
              container: '#form-title-header',
              message: 'Unable to read the file contents of ' + file.name +
              '. Verify that this is an Agave auth file and try again.'
            });
          };

          reader.onloadend = function (e) {

            try {
              // parse the JSON document
              var authCache = JSON.parse(e.target.result);

              // check for a valid tenant id to update the form
              if (authCache.tenantid) {
                var tenant = $scope.getTenantByCode(authCache.tenantid);
                if (tenant) {
                  $scope.selectedTenant = tenant;
                  $localStorage.tenant = tenant;
                }
              }

              // populate the form with any values present in the cache file
              if (authCache.username) {
                $scope.user.username = authCache.username;
              }

              if (authCache.password) {
                $scope.user.password = authCache.password;
              }

              if (authCache.client_key || authCache.apikey) {
                $scope.user.client_key = authCache.client_key || authCache.apikey;
              }

              if (authCache.client_secret || authCache.apisecret) {
                $scope.user.client_secret = authCache.client_secret || authCache.apisecret;
              }

              // if there is a valid auth token, check it for validity
              if (authCache.access_token && authCache.expires_at) {

                var currentDate = new Date();
                var expirationDate = Date.parse(authCache.expires_at);

                var diff = (expirationDate - currentDate) / 60000;

                // token has expired, check for a refresh token to get a new token
                if (diff < 0) {

                  $scope.attemptTokenRefresh(authCache);
                }
                else {

                  Alerts.success({
                    container: '#form-title-header',
                    message: 'Successfully loaded auth file. Completing login...'
                  });

                  // token is valid. update the local cache and carry on
                  var token = {
                    access_token: authCache.access_token,
                    expires: authCache.expires_in,
                    expires_at: authCache.expires_at,
                    created_at: authCache.created_at
                  };

                  if (authCache.refresh_token) {
                    token.refresh_token = authCache.refresh_token;
                  }

                  // only remember the client info if they asked us to
                  // if ($scope.remember) {
                    $localStorage.client = angular.copy($scope.user);
                  // }
                  // else {
                  //   delete $localStorage.client;
                  // }

                  $localStorage.token = token;

                  ProfilesController.getProfile('me').then(
                      function(response) {

                        Alerts.success({
                          container: '#form-title-header',
                          message: "Profile retrieved successfully. Redirecting..."
                        });

                        // store profile
                        $localStorage.activeProfile = response;

                        // redirect to app
                        $window.location.href = $localStorage.redirectUrl || "../app/"
                      },
                      function(err) {
                        Alerts.danger({
                          container: '#form-title-header',
                          message: "Invalid token. Unable to fetch user profile."
                        });
                      });

                  // $rootScope.$broadcast('oauth:login', token);

                }
              }
              else {
                // no auth token, but there may be a refresh token we can use.
                // give it a try.
                $scope.attemptTokenRefresh(authCache);
              }
            }
            catch (e) {
              Alerts.danger({
                container: '#form-title-header',
                message: file.name + ' contains invalid JSON. ' +
                    'Please verify that ' + file.name + ' is a valid agave auth file and try again.'
              });
            }
          };

          // read the file contents and handle the content
          reader.readAsText(file);
        }
      }

    });
  };

  $scope.attemptTokenRefresh = function (authCache) {
    // in the event they walked something other than an implicit flow to
    // get a token and a reresh token is present, attempt to refresh the
    // existing token before forcing them to auth again.
    if ($scope.user.client_key && $scope.user.client_secret) {

      var client = {
        consumerKey: $scope.user.client_key,
        consumerSecret: $scope.user.client_secret
      };

      // everything we need to try a refresh is present. make the call and updated accordingly.
      TokensController.refreshToken(client, authCache.refresh_token).then(
          function (refreshTokenResponse) {

            Alerts.success({
              container: '#form-title-header',
              message: 'Successfully loaded auth file and refreshed the token. Completing login...'
            });

            var token = {
              access_token: refreshTokenResponse.access_token,
              expires: refreshTokenResponse.expires_in,
              expires_at: moment(refreshTokenResponse.expires_in).toDate(),
              refresh_token: refreshTokenResponse.refresh_token
            }

            // only remember the client info if they asked us to
            // if ($scope.remember) {
              $localStorage.client = angular.copy($scope.user);
            // }
            // else {
            //   delete $localStorage.client;
            // }

            Configuration.setToken(token);

            $localStorage.token = token;

            ProfilesController.getProfile('me').then(
                function(response) {
                  // store profile
                  $localStorage.activeProfile = response;

                  // redirect to app
                  $window.location.href = $localStorage.redirectUrl || "../app/"
                },
                function(err) {
                  Alerts.danger({
                    container: '#form-title-header',
                    message: "Invalid token. Unable to fetch user profile."
                  });
                });
          },
          function (err) {
            Alerts.danger({
              container: '#form-title-header',
              message: "The token found in the auth file is expired and the attempt to refresh it failed. " +
                "Please verify your authentication credentials in the fields below and use the form to complete your sign in."
            });
          });
    }
    else {

      Alerts.danger({
        container: '#form-title-header',
        message: "The token found in the auth has already expired. No refresh credentials were found. " +
          "Please verify your authentication credentials in the fields below and use the form to complete your sign in."
      });

      $scope.user = authCache;
    }
  };

  $scope.excludeSelectedTenant = function (selectedTenant) {
    return function(tenant) {
      return tenant.code !== selectedTenant.code;
    };
  };

  $scope.setCurrentTenant = function (tenant) {
    $scope.selectedTenant = tenant;

    $rootScope.$broadcast('oauth:template:update', 'views/templates/oauth-ng-button.html');

  };

  $scope.isDevEnvironment = function () {
    return true;
    // return settings.environment == 'development' || settings.environemnt == 'devel' || settings.environment == 'dev';
  };

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

      if (form.name === 'implicitFlow') return false;
      
      var form = {
        grant_type: 'password',
        username: $scope.user.username,
        password: $scope.user.password
      };

      var options = {
        method: 'post',
        url: $scope.selectedTenant.baseUrl + 'token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa($scope.user.client_key + ':' + $scope.user.client_secret)
        },
        data: form,
        transformRequest: function (obj) {
          var encoded = APIHelper.urlEncodeObject(obj);
          return encoded;
        }
      };

      $scope.requesting = true;

      $http(options).then(
          function (response) {
            var token = response.data;
            var expires_at = moment().add(response.data.expires_in, 'seconds');
            token.expires_at = expires_at.toDate();

            // replicating field for compatibility with oauth-ng
            token.expires = token.expires_in;

            $localStorage.token = token;
            $localStorage.tenant = $scope.selectedTenant;

            // only remember the client info if they asked us to
            if ($scope.remember) {
              $localStorage.client = $scope.user;
            }
            else {
              delete $localStorage.client;
            }

            Configuration.setToken(token.access_token);

            ProfilesController.getProfile('me').then(
                function(response) {

                  Alerts.success({
                    container: '#form-title-header',
                    message: "Profile retrieved successfully. Redirecting..."
                  });

                  $scope.requesting = false;

                  // store profile
                  $localStorage.activeProfile = response;

                  // redirect to app
                  $window.location.href = $localStorage.redirectUrl || "../app/"
                },
                function(err) {

                  $scope.requesting = false;

                  Alerts.danger({
                    container: '#form-title-header',
                    message: "Invalid token. Unable to fetch user profile."
                  });
                });

          },
          function (response) {
            console.log(response);
            $rootScope.$broadcast('oauth:denied', response);
          });
    }
  });

  $('.login-form input').keypress(function (e) {
    if (e.which == 13) {
      if ($('.login-form').validate().form()) {
        $('.login-form').submit(); //form validation success, call ajax form submit
      }
      return false;
    }
  });


  $scope.settings = settings;

  $scope.remember = true;

  var currentTenantId;
  if ($stateParams.tenantId) {
    currentTenantId = $stateParams.tenantId;
  }
  else if ($localStorage.tenant && $localStorage.tenant.code) {
    currentTenantId =  $localStorage.tenant.code;
  }
  else {
    currentTenantId = settings.tenants[0].code;
  }

  $scope.selectedTenant = $scope.getTenantByCode(currentTenantId);
  if ($scope.selectedTenant) {
    $localStorage.tenant = $scope.selectedTenant;
  }

  $scope.user = ($localStorage.client && angular.copy($localStorage.client)) || {
        username: '',
        password: '',
        client_key: '',
        client_secret: '',
        remember: 0
      };

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