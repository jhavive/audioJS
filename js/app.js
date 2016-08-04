angular.module('myApp', ['ngCookies','ui.router', 'controllers', 'services',"ngStorage", "directive"])

.config(function($stateProvider, $urlRouterProvider,$httpProvider) {
    $stateProvider
    .state("login",{
        name:"login",
         url:"/login",
         views: {
            "basecontent": {
                templateUrl: "templates/login.html",
                controller: "LoginController"          
            },
        }
    })
    .state("app", {
        url:"/app",
        abstract: true,
        views: {
            "basecontent": {
                templateUrl: "templates/base.html",
                controller: "baseCtrl"          
            },
        }
    })
    .state("app.home",{
        name:"app.home",
        url:"/home",
        views:{
            "modalcontent":{
                controller: 'HomeController',
                templateUrl: 'templates/home.html'
            }
        }
    })
    .state("app.previous",{
        name:"app.previous",
        url:"/previous",
        views:{
            "modalcontent":{
                controller: 'PreviousController',
                templateUrl: 'templates/previousTags.html'
            }
        }
    });
    $urlRouterProvider.otherwise("/login");
})
.run(function($rootScope,$state,$location,$localStorage,$window,$http,$cookieStore){
    $rootScope.globals = $cookieStore.get('globals') || {};
    $rootScope.phone="";
    $rootScope.text="";
    $rootScope.page=[];
    $rootScope.pageArrayIndex=0;
    $rootScope.currentPage=1;
    $rootScope.showLinkPassword = false;
    $rootScope.currentState = "";
    $rootScope.previousState="";
    $rootScope.formatted_address=new Object();
    $rootScope.loadingOverlay=false;
    if ($cookieStore.get('authdata')) {
        //console.log("auth");
        $http.defaults.headers.common['Authorization'] = "Token "+$cookieStore.get('authdata'); // jshint ignore:line
    }
    else
    {
        $rootScope.authdata="";
        $rootScope.currentUser="";
        
    }
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        $rootScope.previousState=$rootScope.currentState;
        $rootScope.showLinkPassword = false;
        $rootScope.error="";
        $rootScope.success="";
        $rootScope.currentPage=1;
        $rootScope.dataLoading = false;
        /*if($location.path("/app/sessions")){
            $rootScope.previousState = "app.home";
        }*/
        if(!$cookieStore.get('userID')){
            console.log("no userID");
            //$location.path('/login');
            $state.go('login');
        }
        if($cookieStore.get('authdata'))
        {
            $http.defaults.headers.common['Authorization'] ="Token "+$cookieStore.get('authdata');
            if($location.path()=="/app" || $location.path()=="/login")
            {
                $location.path('/app/home');
            }
        }
        else{
            $state.go('login');
        }
        if (!$cookieStore.get('username') && !$state.is("/login")) {
            $location.path('/login');
        }
    });
    
})
.filter('tagsTiming', function() {
  return function(input) {
        var time = parseInt(input);
        if (time<60)
            return "00:"+((time<10)?"0"+time:""+time);
        else{
            min = Math.floor(time/60);
            sec = time%60;
            return ((min<10)?"0"+min:""+min)+":"+((sec<10)?"0"+sec:""+sec);
        }

    };
})
.filter('formatedDate', function() {
  return function(input) {
        var time = new Date(input);
        min = time.getMinutes();
        hour = time.getHours();
        days = time.getDate();
        month = time.getMonth()+1;
        return days+"/"+month+" "+hour+":"+min;
    };
});