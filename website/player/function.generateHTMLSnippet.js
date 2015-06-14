//
// This is a isomorphic function that generates the html snippet. 
// 
function generateHTMLSnippet(statements) {
	
		
	// taken from: http://jsperf.com/htmlencoderegex/38
	// encodes the html parts. 
	// htmlEncode('<b>bold</b>') ==> '&lt;b&gt;bold</b>'
	function htmlEncode(html) {
		                                       // NOTE IS IT OKAY TO LEAVE DOUBLE QUOTES ??? " (need to check !!!) 	// I MUST CHECK http://underscorejs.org/#escape
		return html.replace(/&/g, '&amp;', "g")/*.replace(/"/g, '&quot;', "g")*/.replace(/'/g, '&#39;', "g").replace(/</g, '&lt;', "g").replace(/>/g, '&gt;', "g");
	}
	
	//
	// This code was derived  from https://github.com/bryanwoods/autolink-js/blob/master/autolink.js
	//
	// Replaces url in comments so that they become links. 
	// Example: 
	// 'go to http://www.google.com/'
	// 'go to <a href="http://www.google.com/">http://www.google.com/</a>'
	function URLify(s) {
		var pattern = /(^|[\s\n])((?:https?):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;
		return s.replace(pattern, "$1<a style='color:blue'  target='_top' href='$2'>$2</a>");
	}
		
	
	var str = 
		'<!DOCTYPE html>'+
		'<html><head>'+
		'<link href="yolpo.css" rel="stylesheet" type="text/css">'+
		'</head>'+
		'<body>'+
		'<div id="divProgressBar"><div id="divProgressBarTongue"></div></div>'+
		'<div id="divResult"></div>'+
		'<div id="divMain"><table id="tt">'+
	    '<tbody>';
	
	var lineCount = 1; 
	for (var i=0;i<statements.length;i++) {
		str+='<tr>';
		if (statements[i].type === 0) {
			str+='<td id="L'+(i+1)+'" class="LN" data-LN="'+(lineCount)+'"></td>'; // normal
			str+='<td>';
			str+=htmlEncode(statements[i].code);
			str+='</td>';
			lineCount++;
		} else if (statements[i].type === 1) {
			str+='<td id="L'+(i+1)+'" class="CM"></td>'; // comment
			str+='<td class="CM2">';
			str+=URLify(htmlEncode(statements[i].code));
			str+='</td>';
		}
		str+='</tr>';
	}
	str+='</tbody></table></div>';
	str+='<script src="yolpo.js"></script>';
	str+='</body></html>';
	return str;
}