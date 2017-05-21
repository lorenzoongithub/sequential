/**
 * A wrapper for window.location to provide a basic implementation for JSON + URL encoding
 * 
**/
locationr = {
	read : function() {
		var search = location.search.substring(1);
		try {
			return JSON.parse(decodeURIComponent(search));
		} catch (e) {
			return null;
		}
	},
	linkify : function(oj,page) {
		var str = JSON.stringify(oj);
		return page+'?'+encodeURIComponent(str);
	},
	write : function(oj,page) {
		var str = JSON.stringify(oj);
		location.href = page+'?'+encodeURIComponent(str);	
	},
	replace : function(oj,page) {
		var str = JSON.stringify(oj);
		location.replace(page+'?'+encodeURIComponent(str)); 
	}
}