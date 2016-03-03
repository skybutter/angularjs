//var ctrllers = angular.module('ctrllers', ['ngAnimate', 'ngTouch', 'ui.grid','ui.grid.edit', 'ui.grid.resizeColumns']);
//var ctrllers = angular.module('ctrllers', ['ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.resizeColumns']);

//ctrllers.config(["$httpProvider", function ($httpProvider) {
//    $httpProvider.defaults.transformResponse.push(function(responseData){
//       convertDateStringsToDates(responseData);
//       return responseData;
//   });
//}]);

var DATE_TIME_FMT = "date:\'yyyy-MM-dd HH:mm:ss\'";
var DATE_FMT = "date:\'yyyy-MM-dd\'";
var DECIMAL_4_FMT = "number:4"
var DECIMAL_2_FMT = "number:2"

function getToday() {
    var d = new Date();
    d.setHours(0,0,0,0);
    return d;
}

//ctrllers.controller("SecurityCtrl",['$scope', '$http', '$location', '$routeParams','sessionService', function($scope, $http, $location, $routeParams, sessionService) {
gdr.controller("SecurityCtrl",['$scope', '$http', '$location', '$routeParams','sessionService', function($scope, $http, $location, $routeParams, sessionService) {
	var me = this;
	me.application = "Security";
	
	me.securityId = $routeParams.securityId;
	if (me.securityId === undefined || me.securityId === null) {
		console.log("security id is missing.")
	} else {
		sessionService.setSecurityId(me.securityId);
	}
	//$scope.securityId = $routeParams.securityId;
	console.log("*********** SecurityCtrl.securityId=" + me.securityId);
	
	// Get security from web service
	me.security = {};
	$http.get('data/security' + me.securityId + '.json').success(function(response) {
			//console.log("security=" + JSON.stringify(response));
			me.security = response;
			// Using convert to date object in all $http, no need to do this per field
			//me.security.maturity_dt = new Date(me.security.maturity_dt);
			// simple form
			me.master = angular.copy(me.security);
		});
	
	// Get list of security types
	me.securityTypes = [ { id : 21, text : 'Government' }, { id : 22, text : 'Corporate' }, { id : 23, text : 'Muni' }, { id : 24, text : 'Mortgage Backed' }];
	
	// Get list of country code
	me.countries = [];
	$http.get('data/countries.json').success(function(response) {
			//console.log("countries=" + JSON.stringify(response));
			me.countries = response;
		});

	// Get list of currency code
	me.currencies = [];
	//$http.get('http://atpappuat1:8181/atp/universal/webservices/cache/infoaccess/getCurrencyList').success(function(response) {
	$http.get('data/currencies.json').success(function(response) {
			//console.log("currencies=" + JSON.stringify(response));
			me.currencies = response;
		});
	
	// simple-form
	me.update = function(security) {
		me.master = angular.copy(security);
	};

	me.reset = function() {
		me.security = angular.copy(me.master);
	};

}]);

//ctrllers.controller('TabController',['$scope', function($scope){
gdr.controller('TabController',['$scope', function($scope){
	var me = this;
    me.tabs = [{
        id:1,
        title : 'Security IDs', 
        url : 'security-ids.html'
    }, {
        id:2,
        title : 'Portfolio',
        url : 'security-positions.html'
    }, {
        id:3,
        title : 'Analytic', 
        url : 'security-analytics.html',
        disabled : false
    }, {
        id:4,
        title : 'Characteristic', 
        url : 'security-characteristics.html'
    }, {
        id:5,
        title : 'Classification', 
        url : 'security-classification.html'
    }, {
        id:6,
        title : 'Security Rating', 
        url : 'security-ratings.html',
        disabled : false
    }, {
        id:3,
        title : 'Pricing',
        url : 'security-pricing.html',
        disabled : false
    }]
    
    me.counter = 1;
    
    me.selectedTab = 0; //set selected tab to the 1st by default.
    
    /** Function to set selectedTab **/
    me.selectTab = function(index){
        me.selectedTab = index;
    }        
}]);

//ctrllers.controller('SecurityIDsCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams, uiGridConstants) {
gdr.controller('SecurityIDsCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams, uiGridConstants) {
	var me = this;

	me.securityId = $routeParams.securityId;	
	console.log("*********** SecurityIDsCtrl.securityId=" + me.securityId);
	me.gridOptions1 = {
		    enableSorting: true,
		    columnDefs: [
		      //{ field: 'security_id' },
		      { field: 'field_id', name:"FieldID", enableCellEdit: false, width: 65 },
		      { field: 'name', name:"Field", enableCellEdit: false, width: 200 },
		      { name: 'value', width: 230 },
		      //{ field: 'field_grp_id', enableSorting: false, enableCellEdit: false },
		      { name: 'user_id', enableCellEdit: false, width : 100 }, 
		      { field: 'last_update', width: 150, cellFilter: DATE_TIME_FMT }
		    ],
		    onRegisterApi: function( gridApi ) {
		      //$scope.grid1Api = gridApi;
		      me.grid1Api = gridApi;
		    }
		  };
	me.gridOptions1.data = [];
		
	$http.get('data/security-ids-' + me.securityId + '.json').success(function(response) {
		//console.log("characteristics=" + JSON.stringify(response));
		//$scope.gridOptions1.data = response;
		me.gridOptions1.data = response;
		//console.log("gridOptions1.data=" + JSON.stringify(me.gridOptions1.data));
	});	
}]);

//ctrllers.controller("SecurityPositionsCtrl",['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
gdr.controller("SecurityPositionsCtrl",['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	var me = this;
	
	me.securityId = $routeParams.securityId;
	console.log("*********** SecurityPositionsCtrl.securityId=" + me.securityId);

	me.gridOptions1 = {
		    enableSorting: true,
		    columnDefs: [
		      { field: 'pf_number', enableSorting: true, width: 100 },
		      { name: 'pf_name', enableSorting: true },
		      { field: 'original_face', name: 'Original Face', width: 110, type: 'number' },
//		      { field: 'amount', displayName : 'Amount', width: 110 },
		      { field: 'amount', displayName : 'Amount', width: 110, 
	    	  cellTemplate: '<div class="ui-grid-cell ui-grid-cell-contents">{{row.entity.amount | number:2 }}</div>'},
		      { field: 'concentration', displayName : 'Concentration', width: 120 }
		    ],
		    onRegisterApi: function( gridApi ) {
		      //$scope.grid1Api = gridApi;
		      me.grid1Api = gridApi;
		    }
		  };
	me.gridOptions1.data = [];

	$http.get('data/security-positions-' + me.securityId + '.json').success(function(response) {
		me.gridOptions1.data = response;
		//console.log("gridOptions1.data=" + JSON.stringify(me.gridOptions1.data));
	});
}]);

//ctrllers.controller('SecurityCharacteristicsCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams, uiGridConstants) {
gdr.controller('SecurityCharacteristicsCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams, uiGridConstants) {
	var me = this;
	me.characteristics = [];

	me.securityId = $routeParams.securityId;
	console.log("*********** SecurityCharacteristicsCtrl.securityId=" + me.securityId);

	me.gridOptions1 = {
		    enableSorting: true,
		    columnDefs: [
		      //{ field: 'security_id' },
		      { name: 'field_id', enableCellEdit: false, width: 80 },
		      { name: 'name', enableCellEdit: false, width: 250 },
		      { name: 'value' },
		      //{ field: 'field_grp_id', enableSorting: false, enableCellEdit: false },
		      //{ field: 'last_update' },
		      { name: 'user_id', enableCellEdit: false, width: 180 }
		    ],
		    onRegisterApi: function( gridApi ) {
		      //$scope.grid1Api = gridApi;
		      me.grid1Api = gridApi;
		    }
		  };
	me.gridOptions1.data = [];
		
	$http.get('data/security-characteristics-' + me.securityId + '.json').success(function(response) {
		//console.log("characteristics=" + JSON.stringify(response));
		me.characteristics = response;
		//$scope.gridOptions1.data = response;
		me.gridOptions1.data = response;
		//console.log("gridOptions1.data=" + JSON.stringify(me.gridOptions1.data));
	});	
}]);

//ctrllers.controller('SecurityClassificationCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams, uiGridConstants) {
gdr.controller('SecurityClassificationCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams, uiGridConstants) {
	var me = this;
	me.classifications = [];
	
	me.securityId = $routeParams.securityId;
	console.log("*********** SecurityClassificationCtrl.securityId=" + me.securityId);

	me.gridOptions1 = {
		    enableSorting: true,
		    columnDefs: [
		      //{ field: 'security_id' },
		      { name: 'field_id', enableCellEdit: false, width: 80 },
		      { name: 'name', enableCellEdit: false, width: 250 },
		      { name: 'value' },
		      //{ field: 'field_grp_id', enableSorting: false, enableCellEdit: false },
		      //{ field: 'last_update' },
		      { name: 'user_id', enableCellEdit: false, width: 180 }
		    ],
		    onRegisterApi: function( gridApi ) {
		      //$scope.grid1Api = gridApi;
		      me.grid1Api = gridApi;
		    }
		  };
	me.gridOptions1.data = [];
		
	$http.get('data/security-classification-' + me.securityId + '.json').success(function(response) {
		//console.log("classifications=" + JSON.stringify(response));
		me.classifications = response;
		//$scope.gridOptions1.data = response;
		me.gridOptions1.data = response;
		//console.log("gridOptions1.data=" + JSON.stringify(me.gridOptions1.data));
	});	
}]);

Date.prototype.yyyymmdd = function() {
	   var yyyy = this.getFullYear().toString();
	   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	   var dd  = this.getDate().toString();
	   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};

//ctrllers.controller('SecurityRatingCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams, uiGridConstants) {
gdr.controller('SecurityRatingCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams, uiGridConstants) {
	var me = this;
	me.ratings = [];
	
	me.securityId = $routeParams.securityId;
	console.log("*********** SecurityRatingCtrl.securityId=" + me.securityId);
	
    var d = getToday();
    d.setMonth(d.getMonth() - 1);
    me.startDate = d;    
    me.endDate = getToday();
    
	me.gridOptions1 = {
		    enableSorting: true,
		    columnDefs: [
		      //{ field: 'security_id' },
		      { field: 'date', displayName:"Date", enableCellEdit: false, width: 95, type:'date', cellFilter: DATE_FMT },
		      { field: 'rating_moody', displayName:"Moody's", enableCellEdit: false, width: 80 },
		      { field: 'moody_value', displayName:"Moody's Value", enableCellEdit: false, width: 120 },
		      { field: 'rating_sp', displayName:"S&P's", enableCellEdit: false, width: 70 },
		      { field: 'sp_value', displayName:"S&P's Value", enableCellEdit: false, width: 110 },
		      { field: 'rating_fitch', displayName:"Fitch's", enableCellEdit: false, width: 80 },
		      { field: 'fitch_value', displayName:"Fitch's Value", enableCellEdit: false, width: 120 },
		      { field: 'rating_wa', displayName:"WA's", enableCellEdit: false, width: 70 },
		      { field: 'wa_value', displayName:"WA's Value", enableCellEdit: false, width: 100 },
		      { field: 'user_login', displayName:"User", enableCellEdit: false, width: 100 },
		      { field: 'last_update', displayName:"Last Update", width: 150, cellFilter: DATE_TIME_FMT }
		    ],
		    onRegisterApi: function( gridApi ) {
		      me.grid1Api = gridApi;
		    }
		  };
	me.gridOptions1.data = [];
	
	me.getRatings = function(startDate, endDate) {
		console.log("startDate=" + startDate);
		console.log("endDate=" + endDate);
		var params = "?start=" + startDate.yyyymmdd() + "&end=" + endDate.yyyymmdd();
		console.log("params=" + params);
		$http.get('data/security-ratings-' + me.securityId + '.json' + params).success(function(response) {
			me.ratings = response;
			me.gridOptions1.data = response;
			//console.log("gridOptions1.data=" + JSON.stringify(me.gridOptions1.data));
		});			
	}
	// initialize with the default start, end date
//	me.getRatings(me.startDate, me.endDate);
}]);

//ctrllers.controller('SecurityPricingCtrl', ['$scope', '$http', '$routeParams', 'uiGridConstants', function($scope, $http, $routeParams, uiGridConstants) {
gdr.controller('SecurityPricingCtrl', ['$scope', '$http', '$routeParams', 'uiGridConstants', function($scope, $http, $routeParams, uiGridConstants) {
	var me = this;

	me.securityId = $routeParams.securityId;
	console.log("*********** SecurityPricingCtrl.securityId=" + me.securityId);
	
    var d = getToday();
    d.setMonth(d.getMonth() - 1);
    me.startDate = d;    
    me.endDate = getToday();
	
	me.gridOptions1 = {
		    enableSorting: true,
		    columnDefs: [
		      //{ field: 'security_id' },
		      { field: 'date', displayName:"Date", width: 100, cellFilter: DATE_FMT,
		    	  filter: {
		              condition: uiGridConstants.filter.EQUAL,
		              placeholder: '',
		              term: ''
		          }
//		      	filters: [
//			    	     {
//					         condition: uiGridConstants.filter.GREATER_THAN,
//					         placeholder: 'great than',
//					         term: ''
//					     },
//					     {
//					         condition: uiGridConstants.filter.LESS_THAN,
//					         placeholder: 'less than',				    	 
//					     }
//			    	  ] 
		      },
		      { field: 'name', displayName:"Source", enableCellEdit: false, width: 100 },
//		      { field: 'current_source_flag', displayName:"Current Source", enableCellEdit: false, width: 140 },
		      { field: 'current_source_flag', displayName:"Current Source", enableCellEdit: false, width: 140, 
		    	  cellTemplate: '<div class="ui-grid-cell ui-grid-cell-contents"><input type="checkbox" ng-model="row.entity.current_source_flag" disabled></div>'},
		      { field: 'reason', displayName:"Reason", enableCellEdit: false },
		      { field: 'last_update', displayName:"Last Update", width: 160, cellFilter: DATE_TIME_FMT },
		      { field: 'user_login', displayName:"Created User", enableCellEdit: false, width: 100 },
		      { field: 'created_date', displayName:"Created Date", enableCellEdit: false, width: 160, cellFilter: DATE_TIME_FMT },
		    ],
		    onRegisterApi: function( gridApi ) {
		      me.grid1Api = gridApi;
		    }
		  };
	me.gridOptions1.data = [];
		
//	$http.get('data/security-pricing-' + me.securityId + '.json').success(function(response) {
//		me.pricings = response;
//		me.gridOptions1.data = response;
//		//console.log("gridOptions1.data=" + JSON.stringify(me.gridOptions1.data));
//	});

	me.getPricing = function(startDate, endDate) {
		console.log("startDate=" + startDate);
		console.log("endDate=" + endDate);
		var params = "?start=" + startDate.yyyymmdd() + "&end=" + endDate.yyyymmdd();
		console.log("params=" + params);
		$http.get('data/security-pricing-' + me.securityId + '.json' + params).success(function(response) {
			//me.pricings = response;
			me.gridOptions1.data = response;
			//console.log("gridOptions1.data=" + JSON.stringify(me.gridOptions1.data));
		});			
	}

	  me.toggleFiltering = function(){
		    me.gridOptions1.enableFiltering = !me.gridOptions1.enableFiltering;
		    me.grid1Api.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
		  };
		  

}]);

//ctrllers.controller('SecurityAnalyticCtrl', ['$scope', '$http', '$routeParams', 'uiGridConstants', function($scope, $http, $routeParams, uiGridConstants) {
gdr.controller('SecurityAnalyticCtrl', ['$scope', '$http', '$routeParams', 'uiGridConstants', function($scope, $http, $routeParams, uiGridConstants) {
	var me = this;
	me.analytics = [];

	me.securityId = $routeParams.securityId;
	console.log("*********** SecurityAnalyticCtrl.securityId=" + me.securityId);
	
    var d = getToday();
    d.setMonth(d.getMonth() - 1);
    me.startDate = d;    
    me.endDate = getToday();
	
	me.gridOptions1 = {
		    enableSorting: true,
		    columnDefs: [
		      //{ field: 'security_id' },
		      { field: 'date', displayName:"Date", width: 100, cellFilter: DATE_FMT},
		      { field: 'field', displayName:"Attribute", enableCellEdit: false, width: 140 },
		      { field: 'source', displayName:"Source", enableCellEdit: false, width: 170 },
		      { field: 'value', displayName:"Reason", enableCellEdit: false },
		      { field: 'current_source_flag', displayName:"Current Source", enableCellEdit: false, width: 140, 
		    	  cellTemplate: '<div class="ui-grid-cell ui-grid-cell-contents"><input type="checkbox" ng-model="row.entity.current_source_flag" disabled></div>'},
		      { field: 'user_login', displayName:"User", enableCellEdit: false, width: 120 },
		      { field: 'last_update', displayName:"Last Update", width: 160, cellFilter: DATE_TIME_FMT }
		    ],
		    onRegisterApi: function( gridApi ) {
		      me.grid1Api = gridApi;
		    }
		  };
	me.gridOptions1.data = [];
		
	me.getAnalytics = function(startDate, endDate) {
		var params = "?start=" + startDate.yyyymmdd() + "&end=" + endDate.yyyymmdd();
		console.log("params=" + params);
		$http.get('data/security-analytics-' + me.securityId + '.json' + params).success(function(response) {
			//me.analytics = response;
			me.gridOptions1.data = response;
			//console.log("gridOptions1.data=" + JSON.stringify(me.gridOptions1.data));
		});			
	}
}]);

//ctrllers.controller("DatePickerController",['$scope', function($scope) {
gdr.controller("DatePickerController",['$scope', function($scope) {
	
	var me = this;
	
	me.datePickers = {
		startDate : false,
		endDate : false
	};

    me.today = function() {
    	me.dt = new Date();
      };
      me.today();

      me.clear = function () {
    	  me.dt = null;
      };

      // Disable weekend selection
      me.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      };

      me.maxDate = new Date();

      me.open = function($event, which) {
    	  $event.preventDefault();
    	  $event.stopPropagation();
    	  
    	  me.datePickers[which] = true;
      };

      me.dateOptions = {
        formatYear: 'yy',
        startingDay: 0
      };

      me.format = 'yyyy-MM-dd';

      me.status = {
        opened: false
      };
}]);


gdr.controller("LastSecurityCtrl",['$scope', '$http', '$location', 'sessionService', function($scope, $http, $location, sessionService) {
	var me = this;
	me.securityId = sessionService.getSecurityId();
	if (me.securityId === undefined || me.securityId === null ) {
		console.log("security id not found.");
	} else {
		console.log("Goto security id=" + sessionService.getSecurityId());
		$scope.goNext('/security/' + me.securityId);		
	}
}]);
