angular.module("audio",[])
.directive('audioplayer',[

	function(){
		return{
			restrict:'EA',
			template:'<audio></audio>'+
			'<svg></svg>',
			link: function(scope, elem, attrs) 
	        {
	            //console.log(scope);
	            var source;
	            var url = $window.URL || $window.webkitURL;
	            var downloader = new Worker('audio.js');
	            downloader.postMessage({"url":GLOBAL_URL+"/appsessionaudio/playback/?session_id=" + scope.id,"token":$cookieStore.get('authdata')});
	            downloader.addEventListener('message', function(e) {
	                source = url.createObjectURL(e.data);
	                elem.find('audio')[0].src = source;
	                elem.find('audio')[0].disabled=false;
	                elem.find('audio')[0].style.visibility="visible";
	                elem.find('a')[0].href = source;
	                elem.find('a')[0].download = scope.id+'.m4a';
	                elem.find('a')[0].disabled=false;
	                elem.find('a')[0].style.visibility="visible";
	                elem.find('img')[0].style.visibility="hidden";
	                elem.find('img')[0].remove();


	                var svg = elem.find('svg')[0];
	                
	            }, false);
	        }
		}
	}]
)