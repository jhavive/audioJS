angular.module("directive",[])
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
          
            element.bind('change', function(){
                scope.$apply(function(){
                    for(var i=0;i<element.length;i++)
                        modelSetter(scope, element[i].files[i]);
                });
            });
        }
    };
 }])
.directive('tags',[
    '$window',
    function($window){
        return {
            restrict:'EA',
            scope:{
                tagObject:"<",
                audioFile:"<"
            },
            template: '<div class="row"><div class="col-md-6" style="text-align: center !important;"><audio controls  style="visibility:hidden"></audio></div><div class="col-md-6">'+
            '<ul>'+
            '<li ng-repeat="tag in tagObject track by $index" ng-click=changeAudioLocation($index) ng-if="tag.time_sec">{{tag.text_eng}} ({{tag.time_sec | tagsTiming}} seconds)</li>'+
            '<li ng-repeat="tag in tagObject track by $index" ng-click=changeAudioLocation($index) ng-if="!tag.time_sec">{{tag.text_eng}} </li>'+
            '</ul></div></div>',
            link:function(scope, elem, attrs) 
            {
                scope.$watch('tagObject',function(){
                    var source;
                    var url = $window.URL || $window.webkitURL;
                    source = url.createObjectURL(scope.audioFile);
                    var audioPlayer = elem.find('audio')[0];
                    audioPlayer.src = source;
                    audioPlayer.disabled=false;
                    if(scope.tagObject!="")
                        audioPlayer.style.visibility="visible";
                    else{
                        audioPlayer.style.visibility="hidden";
                        /*for(var i=0;i<elem.find('li').length;i++);
                            elem.find('li')[i].remove();*/
                    }
                    /*elem.append('<div><ul>');
                    for(var i=0;i<scope.tagObject.length;i++){
                        elem.append('<li ng-click=changeAudioLocation('+i+')>'+scope.tagObject[i].text_eng+' '+scope.tagObject[i].time_sec+'</li>');
                    }
                    elem.append('</ul></div>');*/
                    scope.changeAudioLocation = function(index){
                        audioPlayer.currentTime = scope.tagObject[index].time_sec;
                        audioPlayer.play();
                    }
                });
            }
        }
    }
])
.directive('reloadtags',[
    '$window','$cookieStore',
    function($window, $cookieStore){
        return {
            restrict:'EA',
            scope:{
                tagObject:"<",
                id:"<"
            },
            template: '<div class="row"><div class="col-md-6" style="text-align: center !important;"><img src="images/giphy.gif" style="height:50px;width:50px;"></img><audio controls  style="visibility:hidden"></audio></div><div class="col-md-6">'+
            '<ul>'+
            '<li ng-repeat="tag in tagObject track by $index" ng-click=changeAudioLocation($index) ng-if="tag.time_sec">{{tag.text_eng}} ({{tag.time_sec | tagsTiming}} seconds)</li>'+
            '<li ng-repeat="tag in tagObject track by $index" ng-click=changeAudioLocation($index) ng-if="!tag.time_sec">{{tag.text_eng}} </li>'+
            '</ul></div></div>',
            link:function(scope, elem, attrs) 
            {
                //scope.$watch('tagObject',function(){
                    var source;
                    var url = $window.URL || $window.webkitURL;
                    //elem.find('audio')[0].style.visibility="visible";
                    var downloader = new Worker('js/audioDownload.js');
                    var audioPlayer = elem.find('audio')[0];
                    //downloader.postMessage({"url":GLOBAL_URL+"/appsessionaudio/?session_id=" + scope.id,"token":$cookieStore.get('authdata')});
                    downloader.postMessage({"url":GLOBAL_URL+"/appsessionaudio/?session_id=" + scope.id,"token":$cookieStore.get('authdata')});
                    downloader.addEventListener('message', function(e) {
                        elem.find('img')[0].style.visibility="hidden";
                        elem.find('img')[0].remove();
                        source = url.createObjectURL(e.data);
                        audioPlayer.src = source;
                        audioPlayer.disabled=false;
                        audioPlayer.style.visibility="visible";
                        /*elem.find('img')[0].style.visibility="hidden";
                        elem.find('img')[0].remove();*/
                    }, false);    
                    scope.changeAudioLocation = function(index){
                        audioPlayer.currentTime = scope.tagObject[index].time_sec;
                        audioPlayer.play();
                    }   
                //});
            }
        }
    }
])
angular.module("directive")
.directive( 'player', function ($window,$cookieStore) {
    return {
        restrict: 'E',
        transclude: 'true',
        scope: {
            id:'<'
        },
        template: '<div class="row" style="margin-left:auto;margin-right:auto;visibility:visible"><img src="images/giphy.gif" style="height:50px;width:50px;visibility:hidden"></img></div>'+
        '<div class="row" style="margin-left:auto;margin-right:auto;visibility:hidden">'+
        '<div class="col-md-12"><audio controls  type="audio/mp4"></audio></div>'+
        '</div>',
        link: function(scope, elem, attrs) 
        {
            //console.log(scope);
            var source;
            var url = $window.URL || $window.webkitURL;
            var downloader = new Worker('js/audioDownload.js');
            //downloader.postMessage({"url":GLOBAL_URL+"/appsessionaudio/?session_id=" + scope.id,"token":$cookieStore.get('authdata')});
            downloader.postMessage({"url":GLOBAL_URL+"/appsessionaudio/?session_id=" + scope.id,"token":$cookieStore.get('authdata')});
            downloader.addEventListener('message', function(e) {
                source = url.createObjectURL(e.data);
                console.log(source);
                elem.find('audio')[0].src = source;
                elem.find('audio')[0].disabled=false;
                elem.find('audio')[0].style.visibility="visible";
                elem.find('a')[0].href = source;
                elem.find('a')[0].download = scope.id+'.m4a';
                elem.find('a')[0].disabled=false;
                elem.find('a')[0].style.visibility="visible";
                uploadAudio(myAudioFile,$index);
                elem.find('img')[0].style.visibility="hidden";
                elem.find('img')[0].remove();
            }, false);
        }
    }
})
;