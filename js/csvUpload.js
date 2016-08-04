var timestamp = 0;
var count = 0;
onmessage=function(details)
{
	console.log("aya re");
	var http = new XMLHttpRequest();
	var token = details.data.token;
	var url = details.data.url;
	var fd = new FormData();
        console.log(details.data.user);
	fd.append('user',details.data.user);
   	fd.append('tag_file', details.data.tag_file);
	fd.append('language','EN');
	var uploader = new Uploader();
	http.open("POST", url, true);
        http.setRequestHeader("Accept","application/json");
	http.setRequestHeader("Authorization", 'Token '+token);
	http.send(fd);

	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == 4 && http.status == 201) {
	        var response  = JSON.parse(http.response);
	        console.log(response.status);
	        if(response.status=="success")
		    	self.postMessage(true);
		    else
		    	self.postMessage(false);
		    close();
	    }
	    else if(http.readyState == 4 && http.status != 201)
	    {
	        self.postMessage(false);
	        close();
	    }

	}
};
var Uploader = function(){
	
};
