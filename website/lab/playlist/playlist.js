//
// depends on playlist.css. 
// This function should be invoked with an array like this:
//
// [{  
//     name: 'lodash', 
//     url: '...' 
//  },{  
//     name: 'underscore', 
//     url: '...'
//  }]
//
// it then builds a web page with a playlist. 
//
// 
function playlist(array) {

//
// Builds the page.
// 
	document.body.innerHTML = 
		"<input type='button' value='stop' onclick='execute(-1)' /> "+
		"<div id='playlist' ></div> "+
		"<div id='ifrWrapper'><iframe name='iframe'></iframe></div>";
	
	var divPlaylist = document.getElementById('playlist');
	
	for (var i=0;i<array.length;i++) {
		var d = document.createElement('div');
		d.className = 'playlistItem';
		d.innerHTML = array[i].name;
		d._URL =      array[i].url;
		divPlaylist.appendChild(d);
	}

	//
	// monitorSessionId(id, callback)
	// id - the key id to monitor
	// callback = the function to invoke if the id has a payload.
	//
	// creates a setTimeout-infinite-loop that checks if there is a certain item in the sessionStorage.
	//
	//
	var monitorSessionId = (function () {

		var _id;
		var _callback;

		function loop() {
			if (_id != null) {
				console.log('checking on '+_id);
				var data = sessionStorage.getItem(_id);
				if (data !== null) {
					_callback(data);
				}
			}
			setTimeout(loop, 1000);
		}
		loop();

		return function(id,callback) {
			sessionStorage.removeItem(_id);
			_id = id;
		    _callback = callback;
		};
	})();



	function execute(index, callback) {

	//
	// highlight the correct item.
	//
		 var nodes = divPlaylist.childNodes;
		 for (var i=0;i<nodes.length;i++) {
			 nodes[i].className ='playlistItem';
		 }

		 if (index == -1) {
			 monitorSessionId(null);
			 return;
		 }
	     nodes[index].className ='playlistSel';

	//
	// gets the URL and sets the url of the IFrame.
	//
		 var url = nodes[index]._URL;

		 iframe.window.location.href  = url;

	//
	// now monitors for the response.
	//
	     monitorSessionId(url.substring(url.indexOf('?')), function(payload) {
	    	 callback(index,payload);
	     });
	}


	//
	// play the list.
	//
	function callback(index, content) {
		var nodes = divPlaylist.childNodes;
		nodes[index].innerHTML += '<br>'+ content;
	    if (index+1 == nodes.length) {
	    	execute(-1, function() { });
	    	return;
	    }
		execute(index+1,callback);
	}

	execute(0,callback);

}