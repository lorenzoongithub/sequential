/**
 * A wrapper for window.location to provide a basic implementation to encode/decode a JavaScript Object
 * (which can be jsonified).
 * It depends on LZString
 * 
 * The first character after the question mark "?" is the letter "Z". This is a minimal attempt to give us room for upgrades on  
 * encoding/decoding algorithm.		 
**/
locationr = {
	read : function() {
		var search = location.search.substring(2); // assume it starts with ?Z
		try {
			return JSON.parse(LZString.decompressFromEncodedURIComponent(search));
		} catch (e) {
			return null; // returns null in any exceptional case: eg. URL which could not be decompressed or not a valid JSON string representation.  
		}
	},
	linkify : function(oj,page) {
		var str = JSON.stringify(oj);
		return page+'?Z'+LZString.compressToEncodedURIComponent(str);
	},
	write : function(oj,page) {
		var str = JSON.stringify(oj);
		location.href = page+'?Z'+LZString.compressToEncodedURIComponent(str);
	},
	replace : function(oj,page) {
		var str = JSON.stringify(oj);
		location.replace(page+'?Z'+LZString.compressToEncodedURIComponent(str)); 
	}
};
