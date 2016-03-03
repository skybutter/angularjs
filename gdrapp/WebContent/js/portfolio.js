//var pfCtrller = angular.module('pfCtrller', ['ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.resizeColumns', 'ngRoute']);
//pfCtrller.config(["$httpProvider", function ($httpProvider) {
gdr.config(["$httpProvider", function ($httpProvider) {	
    $httpProvider.defaults.transformResponse.push(function(responseData){
       convertDateStringsToDates(responseData);
       return responseData;
   });
}]);

//pfCtrller.controller("PortfolioCtrl",['$scope', '$http', '$location', function($scope, $http, $location) {
gdr.controller("PortfolioCtrl",['$scope', '$http', '$location', '$routeParams','sessionService', function($scope, $http, $location, $routeParams, sessionService) {
	var me = this;
	me.application = "Portfolio";
	
	me.pfNum = $routeParams.pfNum;
	if (me.pfNum === undefined || me.pfNum === null) {
		console.log("pfNumber is missing.")
	} else {
		sessionService.setPfNum(me.pfNum);
	}
	
	// Get portfolio from web service
	me.portfolio = {};
	$http.get('data/pf-' + me.pfNum + '.json').success(function(response) {
			//console.log("portfolio=" + JSON.stringify(response));
			me.portfolio = response;
			// Using convert to date object in all $http, no need to do this per field
			//me.security.maturity_dt = new Date(me.security.maturity_dt);
			// simple form
			me.master = angular.copy(me.portfolio);
		});
	
	// simple-form
	me.update = function(portfolio) {
		me.master = angular.copy(portfolio);
	};

	me.reset = function() {
		me.portfolio = angular.copy(me.master);
	};

}]);

//pfCtrller.controller('PfTabController',[function(){
gdr.controller('PfTabController',[function(){
	var me = this;
    me.tabs = [{
        id:1,
        title : 'Holdings', 
        url : 'pf-holdings.html'
    }, {
        id:2,
        title : 'Analytics',
        url : 'pf-analytics.html'
    }, {
        id:3,
        title : 'Characteristic', 
        url : 'pf-characteristics.html',
        disabled : false
    }]
    
    me.counter = 1;
    
    me.selectedTab = 0; //set selected tab to the 1st by default.
    
    /** Function to set selectedTab **/
    me.selectTab = function(index){
        me.selectedTab = index;
    }        
}]);

//pfCtrller.controller("PfHoldingsCtrl",['$scope', '$http', function($scope, $http) {
gdr.controller("PfHoldingsCtrl",['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	
	var me = this;
	me.pfNum = $routeParams.pfNum;
	
	me.gridOptions1 = {
		    enableSorting: true,
		    columnDefs: [
		      { field: 'asset_id', enableSorting: true, width: 100 },
		      { field: 'issuer', displayName:"Issuer", enableSorting: true, width: 50 },
		      { field: 'name', displayName: 'Name', enableSorting: true, width: 200 },
		      { field: 'coupon', displayName: 'Cpn', enableSorting: true, width: 70 },
		      { field: 'moody', displayName: 'Moody', enableSorting: true, width: 60 },
		      { field: 'sp', displayName: 'SP', enableSorting: true, width: 50 },
		      { field: 'dp', displayName: 'DP', enableSorting: true, width: 50 },
		      { field: 'fitch', displayName: 'Fitch', enableSorting: true, width: 50 },
		      { field: 'duration', displayName: 'Duration', enableSorting: true, width: 60 },
		      { field: 'maturity_date', displayName: 'Maturity', enableSorting: true, cellFilter: DATE_FMT, width: 100 },
		      { field: 'amount', displayName : 'Amount', width: 100 },
		      { field: 'original_face', displayName: 'Org Face', width: 100 },
		      { field: 'price', displayName: 'Price', width: 80 },
		      { field: 'currency', displayName: 'Currency', width: 80 },
		      { field: 'market_value_base', displayName: 'Mkt Value Base', width: 100 },
		      { field: 'concentration', displayName : 'Concentration', width: 100 }
		    ],
		    onRegisterApi: function( gridApi ) {
		      //$scope.grid1Api = gridApi;
		      me.grid1Api = gridApi;
		    }
		  };
	me.gridOptions1.data = [];

	$http.get('data/pf-holdings.json').success(function(response) {
		me.gridOptions1.data = response;
		//console.log("gridOptions1.data=" + JSON.stringify(me.gridOptions1.data));
	});
}]);

//pfCtrller.controller("PfAnalyticsCtrl",['$scope', '$http', function($scope, $http) {
gdr.controller("PfAnalyticsCtrl",['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	var me = this;
	me.pfNum = $routeParams.pfNum;
	
	me.gridOptions1 = {
		    enableSorting: true,
		    columnDefs: [
		      { field: 'date', displayName: "Date", enableCellEdit: false, width: 95, type:'date', cellFilter: DATE_FMT },		      
		      { field: 'convex', displayName:"Convex", enableSorting: true, cellFilter: DECIMAL_4_FMT },
		      { field: 'eff_dur1', displayName: 'Eff Dur', enableSorting: true, cellFilter: DECIMAL_4_FMT },
		      { field: 'eff_dur2', displayName: 'D2', enableSorting: true, cellFilter: DECIMAL_4_FMT },
		      { field: 'eff_dur3', displayName: 'D3', enableSorting: true, cellFilter: DECIMAL_4_FMT },
		      { field: 'mkt_value', displayName: 'Mkt Value', enableSorting: true, cellFilter: DECIMAL_2_FMT }
		    ],
		    onRegisterApi: function( gridApi ) {
		      //$scope.grid1Api = gridApi;
		      me.grid1Api = gridApi;
		    }
		  };
	me.gridOptions1.data = [];

	$http.get('data/pf-analytics-' + me.pfNum + '.json').success(function(response) {
		me.gridOptions1.data = response;
		//console.log("gridOptions1.data=" + JSON.stringify(me.gridOptions1.data));
	});
}]);

//pfCtrller.controller("PfCharacteristicsCtrl",['$scope', '$http', function($scope, $http) {
gdr.controller("PfCharacteristicsCtrl",['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	var me = this;
	me.pfNum = $routeParams.pfNum;
	
	me.gridOptions1 = {
		    enableSorting: true,
		    columnDefs: [
		      { field: 'name', displayName: "Name", enableSorting: true, width: 250 },
		      { field: 'value', displayName:"Value", enableSorting: true },
		      { field: 'user_login', displayName: 'User Modify', enableSorting: true, width: 120 },
		      { field: 'last_update', displayName: 'Last Update', enableSorting: true, width: 160, type:'date', cellFilter: DATE_TIME_FMT }
		    ],
		    onRegisterApi: function( gridApi ) {
		      //$scope.grid1Api = gridApi;
		      me.grid1Api = gridApi;
		    }
		  };
	me.gridOptions1.data = [];

	$http.get('data/pf-char-' + me.pfNum + '.json').success(function(response) {
		me.gridOptions1.data = response;
		//console.log("gridOptions1.data=" + JSON.stringify(me.gridOptions1.data));
	});
}]);
gdr.controller("LastPfCtrl",['$scope', '$http', '$location', 'sessionService', function($scope, $http, $location, sessionService) {
	var me = this;
	me.pfNum = sessionService.getPfNum();
	if (me.pfNum === undefined || me.pfNum === null ) {
		console.log("PfNum not found.");
	} else {
		console.log("Goto pfNum=" + sessionService.getPfNum());
		$scope.goNext('/portfolio/' + me.pfNum);		
	}
}]);
