//
// Breaks any valid js-code into its constituent statements, returning an array like this:
//
// [
//  { code : '//comment', type:1 },
//  { code : '//comment', type:1 },
//  { code : 'var i=0',        type:0 },
//  { code : 'function f() {', type:0 },
//  ... 
//  ...
// ]
//
// For type we use
//       0 standard code
//	     1 is a comment or gap (newlines)
//
// if there is an error it returns 
// { e : 'error message in english' } //  	
//
// 
// see: http://stackoverflow.com/questions/14217101/what-character-represents-a-new-line-in-a-text-area 
//      to understand why I search for '\n'
//
// @depends on esprima.js 
//
function statementify(code) {
	
	var syntax;
	try {
		syntax = esprima.parse(code, {range:true});
	} catch (exception) {
		return { e : exception.message };
	}
	
	var statements = syntax.body;
	var array = [];
	
	// check if there is a gap before the first line of code.
	if (statements.length>0) {
		var gap = code.substring(0,statements[0].range[0]);
		if (gap.indexOf('\n')!== -1) {
			array.push({
				type: 1,
				code: gap
			});
		}
	}
	
	for (var i=0;i<statements.length;i++) {
		var x = statements[i];
		
		array.push( {
			type: 0,	
			code: code.substring(x.range[0],x.range[1])
		});
		
		if (i<statements.length-1) {
			var y =statements[i+1];
			var gap = code.substring(x.range[1],y.range[0]);
			var index4NL = gap.indexOf('\n'); 
			if (index4NL!==-1) { 
				gap = gap.substring(index4NL+1);
				if (gap.indexOf('\n')!== -1) {
					array.push({
						type: 1,
						code: gap
					});
				}
			}
		}
	}
	return array;
}