//https://github.com/janl/mustache.js/blob/master/mustache.js#L60
var entityMap = {
	'&' : '&amp;',
	'<' : '&lt;',
	'>' : '&gt;',
	'"' : '&quot;',
	"'" : '&#39;',
	'/' : '&#x2F;',
	'`' : '&#x60;',
	'=' : '&#x3D;'
};

function escapeHTML(string) {
	return String(string).replace(/[&<>"'`=\/]/g, function(s) {
		return entityMap[s];
	});
}

/**
 {
    "UUID": "e47c3814-57c2-4e6f-92b8-f8132115b6b2",
    "timestamp": "2017-05-04T13:44:33.658Z",
    "statements": ["i=2", "console.log(\"hello\");", "var j=5", "load('http://momentjs.com/static/js/global.js');", "var a = moment();", "a.year(2011);", "console.log(a);", "console.log(j)", "i++", "timeout=6000", "console.debug(timeOut);"],
    "logs": {
        "1": ["hello"],
        "6": ["\"2011-05-04T13:44:33.865Z\""],
        "7": ["5"]
    }
}
**/
function createHTMLSnippet(response) {
	
	var str ='<div class="meta">';
	str+='Recorded on '+response.platform+'\n';
	str+='Executed '+moment(response.timestamp).fromNow()+'\n'
	str+='</div>';
	str+= '<div class="snippet">';
	
	if (response.syntaxError) {
		str+= '<div class="syntaxError">'+escapeHTML(response.syntaxError)+'</div>';
	} else {
		var statements = response.statements;
		var length = statements.length;
		for (var i=0;i<length;i++) {
			str+='<div class="statement">'+highlightCodeFragment(statements[i])+'</div>';
			if (response.logs[i]) {
				str+='<div class="log">'+escapeHTML(response.logs[i].join('\n'))+'</div>';
			}
			if (response.error === i) {
				str+='<div class="error">'+escapeHTML(response.errorMessage)+'</div>';
				str+='<div style="opacity:0.4">';
			}
			if (response.timeout === i) {
				str+='<div class="timeout">timeout</div>';
				str+='<div style="opacity:0.4">';
			}
		}
		if (response.error || response.timeout) { str+='</div>'; }
	}
	
	
	str+='</div>';
	return str; 
}