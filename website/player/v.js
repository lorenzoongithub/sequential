
//
// This is the javascript for v.html (the v-player)
//
// This script is completely interwined with the v.css and v.html
// It creates all of the glue logic for the buttons (play/stop/edit/expand)
//
//
//
//

var search = location.search;
var divTitle =       document.getElementById('divTitle');
var lnkYolpo =       document.getElementById('lnkYolpo');
var lnkStop =        document.getElementById('lnkStop');
var lnkPlay =        document.getElementById('lnkPlay');
var lnkExpand =      document.getElementById('lnkExpand');
var lnkBasicEditor = document.getElementById('lnkBasicEditor');
var lnkRichEditor =  document.getElementById('lnkRichEditor');
var lnkNoEditor =    document.getElementById('lnkNoEditor');

window.onmessage = function(e){ 
	// called by loader.html to notify v.html on a successful loading.
	divTitle.innerHTML = e.data;
    document.title = e.data;
    
	//
	// lazily monitors the title is in synch with any editing.
	//
	function monitor() {
		var title = divTitle.innerHTML;
		if (title.charAt(title.length-1)!='*' && sessionStorage.code != sessionStorage.codeBKP ) {
			divTitle.innerHTML+='*'; 
		} 
		else if (title.charAt(title.length-1)=='*' && sessionStorage.code == sessionStorage.codeBKP ) {
			divTitle.innerHTML = title.substring(0,title.length-1);
		} 
		setTimeout(monitor,500)
	};
	setTimeout(monitor,500);
};


ifmScreen.location.href='loader.html'+search;

if (top == self) { 
	lnkExpand.style.display = 'none'; 
} else {
	lnkYolpo.style.display = 'none';
	divTitle.style.paddingLeft = '4px'; // cheating. (manually aligns the padding because we removed the icon on its left)
	lnkEdit.style.display = 'none'; 
	lnkExpand.href='http://www.yolpo.com/player/v.html'+search;
}




// This function is quite brittle and works under several assumptions.
// - no enconding is required for keys and values
// - keys are begin with & and end with =  e.g. '&mode='
// - same keys are no repeated
// - URL always has a search. 
// 
// 
// replaceParamValue('?id=1&mode=on&ui=black', '&mode=','off') === '?id=1&mode=off&ui=black'
// replaceParamValue('?id=1&mode=on&ui=black', '&ui=','white') === '?id=1&mode=on&ui=white'
//
function replaceParamValue(key,value) {
	var index = search.indexOf(key); 
	if (index == -1) { 
		return search+key+value; 
	}
	var endIndex = search.indexOf('&',1+index); 
	if (endIndex == -1) endIndex = search.length;
    return search.substring(0,index+key.length)+value+search.substring(endIndex);
} 

function getParam(key) {
	var index = search.indexOf(key);
	if (index == -1) return '';
	var endIndex = search.indexOf('&',1+index); 
	return (endIndex == -1) ? search.substring(index+key.length) : search.substring(index+key.length,endIndex);  
}



var playMode = getParam('&autoplay=') || 1; // 0:off 1:on 2:slow
var editMode = getParam('&edit=');  //0:basic editor,1:rich editor,undefined:no editing.


if (playMode == 1) {
	document.getElementById('lnkPlay').style.backgroundPosition='0 -40px';
} else if (playMode == 2) {
	document.getElementById('lnkSlow').style.backgroundPosition='-160px -40px';
} else {
	document.getElementById('lnkStop').style.backgroundPosition='-40px -40px'; 
}
	
if (editMode == 1 || editMode == 2) {
	lnkEdit.style.backgroundPosition='-120px -40px';
} else {
	lnkEdit.style.backgroundPosition='-120px 0px';
}

lnkYolpo.onclick = function() {
	window.top.location.href = "http://www.yolpo.com"; 
}

lnkPlay.onclick = function() {
	lnkStop.style.backgroundPosition='-40px 0';
	lnkPlay.style.backgroundPosition='0 -40px';
	lnkSlow.style.backgroundPosition='-160px 0';
	if (document.title == 'yolpo') return;
	
	if (editMode==1) {
		ifmScreen.location.replace('edit.wrap.basic.html'+replaceParamValue('&autoplay=',1));
	} else if (editMode==2) {
		ifmScreen.location.replace('edit.wrap.rich.html'+replaceParamValue('&autoplay=',1));
	} else {
		ifmScreen.location.replace('proxy.html'+replaceParamValue('&autoplay=',1));
	}
	playMode = 1; 
};

lnkSlow.onclick = function() {
	lnkStop.style.backgroundPosition='-40px 0';
	lnkPlay.style.backgroundPosition='0 0';
	lnkSlow.style.backgroundPosition='-160px -40px';
	if (document.title == 'yolpo') return;
	
	if (editMode==1) {
		ifmScreen.location.replace('edit.wrap.basic.html'+replaceParamValue('&autoplay=',2));
	} else if (editMode==2) {
		ifmScreen.location.replace('edit.wrap.rich.html'+replaceParamValue('&autoplay=',2));
	} else {
		ifmScreen.location.replace('proxy.html'+replaceParamValue('&autoplay=',2));
	}
	playMode = 2;
};

lnkStop.onclick = function() {
	if (playMode==0) return; 
	lnkStop.style.backgroundPosition='-40px -40px';
	lnkPlay.style.backgroundPosition='0 0';
	lnkSlow.style.backgroundPosition='-160px 0';
	
	if (document.title == 'yolpo') return;
	if (editMode==1) {
		ifmScreen.location.replace('edit.wrap.basic.html'+replaceParamValue('&autoplay=',0));
	} else if (editMode==2) {
		ifmScreen.location.replace('edit.wrap.rich.html'+replaceParamValue('&autoplay=',0));
	} else {
		ifmScreen.location.replace('proxy.html'+replaceParamValue('&autoplay=',0));
	}
	playMode = 0;
};

lnkEdit.onclick = function() {
	if (document.title =='yolpo') return;
	divPopup.style.display = (divPopup.style.display == 'block') ?  'none' : 'block';
}


function changeEditMode(value) {
	
	editMode = value; 
	
	// updates popup items. 
	if (editMode == 1) {
		lnkEdit.style.backgroundPosition='-120px -40px';
		lnkBasicEditor.style.color = '#ccc';
		lnkRichEditor.style.color =  '#000';
		lnkNoEditor.style.color =    '#000'
		ifmScreen.location.replace('edit.wrap.basic.html'+replaceParamValue('&autoplay=',playMode));
	} else if (editMode == 2) {
		lnkEdit.style.backgroundPosition='-120px -40px';
		lnkBasicEditor.style.color = '#000';
		lnkRichEditor.style.color =  '#ccc';
		lnkNoEditor.style.color =    '#000'
		ifmScreen.location.replace('edit.wrap.rich.html'+replaceParamValue('&autoplay=',playMode));
	} else {
		lnkEdit.style.backgroundPosition='-120px 0';
		lnkBasicEditor.style.color = '#000';
		lnkRichEditor.style.color =  '#000';
		lnkNoEditor.style.color =    '#ccc';
		ifmScreen.location.replace('proxy.html'+replaceParamValue('&autoplay=',playMode));
	}
	
	// no popup
	divPopup.style.display = 'none';  
}

lnkBasicEditor.onclick = function() {
	if (editMode == 1) return;
	changeEditMode(1); 
}

lnkRichEditor.onclick = function() {
	if (editMode == 2) return;
	changeEditMode(2); 
}

lnkNoEditor.onclick = function() {
	if (editMode != 1 && editMode != 2) return;
	changeEditMode(); 
}

lnkNoEditor.style.color = '#ccc';