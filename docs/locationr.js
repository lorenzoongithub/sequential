/**
 *
 *
 *
**/
locationr = {
	read : function() {
		var search = location.search.substring(1);
		try {
			return JSON.parse(decodeURI(search));
		} catch (e) {
			return null;
		}
	},
	write : function(oj,page) {
		var str = JSON.stringify(oj);
		location.href = page+'?'+encodeURI(str);	
	},
	replace : function(oj,page) {
		var str = JSON.stringify(oj);
		location.replace(page+'?'+encodeURI(str)); 
	}
}