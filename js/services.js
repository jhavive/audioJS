angular.module('services',[])
.factory('AuthenticationService',
    ['$http','$cookieStore', '$rootScope', '$timeout','getUserId',
    function ( $http,$cookieStore, $rootScope, $timeout, getUserId) {
        var service = {};
        service.Login = function (username, password1, callback) {
            var Indata={'username':username,'password':password1}            
            $cookieStore.put('username', Indata.username);

            $http({
            url: GLOBAL_URL+"/api-token-auth/",
            method: "POST",
            data:Indata,
            })
            .success(function (response) {
                //console.log(response); 
                callback(response);
            })
            .error(function(data, status){
                    console.log("data");
                    $rootScope.dataLoading = false;
                    $cookieStore.remove('username');
                    $rootScope.error=data.non_field_errors[0];
            })
            ;
 
        };
  
        service.SetCredentials = function (apiKey,userID) {
            $http.defaults.headers.common['Authorization'] ="Token "+apiKey; // jshint ignore:line
            $rootScope.authdata=apiKey;
            $cookieStore.put('authdata',apiKey);
            console.log(userID);
            $cookieStore.put("userID",userID);
            console.log($cookieStore.get('userID'));
            //$cookieStore.put('userID',"userid");
        };
                
        service.ClearCredentials = function () {
            $rootScope.authdata = "";
            $cookieStore.remove('authdata');
        };
  
        return service;
}])
.factory('fileUpload', ['$http', '$cookieStore',
    function ($http,$cookieStore) {
        var worker = new Worker('js/pollForStatus.js');
        var service = {};
        var token = $cookieStore.get('authdata');
        var user = $cookieStore.get('userID');
        service.uploadCSVToUrl = function(file, uploadUrl,callback){
            var worker = new Worker('js/csvUpload.js');
            //console.log(user);
            worker.postMessage({"url":uploadUrl,"token":token,"user":user,"tag_file":file});
            worker.addEventListener('message', function(e) {
                //console.log('Worker said: ', e.data);
                callback(e.data);
            }, false);       
        };
        service.uploadAudioToUrl = function(file, uploadUrl,index,callback){
            //console.log(user);
            var worker = new Worker('js/audioUpload.js');
            worker.postMessage({"url":uploadUrl,"token":token,"user":user,"tag_file":file,index:index});
            worker.addEventListener('message', function(e) {
                //console.log('Worker said: ', e.data);
                callback(e.data);
            }, false);       
        };
        service.pollForStatus =  function(appSessionId,index,callback){
            console.log(index);
            worker.postMessage({"appSessionId":appSessionId,"token":token,index:index});
            worker.addEventListener('message', function(e) {
                //console.log(e.data);
                callback(e.data);
            }, false);       
        };
        return service;
    }
])
.factory('getUserId',[
    '$cookieStore','$http',
    function($cookieStore,$http){
        var service = {};
        service.storeUserId = function(token, callback){
            //$cookieStore.put("userID",12);
            $http.defaults.headers.common['Authorization'] = "Token "+token; // jshint ignore:line
            $http({
                url: GLOBAL_URL+"/appusers/",
                method: "GET"
            })
            .success(function (response) {
                //var response  = JSON.parse(response);
                callback(response[0].user_id);
            })
            .error(function(data, status){
                    //console.log(data);
                    $rootScope.dataLoading = false;
                    $cookieStore.remove('userID');
                    $rootScope.error=data.non_field_errors[0];
            })
            ;
        }
        return service;
        
    }]
)
.factory('Tags',[
    '$cookieStore','$http',
    function($cookieStore,$http){
        var service = {};
        service.getTags = function(callback){
            //var url = GLOBAL_URL+"/tags/?user_id="+$cookieStore.get('userID');
            var url = GLOBAL_URL+"/tags/?user_id="+$cookieStore.get('userID');
            $http({
                url:url,
                method:"GET"
            })
            .success(function(response){
                callback(response);
            })
            .error(function(data,status){
                var empty_object = [];
                callback();
            })
        }
        return service;
    }]
).factory('getPreviousSessions',[
    '$cookieStore','$http',
    function($cookieStore,$http){
        var service = {};
        service.get = function(callback){
            //var url = GLOBAL_URL+"/tags/?user_id="+$cookieStore.get('userID');
            var url = GLOBAL_URL+"/sessions/?num_sessions=15";
            $http({
                url:url,
                method:"GET"
            })
            .success(function(response){
                callback(response);
            })
            .error(function(data,status){
                var empty_object = [];
                callback();
            })
        }
        service.delete = function(app_session_id, index, callback){
            //var url = GLOBAL_URL+"/tags/?user_id="+$cookieStore.get('userID');
            var indata = {app_session_id:app_session_id};
            var url = GLOBAL_URL+"/session/tags/";
            $http({
                url:url,
                method:"DELETE",
                params: indata
            })
            .success(function(response){
                callback(index,response);
            })
            .error(function(data,status){
                var empty_object = [];
                callback();
            })
        }
        return service;
    }]
);
