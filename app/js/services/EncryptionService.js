angular.module('EncryptionService', [])
    .service('Encrypt', ['$rootScope', '$localStorage', '$q',
      function ($rootScope, $localStorage, $q) {

        /* Encrypt a message */
        this.encrypt = function (passwd, plaintextData) {
          return sjcl.encrypt(passwd, plaintextData)
        };

        /* Decrypt a message */
        this.decrypt = function (passwd, encryptedData) {
          return sjcl.decrypt(passwd, encryptedData);
        };
      }]);
