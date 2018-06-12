//设置rem
document.documentElement.style.fontSize = document.documentElement.clientWidth / 6.4 + 'px';

//leadin
$.leadin = function(url){
	var obj = null;
	$.ajax({
	    url: url,
	    async:false,
	    success: function (data) {
	        obj = data;
	    }
	});
	return obj;
}
$.hint = function(msg){
	var oDiv = document.createElement('div');
	$(oDiv).addClass("msg").html(msg);
	$("#msgCont").append(oDiv)
	setTimeout(function(){
		$(oDiv).slideUp(400,function(){
			$(oDiv).remove();
		});
	},2000)
}
$.session = Session = function(key, str) {
	if(str) {
		if(typeof(str) != "string") {
			str = JSON.stringify(str);
		}
		sessionStorage.setItem(key, str);
		return false
	} else {
		var str = sessionStorage.getItem(key);
		if(str) {
			try {
				return JSON.parse(str);
			} catch(err) {
				return str;
			}
		}
	}
};