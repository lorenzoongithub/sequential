//
// 'Possible' TODOs:
// highlight bracketings (( ))
// emphasize console.log 
//


/**
 * Highlights any JavaScript Code fragment
 * =======================================
 * 
 * This function receives a snippet of JavaScript code and returns a string (representing an HTML fragment which will render itself nicely in the browser) 
 * See how the multi-line string below gets transformed:
 *
 * function f(i) {           <span style='font-weight:bold'>function</span> f(i) {     
 *   // i am comment            <span style='color:green'>// I am comment</span>    
 *   return i < 10;             <span class='font-weight:bold'>return</span> i &lt; 10; 
 * }                         }
 *
 * 
**/
highlightCodeFragment = (function() {
	
	var kwd =    '<span style="color:purple">';
	var errCmm = '<span style="font-style:italic;color:red">';
	var errStr = '<span style="color:red">';
	var cmt =    '<span style="font-style:italic;color:green">';
	var stg =    '<span style="color:blue">';
	
	// keyword separator examples: "function(", "try{", 
	var isKeywordSeparator = function(ch) { 
		return ch === ' ' || 
		       ch === '(' || 
		       ch === '{' || 
		       ch === ';' || 
		       ch === '\n'  
	};
	
	// Finds the end index for a String litteral. 
	// It assumes that code.indexOf(ix) is either a singlequote or a doublequote.
	// Returns a negative value if the String is non-terminated (we stumble on a new line)
	// 
	function indexOfStringEnd(code,ix) {
		var quote = code.charAt(ix); 
		for (var j=ix+1;j<code.length;j++) {
			var x0 = code.charAt(j); 
			var x1 = code.charAt(j+1); 
			if (x0 === '\n' )                { return -j; } 
			if (x0 === '\\' && x1 === '\\')  { j+=1; continue; }
			if (x0 === '\\' && x1 === quote) { j+=1; continue; }
			if (x0 === quote) { return j+1; }
		}
	}
	
	function findURLendIndex(str, start, prefix) {
		if (prefix === '"')    return str.indexOf('"', start);
		if (prefix === "'")    return str.indexOf("'", start);
		if (prefix === '&lt;') return str.indexOf('&gt;', start);
		if (prefix === ' ') {
			var i = str.indexOf(' ',  start);
			var j = str.indexOf('\n', start);
			if (i===-1 && j===-1) return str.length;
			if (i===-1) return j;
			if (j===-1) return i;
			return Math.min(i,j); 
		}
		return -1;
	}
	
	//
    // linkify the given string.
    // nice and simple algorithm to recognize a http URL in a string, wrapping it in a <a href='link'>link</a>
    // 
    function linkify(str) {
       	var response = '';
		for (var i=0;i<str.length;i++) {
			if (str.substring(i,i+7) == "http://" || str.substring(i,i+8) == "https://") {
				var prefix = str.charAt(i-1);
				if (prefix === ';' && str.substring(i-4,i) === '&lt;') { prefix = '&lt;' } // special case for < 
				var ei = findURLendIndex(str, i+7, prefix);
				if (ei !== -1) {
					var link = str.substring(i,ei);
					if (link.length > 10 &&
						link.indexOf('\n')===-1 && 
						link.indexOf(' ')===-1) {
						response+='<a href="'+link+'">'+link+'</a>';
						i = ei-1; 
						continue;
					}
				}
			} 
			response+=str.charAt(i);
		}
		return response; 
	}
	
    return function(code) {
    	
        // encodes the HTML characters in the code <,>,&   e.g if (i<10) { ... } becomes if (i &lt; 10) { ... }
    	// and add a new line (the additional new line helps tokenization and will be stripped out in the returned HTML) 
    	code = code.replace(/&/g, "&amp;")
                   .replace(/</g, "&lt;")
                   .replace(/>/g, "&gt;") + '\n';
    	

    	var response = ''; 
    	for (var i=0;i<code.length-1;i++) {
    		var c0 =  code.charAt(i);
    		var c01 = code.substring(i,i+2);
    		
    		if ( isKeywordSeparator(code.charAt(i+2)) && code.substring(i,i+2) === 'do') { response+=kwd+'do</span>'; i = i+1; continue; }
    		if ( isKeywordSeparator(code.charAt(i+2)) && code.substring(i,i+2) === 'if') { response+=kwd+'if</span>'; i = i+1; continue; }
    		if ( isKeywordSeparator(code.charAt(i+2)) && code.substring(i,i+2) === 'in') { response+=kwd+'in</span>'; i = i+1; continue; }
    		if ( isKeywordSeparator(code.charAt(i+3)) && code.substring(i,i+3) === 'for') { response+=kwd+'for</span>'; i = i+2; continue; }
    		if ( isKeywordSeparator(code.charAt(i+3)) && code.substring(i,i+3) === 'let') { response+=kwd+'let</span>'; i = i+2; continue; }
    		if ( isKeywordSeparator(code.charAt(i+3)) && code.substring(i,i+3) === 'new') { response+=kwd+'new</span>'; i = i+2; continue; }
    		if ( isKeywordSeparator(code.charAt(i+3)) && code.substring(i,i+3) === 'try') { response+=kwd+'try</span>'; i = i+2; continue; }
    		if ( isKeywordSeparator(code.charAt(i+3)) && code.substring(i,i+3) === 'var') { response+=kwd+'var</span>'; i = i+2; continue; }
    		if ( isKeywordSeparator(code.charAt(i+4)) && code.substring(i,i+4) === 'case') { response+=kwd+'case</span>'; i = i+3; continue; }
    		if ( isKeywordSeparator(code.charAt(i+4)) && code.substring(i,i+4) === 'else') { response+=kwd+'else</span>'; i = i+3; continue; }
    		if ( isKeywordSeparator(code.charAt(i+4)) && code.substring(i,i+4) === 'enum') { response+=kwd+'enum</span>'; i = i+3; continue; }
    		if ( isKeywordSeparator(code.charAt(i+4)) && code.substring(i,i+4) === 'eval') { response+=kwd+'eval</span>'; i = i+3; continue; }
    		if ( isKeywordSeparator(code.charAt(i+4)) && code.substring(i,i+4) === 'null') { response+=kwd+'null</span>'; i = i+3; continue; }
    		if ( isKeywordSeparator(code.charAt(i+4)) && code.substring(i,i+4) === 'this') { response+=kwd+'this</span>'; i = i+3; continue; }
    		if ( isKeywordSeparator(code.charAt(i+4)) && code.substring(i,i+4) === 'TRUE') { response+=kwd+'TRUE</span>'; i = i+3; continue; }
    		if ( isKeywordSeparator(code.charAt(i+4)) && code.substring(i,i+4) === 'void') { response+=kwd+'void</span>'; i = i+3; continue; }
    		if ( isKeywordSeparator(code.charAt(i+4)) && code.substring(i,i+4) === 'with') { response+=kwd+'with</span>'; i = i+3; continue; }
    		if ( isKeywordSeparator(code.charAt(i+5)) && code.substring(i,i+5) === 'await') { response+=kwd+'await</span>'; i = i+4; continue; }
    		if ( isKeywordSeparator(code.charAt(i+5)) && code.substring(i,i+5) === 'break') { response+=kwd+'break</span>'; i = i+4; continue; }
    		if ( isKeywordSeparator(code.charAt(i+5)) && code.substring(i,i+5) === 'catch') { response+=kwd+'catch</span>'; i = i+4; continue; }
    		if ( isKeywordSeparator(code.charAt(i+5)) && code.substring(i,i+5) === 'class') { response+=kwd+'class</span>'; i = i+4; continue; }
    		if ( isKeywordSeparator(code.charAt(i+5)) && code.substring(i,i+5) === 'const') { response+=kwd+'const</span>'; i = i+4; continue; }
    		if ( isKeywordSeparator(code.charAt(i+5)) && code.substring(i,i+5) === 'FALSE') { response+=kwd+'FALSE</span>'; i = i+4; continue; }
    		if ( isKeywordSeparator(code.charAt(i+5)) && code.substring(i,i+5) === 'super') { response+=kwd+'super</span>'; i = i+4; continue; }
    		if ( isKeywordSeparator(code.charAt(i+5)) && code.substring(i,i+5) === 'throw') { response+=kwd+'throw</span>'; i = i+4; continue; }
    		if ( isKeywordSeparator(code.charAt(i+5)) && code.substring(i,i+5) === 'while') { response+=kwd+'while</span>'; i = i+4; continue; }
    		if ( isKeywordSeparator(code.charAt(i+5)) && code.substring(i,i+5) === 'yield') { response+=kwd+'yield</span>'; i = i+4; continue; }
    		if ( isKeywordSeparator(code.charAt(i+6)) && code.substring(i,i+6) === 'delete') { response+=kwd+'delete</span>'; i = i+5; continue; }
    		if ( isKeywordSeparator(code.charAt(i+6)) && code.substring(i,i+6) === 'export') { response+=kwd+'export</span>'; i = i+5; continue; }
    		if ( isKeywordSeparator(code.charAt(i+6)) && code.substring(i,i+6) === 'import') { response+=kwd+'import</span>'; i = i+5; continue; }
    		if ( isKeywordSeparator(code.charAt(i+6)) && code.substring(i,i+6) === 'public') { response+=kwd+'public</span>'; i = i+5; continue; }
    		if ( isKeywordSeparator(code.charAt(i+6)) && code.substring(i,i+6) === 'return') { response+=kwd+'return</span>'; i = i+5; continue; }
    		if ( isKeywordSeparator(code.charAt(i+6)) && code.substring(i,i+6) === 'static') { response+=kwd+'static</span>'; i = i+5; continue; }
    		if ( isKeywordSeparator(code.charAt(i+6)) && code.substring(i,i+6) === 'switch') { response+=kwd+'switch</span>'; i = i+5; continue; }
    		if ( isKeywordSeparator(code.charAt(i+6)) && code.substring(i,i+6) === 'typeof') { response+=kwd+'typeof</span>'; i = i+5; continue; }
    		if ( isKeywordSeparator(code.charAt(i+7)) && code.substring(i,i+7) === 'default') { response+=kwd+'default</span>'; i = i+6; continue; }
    		if ( isKeywordSeparator(code.charAt(i+7)) && code.substring(i,i+7) === 'extends') { response+=kwd+'extends</span>'; i = i+6; continue; }
    		if ( isKeywordSeparator(code.charAt(i+7)) && code.substring(i,i+7) === 'finally') { response+=kwd+'finally</span>'; i = i+6; continue; }
    		if ( isKeywordSeparator(code.charAt(i+7)) && code.substring(i,i+7) === 'package') { response+=kwd+'package</span>'; i = i+6; continue; }
    		if ( isKeywordSeparator(code.charAt(i+7)) && code.substring(i,i+7) === 'private') { response+=kwd+'private</span>'; i = i+6; continue; }
    		if ( isKeywordSeparator(code.charAt(i+8)) && code.substring(i,i+8) === 'continue') { response+=kwd+'continue</span>'; i = i+7; continue; }
    		if ( isKeywordSeparator(code.charAt(i+8)) && code.substring(i,i+8) === 'debugger') { response+=kwd+'debugger</span>'; i = i+7; continue; }
    		if ( isKeywordSeparator(code.charAt(i+8)) && code.substring(i,i+8) === 'function') { response+=kwd+'function</span>'; i = i+7; continue; }
    		if ( isKeywordSeparator(code.charAt(i+9)) && code.substring(i,i+9) === 'arguments') { response+=kwd+'arguments</span>'; i = i+8; continue; }
    		if ( isKeywordSeparator(code.charAt(i+9)) && code.substring(i,i+9) === 'interface') { response+=kwd+'interface</span>'; i = i+8; continue; }
    		if ( isKeywordSeparator(code.charAt(i+9)) && code.substring(i,i+9) === 'protected') { response+=kwd+'protected</span>'; i = i+8; continue; }
    		if ( isKeywordSeparator(code.charAt(i+10)) && code.substring(i,i+10) === 'implements') { response+=kwd+'implements</span>'; i = i+9; continue; }
    		if ( isKeywordSeparator(code.charAt(i+10)) && code.substring(i,i+10) === 'instanceof') { response+=kwd+'instanceof</span>'; i = i+9; continue; }
    		
    		if (c0 === '\'' || c0 === '"') {
    			var j = indexOfStringEnd(code, i);
    			if (j > 0) {
    				response+= stg+linkify(code.substring(i,j))+"</span>";
    			} else {
    				j = -j;
    				response+= errStr+code.substring(i,j)+"</span>";
    			}
    			i=j-1;
    		} else if (c01 === '//') {
    			for (var j=i+1;j<code.length;j++) {
    				var x0 = code.charAt(j); 
    				if (x0 === '\n') {
    					response+= cmt+linkify(code.substring(i,j))+"</span>";
    					i=j-1;
    					break; 
    				}
    			}
    		} else if (c01 === '/*') {
    			for (var j=i+1;j<code.length;j++) {
    				var x0 = code.charAt(j); 
    				var x01 = code.substring(j,j+2); 
    				if (j === code.length-1) {
    					response+= errCmm+code.substring(i,j)+"</span>";
    					i=j-1;
    					break; 
    				}
    				if (x01 === '*/') {
    					response+= cmt+linkify(code.substring(i,j))+"*/</span>"; // ??? this could be multiline ???
    					i=j+1;
    					break; 
    				}
    			}
    		} else {
    			response+=c0;
    		}
    	} 
    	return response; 
    }
})();