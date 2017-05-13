/**
 * sequential receives an array of strings (statements) like this: ['i=0','i++','console.log(i);']
 * and executes each of them sequentially.
 * Once completed, it calls (asynchronously or synchronously) the callback function with a response like this: 
 *    
 *    {
 *       "statements": ["i=0", "i++","console.log(i);" ],
 *       "logs": {
 *           "2": ["1"]
 *       }
 *    }
 * 
 * 
 * note: sequential brutally overrides console.log
 * 
 * requires 'stringifyObject' to serialize the logs.
 *  
**/
function sequential(stringifyObject, statements, callback) {
	
	var errorOnExternalScript = false; 
	
	// brutally overrides onerror
	window.onerror =  function() {
		// the only reasons for being here is that the external script is broken
		errorOnExternalScript = true; 
	}
	
	var response = {
		statements : statements, // <-- assumes it's an array of strings and immutable. 
		logs : {}
	}
	
	if (statements.length == 0) {
		callback(response);
		return; 
	}
	

    // I check for existance of console (really required ?)
	if (!window.console) console = {};

	// brutally overrides console.log
	console.log = function(object) {
		// TODO: The stringification needs to improve !!!
		// var value = typeof object == 'string' ? object : JSON.stringify(object); 
		var value = (typeof object == 'string') ? object : stringifyObject(object); // <-- now we use stringifyObject.js
	    if (response.logs[lineNo]) response.logs[lineNo].push(value); 
		else                       response.logs[lineNo] = [ value ];  
	}

	// Note: since the statements will have access to these variables, that is start, lineNo, timeOut
	//       should we prefix them with _ or something to treat them specially. 
	
	var REPEAT = {}; // this is used by waitUntil and load
	var start = new Date().getTime();               
	var lineNo = 0;                                 
	
	timeOut = 5000; // GLOBAL
	 
	
	waitUntil = function(flag) {
		if (flag == true) return;
		return REPEAT; 
	}

	var loadedURLs = {}
	
	// https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html
	load = function(url) {
		if (loadedURLs[url]) { return; }
		var callback = function() { loadedURLs[url] = 1; }
		var script = document.createElement('script'); 
		script.type  = 'text/javascript';
		script.async = true;
		script.src   = url
		var entry = document.getElementsByTagName('script')[0];
		entry.parentNode.insertBefore(script, entry);
		if (script.addEventListener) {
		    script.addEventListener('load', callback, false);
		} else {
		    script.attachEvent('onreadystatechange', function() {
			    if (/complete|loaded/.test(script.readyState)) callback();
		    });
		}
		return REPEAT;
	};
	
	(function loopy() {
		while (true) {
			if (new Date().getTime() - start  > timeOut ) {
				response.timeout = lineNo; 
				callback(response);
				return; 
			} 
			try {
				if ( ((1, eval) (statements[lineNo])) === REPEAT) { // global eval 
					setTimeout(loopy,100);                          // retry after 100ms
					return;	
				}   
			} catch (e) { // Note the exception can only catch the eval execution.
				response.error = lineNo; 
				response.errorMessage = e+'';
				callback(response); 
				return; 
			}
			if (errorOnExternalScript) {                            
				response.error = lineNo;                            
				response.errorMessage = 'error on external script';
				callback(response);
				return; 
			}
			if (++lineNo === statements.length) {
				callback(response);
				return; 
			}
		}
	})(); 
}   