var timestamp = 0;
var count = 0;
onmessage=function(details)
{
	var http = new XMLHttpRequest();
	var token = details.data.token;
	var url = "https://dev.liv.ai/liv_speech_api/session/tags/?app_session_id="+details.data.appSessionId;
	var uploader = new Uploader();
	http.open("GET", url, true);
	//http.setRequestHeader('Content-Type', 'multipart/form-data');
	http.setRequestHeader("Authorization", 'Token '+token);
	http.send();

	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == 4 && http.status == 201) {
	        var response  = JSON.parse(http.response);
	        console.log(response);
	        self.postMessage({response:response,index:details.data.index});
		    close();
	    }
	    else if(http.readyState == 4 && http.status != 201)
	    {
	    	console.log(http.response);
	        //self.postMessage(false);
	        close();
	    }

	}
};
var Uploader = function(){
	
};