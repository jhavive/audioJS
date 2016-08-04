var timestamp = 0;
var count = 0;
onmessage=function(details)
{
	var http = new XMLHttpRequest();
	var token = details.data.token;
	var url = details.data.url;
	var uploader=new Uploader();
	http.open("GET", url, true);
	http.responseType = "arraybuffer";
	http.setRequestHeader("Accept","*/*")
	http.setRequestHeader("Authorization", 'Token '+token);
	http.send();
	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == 4 && (http.status == 201||http.status == 200)) {
	        var return_object= new Blob([http.response], { type: 'audio/mp4' });
		    self.postMessage(return_object);
		    close();
	    }
	    else if(http.readyState == 4 && http.status != 201)
	    {
	    	var return_object= new Blob([], { type: 'audio/mp4' });
	        self.postMessage(null);
	        close();
	    }

	}
};
var Uploader = function(){
	
};