var requestObject = [];
var requestIndex = [];
var currentAppSessionId ="";
onmessage=function(details)
{
	var http = new XMLHttpRequest();
	var token = details.data.token;
	requestObject.push(details.data.appSessionId);
	requestIndex.push(details.data.index);
	console.log(requestObject);
	console.log(requestIndex);
	var uploader = new Uploader();
	console.log(requestObject.length);
	if(requestObject.length==1){
		var url = "https://dev.liv.ai/liv_speech_api/session/status/?app_session_id="+requestObject[0];
		//console.log(url);
		http.open("GET", url, true);
                http.setRequestHeader("Accept","application/json");
		http.setRequestHeader("Authorization", 'Token '+token);
		http.send();
	}

	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == 4 && (http.status == 201|| http.status == 200)) {
	        var response  = JSON.parse(http.response);
	        console.log(response);
	        if((response.upload_status<0 || (response.upload_status==20&&response.tags_status==true))){
	        	if(response.upload_status<0){
	        		console.log(response);
	        		requestObject.shift();
	        		setTimeout(function(){
        			if(requestObject[0]){
		        		var url = "https://dev.liv.ai/liv_speech_api/session/status/?app_session_id="+requestObject[0];
			        	console.log(requestObject);
						http.open("GET", url, true);
                        http.setRequestHeader("Accept","application/json");
						http.setRequestHeader("Authorization", 'Token '+token);
						http.send();
					}
	        	}, 2000);
	        		self.postMessage({response:{tags:[]},index:requestIndex.shift()});
	        	}
	        	else{
	        		url = "https://dev.liv.ai/liv_speech_api/session/tags/?app_session_id="+requestObject[0];
		        	http.open("GET", url, true);
	                http.setRequestHeader("Accept","application/json");
					http.setRequestHeader("Authorization", 'Token '+token);
					http.send();
	        	}
	        }
	        else if(response.tags==null){
	        	console.log(requestObject[0]);
	        	setTimeout(function(){
	        		if(requestObject[0]){
		        		var url = "https://dev.liv.ai/liv_speech_api/session/status/?app_session_id="+requestObject[0];
						http.open("GET", url, true);
                                                http.setRequestHeader("Accept","application/json");
						http.setRequestHeader("Authorization", 'Token '+token);
						http.send();
					}
	        	}, 2000);
	        }
	        if(response.tags!=null){
				requestObject.shift();
        		setTimeout(function(){
        			if(requestObject[0]){
		        		var url = "https://dev.liv.ai/liv_speech_api/session/status/?app_session_id="+requestObject[0];
			        	console.log(requestObject);
						http.open("GET", url, true);
                        http.setRequestHeader("Accept","application/json");
						http.setRequestHeader("Authorization", 'Token '+token);
						http.send();
					}
	        	}, 2000);
		    	self.postMessage({response:response,index:requestIndex.shift()});
		    }
	    }
	    else if(http.readyState == 4 && (http.status != 201|| http.status!= 200))
	    {
	    	if(requestObject.length!=0){
	    		requestObject.shift();
		    	setTimeout(function(){
			    	if(requestObject[0]){
		        		var url = "https://dev.liv.ai/liv_speech_api/session/status/?app_session_id="+requestObject[0];
			        	console.log(requestObject);
						http.open("GET", url, true);
						http.setRequestHeader("Accept","application/json");
                        http.setRequestHeader("Authorization", 'Token '+token);
						http.send();
					}
	        	}, 2000);
		        self.postMessage({response:{tags:[]},index:requestIndex.shift()});
	    	}
	    }
	}
};
var Uploader = function(){
	
};
