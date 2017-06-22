'use strict';

app.factory('RequireTranslations', function($translatePartialLoader, $translate, $rootScope) {
    return function() {
        angular.forEach(arguments, function(translationKey) {
            $translatePartialLoader.addPart(translationKey);
        });
        return $translate.refresh().then(
            function(){
                return $translate.use($rootScope.currentLanguage);
            }
        );
    };
});

app.factory('MyErrorHandler', function ($q, $log) {
    return function (part, lang) {
        $log.error('The "' + part + '/' + lang + '" part was not loaded.');
        return $q.when({});
    };
});