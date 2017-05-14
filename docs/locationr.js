/**
 *
 *
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
	write : function(oj,page) {
		var str = JSON.stringify(oj);
		location.href = page+'?'+encodeURIComponent(str);	
	},
	replace : function(oj,page) {
		var str = JSON.stringify(oj);
		location.replace(page+'?'+encodeURIComponent(str)); 
	}
}