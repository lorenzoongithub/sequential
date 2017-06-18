
//
// when the oembed service is called it will return an HTML like this: 
// <script src='embed.js?Zaaaa12'></script>
//  
// embed.js is responsible of
// - finding itself 
// - extract the zip content (to work out height of iframe)
// - create an iframe (same src of the script but embed.html instead of embed.js) 
// - wrap the iframe into a div which gets added near the script itself.
//


(function() {
	var scripts = document.getElementsByTagName("script")
	var script = null; 
	for (var i = 0; i < scripts.length; ++i) {
		var x = scripts[i];
		console.log(x.src);
		if (x.src.indexOf('embed.js?') == -1) continue; // skip: it's some other script.
		var elem = x.nextElementSibling;
		if (elem != null && elem.className == 'embed-js') continue;  // skip: we handled this script already. 
		script = x;
		break;
	}
	if (script == null) {
		console.log('error: invoked wrongly. Since we could not find the script'); 
		return; // error: we could not find the script 
	}
	var zip = x.src.substring( x.src.indexOf('embed.js?') + 8 );
	 
	var height = 300; // for now.
	
	console.log('embed.js - setting the iframe height to '+height);
	
	var iframe = document.createElement('iframe');
	iframe.src = script.src.replace('/embed.js','/embed.html');
	iframe.style.border = 'none';
    iframe.style.height = height+'px';
    iframe.style.width = '100%';
    iframe.style.overflow = 'hidden';
    iframe.style.verticalAlign = 'bottom';
    iframe.setAttribute('allowTransparency', true);
    iframe.setAttribute('frameBorder', 0);
    iframe.setAttribute('tabIndex', 0);
    iframe.setAttribute('scrolling', 'yes');
	var div = document.createElement('div');
	div.className = 'embed-js';
	div.style.width = '500px';
	div.style.height = height+'px';
	div.appendChild(iframe); 
	script.parentNode.insertBefore(div, script.nextSibling);
})();