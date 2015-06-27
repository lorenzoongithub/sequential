
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
	
	
	var playMode =        getParam('&autoplay=') || 1;
	var failfast =        getParam('&failfast=');
	
	var totalLines = 1; 
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
	var errorCount = [];       // used only if failfast is 0-disabled. 
	var divResult = document.getElementById('divResult');
	var divProgressBarTongueStyle = document.getElementById('divProgressBarTongue').style;
	
	if (playMode == 0) {
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
	// https://github.com/thirdpartyjs/thirdpartyjs-code/blob/master/examples/templates/02/loading-files/index.html
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
					sessionStorage.setItem(location.search, 'All Done - '+statementCount+' statements, '+totalLines+' lines, 0 errors.');
				} else {
					divResult.style.backgroundColor = '#d9534f';
					divResult.innerHTML = exit+'Done with Errors - '+statementCount+' statements, '+errorCount.length+' errors.<div>'+errorCount.join(' ')+'</div>';
					sessionStorage.setItem(location.search, 'Done with Errors - '+statementCount+' statements, '+errorCount.length+' errors.');
				}
				return;
			}
			

			var elem =   document.getElementById('L'+(i+1));
			var dataLN = elem.getAttribute('data-ln');
			
			divResult.innerHTML = (dataLN == null) ? 'Running ...' : 'Running '+dataLN;
			divProgressBarTongueStyle.width = (100*((1+i)/totalCount))+'%';  
		
		    
			if (totalCount<30) { // TRICK TO MAKE IT GO SLOW 
				if (i<totalCount && trs[i].style.backgroundColor != 'orange') {
					if (i>0)          trs[i-1].style.backgroundColor = 'white'; // COMMENT OUT FOR HAVING A MOVING-LINE VS CURTAIN EFFECT 
					if (i<totalCount) trs[i].style.backgroundColor = 'orange';
					setTimeout(loopy,20); // allows enough time to force a repaint !!!  <-- think logic to enable disable this 
					return;                                                           //  <-- to speed it up
				}
			}
			 
			if (playMode == 2) {
				// in slow motion: don't move the viewport unless the line is not in it.
				function isElementInViewport (el) {
				    var rect = el.getBoundingClientRect();
				    return (
				        rect.top >= 0 &&
				        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
				    );
				}
				if (isElementInViewport(trs[i])==false) {
					divMain.scrollTop  = trs[i].offsetTop;	
				}
			} else {
				// move the viewport
				divMain.scrollTop  = trs[i].offsetTop;	
			}
			
			var node = trs[i].childNodes[1];
			var code = node.textContent || node.innerText; // equivalent to htmlDecode (to do: investigate this solution is fit - see lodash/underscore for a better alternative)
			
			var oj; 
			try {
				oj = (1, eval)( code ); // global eval.
			} catch (ex) {
				elem.style.backgroundColor = '#d9534f'; 
				elem.nextSibling.style.backgroundColor = '#d9534f';
				if (failfast==1) {
					divResult.style.backgroundColor = '#d9534f';
					divResult.innerHTML = 'Failure at <a href="#L'+(i+1)+ '">'+dataLN+'</a> '; 
					sessionStorage.setItem(location.search, 'Failure at '+dataLN);
					return;
				}
				errorCount.push('<a href="#L'+(i+1)+ '">'+dataLN+'</a>');
			}
			
			if (CDR._hasToWait) {
				if (CDR._loopOnLineNumber[i] === undefined) CDR._loopOnLineNumber[i]=0;
				CDR._loopOnLineNumber[i]++;
				if (CDR._loopOnLineNumber[i] == CDR._maxNumberOfIterations) {
					var elem = document.getElementById('L'+(i+1));
					elem.style.backgroundColor = '#f0ad4e'; 
					elem.nextSibling.style.backgroundColor = '#f0ad4e';
					divResult.innerHTML = 'Timeout on line <a href="#L'+(i+1)+ '">'+dataLN+'</a>';
					sessionStorage.setItem(location.search,'Timeout on line '+dataLN); 
					return; 
				}
				setTimeout(loopy,50); // replay the line in a bit. 
				return; 
			}
			
			i++;
			
			if (playMode == 2) { // SLOW MOTION
				if (oj !== undefined) {
					elem.nextSibling.innerHTML += '<span class="spanInterimResult">'+oj+'</span>'
				}
				if (i-1>0)          trs[i-2].style.backgroundColor = 'white'; // COMMENT OUT FOR HAVING A MOVING-LINE VS CURTAIN EFFECT 
				if (i-1<totalCount) trs[i-1].style.backgroundColor = 'orange';
				setTimeout(loopy,1000); 
				return;
			}
			
			var now = +new Date();
			if (now - start > 100) {
				break;
			} 
		}
		setTimeout(loopy,20);
	};
    loopy();
})();