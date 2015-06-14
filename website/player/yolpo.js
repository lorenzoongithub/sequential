
(function() {
    var search = location.search;  

	// This function is quite brittle and works under several assumptions.
	// - no enconding is required for keys and values
    // - keys are begin with & and end with =  e.g. '&mode='
    // - same keys are no repeated
	// - URL always has a search. 
	// 
    // 
	// getParam('?id=1&mode=on&ui=black', '&mode=') === 'on' 
	//
	function getParam(key) {
		var index = search.indexOf(key);
		if (index == -1) return '';
		var endIndex = search.indexOf('&',1+index); 
		return (endIndex == -1) ? search.substring(index+key.length) : search.substring(index+key.length,endIndex);  
	}
	
	
	var p_autoplay =        getParam('&autoplay=') || '1';
	var p_failfast =        getParam('&failfast=');
	
	var totalLines = 0; 
	var tempCode = sessionStorage.code; // ??? Accessing the session.
	for (var i=0;i<tempCode.length;i++) {
		if (tempCode.charAt(i)==='\n') totalLines++; 
	}
	
	var trs = document.getElementsByTagName('tr');
	var totalCount = trs.length; 
	var statementCount = 0;
	for (i=0;i<totalCount;i++) {
		if (trs[i].childNodes[0].className==='LN') { statementCount++; }
	}
	var errorCount = [];       // used only if p_failfast is 0-disabled. 
	var divResult = document.getElementById('divResult');
	var divProgressBarTongueStyle = document.getElementById('divProgressBarTongue').style;
	
	if (p_autoplay == '' || p_autoplay == 0) {
		divResult.innerHTML = statementCount+' statements, '+totalLines+' lines.'	
		return; // EXIT IMMEDIATELY NOTHING TO RUN.
	} 
	
	
	
	var i=0;

	var CDR = {
		_loadedURLs : {},
		_loopOnLineNumber : {},
		_maxNumberOfIterations : 100 
	};
	
	// global definition for waitUntil
	waitUntil = function(flag) {
		if (flag == false) CDR._hasToWait = true; 
		else               CDR._hasToWait = false; 
	}


	// global definition for load.
	//https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html
	load = function(url) {
		if (CDR._loadedURLs[url]) {
			CDR._hasToWait = false; 
			return; 
		}
		CDR._hasToWait = true;
		
		var callback = function() {
			CDR._loadedURLs[url] = 1;
		};
		
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
	}
	
	var exit = '<span title="Close the banner" style="float:right;cursor:pointer;" onclick="this.parentNode.style.display=\'none\'">&#x2716</span>';

	function loopy() {
		var start = +new Date();
		while (1) {
			if (i===totalCount) {
				if (i>0) trs[i-1].style.backgroundColor = 'white'; // COMMENT OUT FOR HAVING A MOVING-LINE VS CURTAIN EFFECT 
				divProgressBarTongueStyle.width = '100%';
				divProgressBarTongueStyle.backgroundColor = 'green';
				if (errorCount.length == 0) {
					divResult.innerHTML = exit+'All Done - '+statementCount+' statements, '+totalLines+' lines, 0 errors.';
				} else {
					divResult.style.backgroundColor = '#d9534f';
					divResult.innerHTML = exit+'Done with Errors - '+statementCount+' statements, '+errorCount.length+' errors.<div>'+errorCount.join(' ')+'</div>';
				}
				return;
			}
			
			divResult.innerHTML = 'Running '+(1+i);
			divProgressBarTongueStyle.width = (100*((1+i)/totalCount))+'%';  
		
		    
			if (totalCount<30) { // TRICK TO MAKE IT GO SLOW 
				if (i<totalCount && trs[i].style.backgroundColor != 'orange') {
					if (i>0)          trs[i-1].style.backgroundColor = 'white'; // COMMENT OUT FOR HAVING A MOVING-LINE VS CURTAIN EFFECT 
					if (i<totalCount) trs[i].style.backgroundColor = 'orange';
					divResult.innerHTML = 'Running '+(1+i);
					divProgressBarTongueStyle.width = (100*((1+i)/totalCount))+'%';  
					setTimeout(loopy,20); // allows enough time to force a repaint !!!  <-- think logic to enable disable this 
					return;                                                           //  <-- to speed it up
				}
			}
			
			// moves the screen 
			divMain.scrollTop  = trs[i].offsetTop;
			
			var node = trs[i].childNodes[1];
			var code = node.textContent || node.innerText; // equivalent to htmlDecode (to do: investigate this solution is fit - see underscore for a better alternative)
			
			var elem = document.getElementById('L'+(i+1));
			
			
			var oj; 
			try {
				oj = (1, eval)( code ); // global eval.
			} catch (ex) {
				elem.style.backgroundColor = '#d9534f'; 
				elem.nextSibling.style.backgroundColor = '#d9534f';
				if (p_failfast==1) {
					divResult.style.backgroundColor = '#d9534f';
					divResult.innerHTML = 'Failure at <a href="#L'+(i+1)+ '">'+elem.getAttribute('data-ln')+'</a> '; 
					return;
				}
				errorCount.push('<a href="#L'+(i+1)+ '">'+elem.getAttribute('data-ln')+'</a>');
			}
			
			if (CDR._hasToWait) {
				if (CDR._loopOnLineNumber[i] === undefined) CDR._loopOnLineNumber[i]=0;
				CDR._loopOnLineNumber[i]++;
				if (CDR._loopOnLineNumber[i] == CDR._maxNumberOfIterations) {
					var elem = document.getElementById('L'+(i+1));
					elem.style.backgroundColor = '#f0ad4e'; 
					elem.nextSibling.style.backgroundColor = '#f0ad4e';
					divResult.innerHTML = 'Timeout on line <a href="#L'+(i+1)+ '">'+(i+1)+'</a>';
					return; 
				}
				setTimeout(loopy,50); // replay the line in a bit. 
				return; 
			}
			
			i++;
			
			var now = +new Date();
			if (now - start > 100) {
				break;
			} 
		}
		
		setTimeout(loopy,20);
		
	};
    loopy();

})();