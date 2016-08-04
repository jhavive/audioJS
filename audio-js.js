angular.module("audio",[])
.directive('audioplayer',[

	function(){
		return{
			restrict:'EA',
			scope:{
				src:'<'
			}
			template:'<audio></audio>'+
			'<svg></svg>',
			link: function(scope, elem, attrs) 
	        {
	        	//variables
	        	audioplayer = elem.find('audio')[0];
	        	svg = elem.find('audio')[0];
	            var AUDIO_SOURCE_CORRECT = false;

	            //Assigning the audio tag the audio source
	            if (typeof scope.src == "string"){
	            	audioplayer.src = scope.source;
	            }
	            else if(typeof scope.src == "object"){
	            	try{
		            	var url = $window.URL || $window.webkitURL;
		            	source = url.createObjectURL(scope.src);
		            	audioplayer.src = source;
	            	}
	            	catch(err){
	            		console.log("Audio object not a blob or a file");

	            	}
	            }

	            //Desigining the audio player
	            if(AUDIO_SOURCE_CORRECT){
	            	
	            }


	        }
		}
	}]
)