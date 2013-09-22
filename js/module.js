var server = "http://money.amitavroy.com/?q=";
var loginUrl = server + "mobileapp/user/login.json";
var tokenUrl = server + "services/session/token";

/*defining the module*/
var mi = angular.module('mi', ['ngCookies']);

/*defining the routes*/
mi.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when("/login", {templateUrl: "pages/login.html", controller: mi.loginCtrl});
  $routeProvider.when("/home", {templateUrl: "pages/home.html", controller: mi.homeCtrl});
  $routeProvider.otherwise({redirectTo: "/login"});
}]);

/*user object*/
mi.factory('sharedUser', ['$http', '$cookieStore', function($http, $cookieStore) {
  var user = {};
  user.token = "";
  user.auth = "";

  user.login = function(username, password) {
    return $http({
      headers: {'Content-Type': 'application/json'},
      url: tokenUrl,
      method: "POST",
      data: ""
    }).success(function(data) {
      this.token = data;
      return $http({
        headers: {'X-CSRF-Token' : this.token, 'Content-Type': 'application/json'},
        url: loginUrl,
        method: "POST",
        data: {username: username, password: password}
      }).success(function(data) {
          var cookieData = {
            sessionId: data.sessid,
            session_name: data.session_name,
            token: this.token
          };
          $cookieStore.put('auth',JSON.stringify(cookieData));
          user.auth = JSON.stringify(cookieData);
        });
    });
  };

  user.logout = function() {};



  return user;
}]);