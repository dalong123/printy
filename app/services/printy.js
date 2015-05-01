angular.module('Printy').service('printy', function($compile, $rootScope, $document, $window, $templateRequest, $q){
  var self = this;

  var defaultWindowFeatures = {
    height:700,
    width:800,
    left:100,
    top:100,
    scrollbars:'yes',
    toolbar:'no',
    menubar:'no',
    location:'no',
    directories:'no',
    status:'no'
  };

  this.print = function(options) {
    // what happens if there is no scope?
    var scope = createScope(options.scope);

    loadTemplate(options).then(function(template) {
      var element = angular.element(template);
      var compiledElement = $compile(element)(scope);

      var pw = $window.open('', 'popUpWindow', generateFeaturesString(options.features));

      pw.addEventListener('beforeunload', function(){
        scope.$destroy();
      });

      //angular.element(pw.document.head).append( angular.element('<link rel="stylesheet" type="text/css" />').attr('href', 'http://maxcdn.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css') );
      //angular.element( pw.document.body ).append(compiledElement).ready(function() {pw.print(); pw.close();});
      angular.element( pw.document.body ).append(compiledElement).ready(function() {});
    });

  };

  var generateFeaturesString = function(features) {
    var pwFeatures = angular.extend({}, defaultWindowFeatures, features);
    var pwFeaturesString = '';
    angular.forEach(pwFeatures, function(value, key) {
      pwFeaturesString += key + '=' + value + ',';
    });
    return pwFeaturesString;
  };

  var createScope = function(scope) {
    var angularScope = $rootScope.$new(true);
    angular.forEach(scope, function(value, key) {
      this[key] = value;
    }, angularScope);
    return angularScope;
  };

  var loadTemplate = function(options) {
    var deferred = $q.defer();
    if (options.templateUrl) {
      $templateRequest(options.templateUrl).then(function(template){
        deferred.resolve(template);
      });
    } else if(options.template) {
      deferred.resolve(options.template);
    }
    return deferred.promise;
  };
});
