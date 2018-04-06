/**
 * Created by dooley on 5/31/17.
 */
angular.module('togo.realtime', [])
    .constant('agaveRealtimeNotificationConfig', {
          // what client should be used to connect to the realtime service
          client: 'faye', // 'faye','websocket','echo','poll'

          prefix: 'togo',

          filter: null,

          // should
          realtimeUrl: 'https://48e3f6fe.fanoutcdn.com/fpp', //'http://localhost:6001/',

          // should "missed" messages be fetched when the client first connects?
          syncOnConnection: false,

          // should messages be archives upon receipt
          archive: false
        }
    )
    .service('NotificationSubscriptionTemplateService', ['userProperties',
      function (userProperties) {
        this.getDefaultSubscriptions = function() {
          var notificationSubscriptions = [];
          if (userProperties.notifications.onChange) {
            notificationSubscriptions.push({
              event: '*',
              persistent: true,
              policy: userProperties.notifications.policy,
              url: userProperties.notifications.url
            });
          }
          else {
            if (userProperties.notifications.onCreate) {
              notificationSubscriptions.push({
                event: 'CREATED',
                persistent: true,
                policy: userProperties.notifications.policy,
                url: userProperties.notifications.url
              });
            }
            if (userProperties.notifications.onUpdate) {
              notificationSubscriptions.push({
                event: 'UPDATED',
                persistent: true,
                policy: userProperties.notifications.policy,
                url: userProperties.notifications.url
              });
            }
            if (userProperties.notifications.onDelete) {
              notificationSubscriptions.push({
                event: 'DELETED',
                persistent: true,
                policy: userProperties.notifications.policy,
                url: userProperties.notifications.url
              });
            }
            if (userProperties.notifications.onFailed) {
              notificationSubscriptions.push({
                event: 'FAILED',
                persistent: true,
                policy: userProperties.notifications.policy,
                url: userProperties.notifications.url
              });
            }
            if (userProperties.notifications.onComplete) {
              notificationSubscriptions.push({
                event: 'FINISHED',
                persistent: true,
                policy: userProperties.notifications.policy,
                url: userProperties.notifications.url
              });
            }
          }

          return notificationSubscriptions;
        }
      }])
    .service('FayeNotificationsService', ['$rootScope', '$localStorage', 'MetaController', 'agaveRealtimeNotificationConfig',
      function ($rootScope, $localStorage, MetaController, toastr, agaveRealtimeNotificationConfig) {

        var client, channel;

        this.listen = function () {
          if (false && typeof $localStorage.tenant !== 'undefined' && typeof $localStorage.activeProfile !== 'undefined') {

            client = new Fpp.Client(agaveRealtimeNotificationConfig.realtimeUrl);

            channel = this.client.Channel($localStorage.tenant.code + '/' + $localStorage.activeProfile.username);

            channel.on('data', function (data) {

              $rootScope.$broadcast('agave.notification.change', data);

              var toastData = {};
              if (data.event === 'FORCED_EVENT') {
                toastData = 'FORCED_EVENT - ' + data.source;
              } else {

                if ('app' in data.message) {
                  toastData = 'APP - ' + data.event;
                } else if ('file' in data.message) {
                  toastData = 'FILE - ' + data.event;
                } else if ('job' in data.message) {
                  toastData = 'JOB - ' + data.event;
                } else if ('system' in data.message) {
                  toastData = 'SYSTEM - ' + data.event;
                } else {
                  toastData = data.event;
                }
              }

              // saving all notifications to metadata if 'archive' is true
              if (agaveRealtimeNotificationConfig.archive) {
                var metadata = {};
                metadata.name = 'notifications';
                metadata.value = data;
                MetaController.addMetadata(metadata)
                    .then(
                        function () {
                        },
                        function (response) {
                          var message = '';
                          if (response.errorResponse.message) {
                            message = 'Error: Could not save notification - ' + response.errorResponse.message;
                          } else if (response.errorResponse.fault) {
                            message = 'Error: Could not save notifications - ' + response.errorResponse.fault.message;
                          } else {
                            message = 'Error: Could not save notifications';
                          }
                          App.alert(
                              {
                                type: 'danger',
                                message: message
                              }
                          );
                        }
                    );
              }
              toastr.info(toastData);
            });

          } else {

          }
        };

        this.disconnect = function () {
          if (channel) {
            channel.disconnect();
            client.disconnect();
          }
        }

      }]);