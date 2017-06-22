angular.module('EncryptionService', ['../bower_components/sjcl/sjcl.js'])
    .constant('sljc', sljc)
    .service('Encrypt', ['$rootScope', '$localStorage', '$q', 'sljc',
      function ($rootScope, $localStorage, $q, sljc) {

        /* Encrypt a message */
        this.encrypt = function (passwd, plaintextData) {
          return sjcl.encrypt(passwd, plaintextData)
        };

        /* Decrypt a message */
        this.decrypt = function (passwd, encryptedData) {
          return sjcl.decrypt(passwd, encryptedData);
        };
      }]);
