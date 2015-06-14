//
// Loads asynchronously a github gist from its id.
//
// The payload in the callback might look like this (if the gist is loaded successfully):
//
// { id:'my test', fileContent:'var i=0;\nvar j=0;\n...', originator: 'https://gist.github.com/9ff7fb6a86cbdf3028a4' }  
//
// or like this (if the gist was not found or we timed-out)
//
// { id:'my test', error:'GitHub:[message]' }
// { id:'my test', error:'timeout' }
//
function loadGistGitHub(id, callback) {
	
	setTimeout(function() { // monitors for a timeout.
		if (window.myCallback == null) return; // the callback was already invoked.
		window.myCallback = function() { ; }   // In case the callback eventually will occur... well too late, let's ignore it.
		callback({id:id, errorMessage: 'timeout' });
	},10000);
	
    window.myCallback = function(oj) {
    	delete window.myCallback; // remove it as soon as we got the callback.
    	if (oj.data.message) {
            // not found. 
            callback({id: id, errorMessage: 'GitHub:'+oj.data.message });
            return;
        }
        var files = oj.data.files;
        for (var i in files) {
            var f = files[i];
            callback({ id: f.filename,content: f.content,originator:oj.data.html_url});     
            return; 
        }
    };
        
    var script =   document.createElement('script'); 
    script.type  = 'text/javascript';
    script.async = true;
    script.src   = 'https://api.github.com/gists/'+id+'?callback=myCallback';

    var entry = document.getElementsByTagName('script')[0];
    entry.parentNode.insertBefore(script, entry);
}
