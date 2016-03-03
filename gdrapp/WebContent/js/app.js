//var gdr = angular.module('gdr', ['ui.bootstrap' , 'maintCtrller', 'ctrllers', 'pfCtrller', 'searchController','ngRoute']);
//var gdr = angular.module('gdr', ['ui.bootstrap' , 'maintCtrller', 'ctrllers', 'searchController', 'ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ngRoute']);
var gdr = angular.module('gdr', ['ui.bootstrap' , 'maintCtrller', 'ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ngRoute']);

//Convert all date string into Date Object in $http call
var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;
//var regexIso8601 = /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})[+-](\d{2})\:(\d{2})/
// Date Time Format 
var regexDateTime = /^[0,1]?\d\/(([0-2]?\d)|([3][01]))\/((199\d)|([2-9]\d{3}))\s[0-2]?[0-9]:[0-5][0-9]:[0-5][0-9] (AM|PM)?$/;

function convertDateStringsToDates(input) {
    // Ignore things that aren't objects.
    if (typeof input !== "object") return input;

    for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        if (typeof value === "string" && value.length==10 && (match = value.match(regexIso8601))) {
        	// Javascript builtin Date.parse() converting the ISO Date into UTC date, so need to customize it.
        	//	The new EMCA Javascript 6 would use local time, so may not be needed after that.
        	console.log("datestring=" + match[0]);
            var reggie = /(\d{4})-(\d{2})-(\d{2})/;
            var dateArray = reggie.exec(match[0]); 
            var dateObject = new Date(
                (+dateArray[1]),
                (+dateArray[2])-1, // Careful, month starts at 0!
                (+dateArray[3])
            );
        } else if (typeof value === "string" && value.length>4 && (match = value.match(regexIso8601))) {
            var milliseconds = Date.parse(match[0])
            if (!isNaN(milliseconds)) {
                input[key] = new Date(milliseconds);
            }
        } else if (typeof value === "string" && value.length>18 && (match = value.match(regexDateTime))) {
            var milliseconds = Date.parse(match[0])
            if (!isNaN(milliseconds)) {
                input[key] = new Date(milliseconds);
            }        	
        } else if (typeof value === "object") {
            // Recurse into object
            convertDateStringsToDates(value);
        }
    }
}

gdr.config(["$httpProvider", function ($httpProvider) {
    $httpProvider.defaults.transformResponse.push(function(responseData){
       convertDateStringsToDates(responseData);
       return responseData;
   });
}]);

gdr.controller('MainCtrl', ['$scope', '$window', '$location', 'sessionService', function($scope, $window, $location, sessionService) {
    var me = this;
    me.name = "GDR";
    $scope.message = "Test";
    
    $scope.goNext = function(earl) {
//    	console.log('path=' + earl);
    	$location.path(earl);
    }
    me.goPage = function(earl) {
//    	console.log('path=' + earl);
    	$location.path(earl);
    }
}]);
	
gdr.config(function ($routeProvider) {
	$routeProvider
	// route for Home/Search page
	.when("/", {
		templateUrl : 'home.html',
		controller : 'MainCtrl'
	})
	// route for Security Search page
	.when("/search_security", {
		templateUrl : 'search-security.html',
		// Using controllerAs and defined in the html tag, not needed here
		controller : 'SecuritySearchCtrl',
		controllerAs : 'secSearchCtrl'
	})
	// route for Portfolio Search page
	.when("/search_portfolio", {
		templateUrl : 'search-portfolio.html',
		// Using controllerAs and defined in the html tag, not needed here
		//controller : 'PfSearchCtrl'
	})
	// route for Security page
	.when("/security/:securityId", {
		templateUrl : 'security.html',
		// Using controllerAs and defined in the html tag, not needed here
		//controller : 'SecurityCtrl'
	})
	// route for last searched Security page
	.when("/security", {
		templateUrl : 'last-security.html',
		controller : 'LastSecurityCtrl',
		controllerAs : 'lastSecCtrl'
	})
	// route for last searched Portfolio page
	.when("/portfolio", {
		templateUrl : 'last-portfolio.html',
		controller : 'LastPfCtrl',
		controllerAs : 'lastPfCtrl'
	})
	// route for Portfolio page
	.when("/portfolio/:pfNum", {
		templateUrl : 'portfolio.html',
		controller : 'PortfolioCtrl'
	})
	// route for Maintenance Fields page
	.when("/field", {
		templateUrl : 'field.html',
		controller : 'FieldCtrl'
	})
	// route for Maintenance Field Lookup page
	.when("/field_lookup", {
		templateUrl : 'field_lookup.html',
		controller : 'FieldLookupCtrl'
	})
	// route for Maintenance Field Group page
	.when("/field_group", {
		templateUrl : 'field_group.html',
		controller : 'FieldGroupCtrl'
	});
});

gdr.service('sessionService', function() {
	// Define variables to store last search security and portfolio
	var securityId = null;
	var pfNum = null;
	var getSecurityId = function() {
		return securityId;
	}
	var getPfNum = function() {
		return pfNum;
	}
	var setSecurityId = function(id) {
		securityId = id;
	}
	var setPfNum = function(id) {
		pfNum = id;
	}

	// Define variables to store last search parameters
	var securityParams = null;
	var pfParams = null;
	var getSecurityParams = function() {
		return securityParams;
	}
	var getPfParams = function() {
		return pfParams;
	}	
	var setSecurityParams = function(param) {
		securityParams = param;
	}
	var setPfParams = function(param) {
		pfParams = param;
	}
	// Define variables to store last search results
	var securityResults = null;
	var pfResults = null;
	var getSecurityResults = function() {
		return securityResults;
	}
	var getPfResults = function() {
		return pfResults;
	}	
	var setSecurityResults = function(results) {
		securityResults = results;
	}
	var setPfResults = function(results) {
		pfResults = results;
	}
	
	// Exposed methods to callers
	return {
		getSecurityParams: getSecurityParams,
		getPfParams : getPfParams,
		setSecurityParams : setSecurityParams,
		setPfParams : setPfParams,
		getSecurityResults: getSecurityResults,
		getPfResults : getPfResults,
		setSecurityResults : setSecurityResults,
		setPfResults : setPfResults,
		getSecurityId : getSecurityId,
		getPfNum : getPfNum,
		setSecurityId : setSecurityId,
		setPfNum : setPfNum
	}
});