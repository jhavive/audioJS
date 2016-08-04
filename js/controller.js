
angular.module('controllers',['ngAnimate','ui.bootstrap'])
.controller('LoginController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService','$state','getUserId',
    function ($scope, $rootScope, $location, AuthenticationService,$state,getUserId) {
        $rootScope.error="";
        $rootScope.dataLoading = false;
        $scope.login = function () {
            console.log(1);
            $rootScope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function(response) {
                if(!response.error) {
                    getUserId.storeUserId(response.token,function(user_id){
                        AuthenticationService.SetCredentials(response.token,user_id);
    
                        $state.go('app.home');
                        console.log("Alright then");
                    });
                } 
                else {
                    $rootScope.error = error.message;
                }
            });
        };
    }])
.controller("baseCtrl",function($sce,$cookieStore,$rootScope,$scope,$state,$location){
    $scope.name=$cookieStore.get('username');
    $scope.initial=$scope.name.charAt(0).toUpperCase();
    $scope.logout=function()
    {
        $rootScope.authdata = "";
        $cookieStore.remove('username');
        $cookieStore.remove('authdata');
        $cookieStore.remove('trackSession');
        $cookieStore.remove('userID');
        $location.path('login');

    }
    $scope.goBack = function(){
        console.log($rootScope.previousState);
        $state.go($rootScope.previousState);
    }
    $scope.home=function()
    {   
        $location.path('app/home');
        $rootScope.agentName="";
    }
    $scope.lastSessions=function(){
        $location.path('app/previous');
        $state.go("app.previous");
        $rootScope.agentName="";
    }
    $scope.tags=function(){
        $location.path('app/tags');
        $rootScope.agentName="";
    }
    $scope.changePassword = function(){
        $location.path('/app/change-password');
        //return GLOBAL_URL+"/change-password";
    }
})
.controller('HomeController',
    ['$scope','$cookieStore', '$rootScope', '$location','$state','fileUpload','getUserId','Tags',
    function ($scope, $cookieStore,$rootScope, $location,$state,fileUpload,getUserId,Tags) {
        $scope.tagList = [];
        Tags.getTags(function(response){
            $scope.tagList = response.content;
        })
        $scope.view = false;
        $scope.uploadEnable=false;
        $scope.loading=false;
        $scope.ns = [1];
        $scope.tags = [""];
        $scope.loading = [true];
        
        $scope.uploadedCSV = true;
        $scope.addRow = function(index){
            $scope.ns.push(index+1);
            $scope.loading.push(true);
            $scope.tags.push("");
        }
        var token = $cookieStore.get('authdata')
        $scope.uploadFile = function(){
            if(file!=null)
                $scope.uploadedCSV = false;
            $scope.tagList = [];
            var previousFile;
            var file = $scope.myFile;
            console.log(file);
            var reader = new FileReader();
            reader.onload = function(e) {
                var tagsInFile = reader.result.split("\n");
                for(var x= 0;x<tagsInFile.length;x++)
                    $scope.tagList.push(tagsInFile[x]);
            }
            reader.readAsText(file);
            console.log('file is ' );
            console.dir(file);
            var uploadUrl = GLOBAL_URL+"/tags/";
            fileUpload.uploadCSVToUrl(file, uploadUrl,function(viewFlag){
                $scope.uploadedCSV = true;
                console.log(viewFlag);
                $scope.view = viewFlag;
                $scope.$apply();
            });
        };
        $scope.uploadAudio = function(file,index){
            //var file = $scope.myAudioFile;
            $scope.uploadEnable=true;
            console.log('index is '+index);
            console.log(file);
            $scope.loading[index] = false;
            $scope.tags[index]="";
            var uploadUrl = GLOBAL_URL+"/recordings/";
            fileUpload.uploadAudioToUrl(file, uploadUrl, index, function(response){
                console.log(response);
                if(response.response!=""){
                    fileUpload.pollForStatus(response.appSessionId,response.index,function(response){
                        if(response.response.tags.length>0){                            
                            console.log(response.response.tags.length);
                            $scope.tags[response.index] = response.response.tags;
                        }
                        else{
                            $scope.tags[response.index] = [{"text_eng":"No Tags received"}];
                        }
                        $scope.uploadEnable=false;
                        $scope.loading[response.index] = true;
                        $scope.$apply();
                    });
                }
                else{
                    console.log(response);
                    $scope.tags[response.index] = [{"text_eng":"No Tags received"}];
                    $scope.loading[response.index] = true;
                    $scope.$apply();
                }
                /*$scope.view = viewFlag;
                $scope.$apply();*/

            });
        }
    }
])
.controller('PreviousController',
    ['$scope','$cookieStore', '$rootScope', '$location','$state','fileUpload','getUserId','Tags','getPreviousSessions',
    function ($scope, $cookieStore,$rootScope, $location,$state,fileUpload,getUserId,Tags,getPreviousSessions) {
        $scope.tagList = [];
        $scope.reloading = [];
        Tags.getTags(function(response){
            $scope.tagList = response.content;
        })
        $scope.view = false;
        $scope.uploadEnable=false;
        $scope.ns = [];
        getPreviousSessions.get(function(response){
            $scope.ns = response;
            for(var index = 0; index< $scope.ns.length; index++)
                $scope.reloading[index] = true;
        });
        $scope.uploadFile = function(){
            if(file!=null)
                $scope.uploadedCSV = false;
            $scope.tagList = [];
            var previousFile;
            var file = $scope.myFile;
            console.log(file);
            var reader = new FileReader();
            reader.onload = function(e) {
                var tagsInFile = reader.result.split("\n");
                for(var x= 0;x<tagsInFile.length;x++)
                    $scope.tagList.push(tagsInFile[x]);
            }
            reader.readAsText(file);
            console.log('file is ' );
            console.dir(file);
            var uploadUrl = GLOBAL_URL+"/tags/";
            fileUpload.uploadCSVToUrl(file, uploadUrl,function(viewFlag){
                $scope.uploadedCSV = true;
                console.log(viewFlag);
                $scope.view = viewFlag;
                $scope.$apply();
            });
        };
        $scope.reloadTags = function(appSessionId,index){
            //var file = $scope.myAudioFile;
            console.log(index);
            $scope.uploadEnable=true;
            //onsole.log(appSessionId+": "+index);
            //console.log('index is '+index);
            $scope.reloading[index] = false;
            $scope.tags[index]="";
            var uploadUrl = GLOBAL_URL+"/recordings/";
            getPreviousSessions.delete(appSessionId, index, function(index1, response1){
                //console.log(response1);
                if(response1!=""){
                    fileUpload.pollForStatus(appSessionId,index,function(response2){
                        console.log(response2);
                        if(response2.response.tags.length>0){                            
                            //console.log("No. of tags: "+response2.response.tags.length+" index:"+response2.index);
                            $scope.tags[response2.index] = response2.response.tags;
                        }
                        else{
                            $scope.tags[response2.index] = [{"text_eng":"No Tags received"}];
                        }
                        $scope.uploadEnable=false;
                        $scope.reloading[response2.index] = true;
                        $scope.$apply();
                    });
                }
                else{
                    console.log(response);
                    $scope.tags[index] = [{"text_eng":"No Tags received"}];
                    $scope.reloading[index] = true;
                    $scope.$apply();
                }
                /*$scope.view = viewFlag;
                $scope.$apply();*/

            });
        }
    }
]);