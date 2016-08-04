var timestamp = 0;
var count = 0;
onmessage=function(details)
{
	var http = new XMLHttpRequest();
	var token = details.data.token;
	var url = details.data.url;
	var fd = new FormData();
    if(!details.data.user){
    	console.log("exit");
    	self.postMessage({response:"no user",index:details.data.index});
        close();
    }
	fd.append('user',details.data.user);
   	fd.append('audio_file', details.data.tag_file);
   	fd.append('meta',details.data.tag_file.name);
	fd.append('language','EN');
	var uploader = new Uploader();
	http.open("POST", url, true);
	//http.setRequestHeader('Content-Type', 'multipart/form-data');
    http.setRequestHeader("Accept","application/json");
	http.setRequestHeader("Authorization", 'Token '+token);
	http.send(fd);

	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == 4 && http.status == 201) {
	        var response  = JSON.parse(http.response);
	        //console.log(response);
	        self.postMessage({appSessionId:response.app_session_id,index:details.data.index});
		    close();
	    }
	    else if(http.readyState == 4 && http.status == 403){

	    }
	    else if(http.readyState == 4 && (http.status != 201 || http.status != 403))
	    {
	    	console.log(http.response);
	        self.postMessage({response:"",index:details.data.index});
	        close();
	    }

	}
};
var Uploader = function(){
	
};
