var config = $.leadin("../../config.json");
var homeid = location.href.split("?")[1];
var ws = new WebSocket("wss://ccskill.club:3000/"+homeid);
//监听用户关闭或刷新
window.onbeforeunload = function(){
	ws.close();
}
$(function() {
	$.hint("严重警告  不要刷新 不要刷新 不要刷新 ！！！")
	//创建棋盘
	var li = "";
	for(var i = 0, leni = config.crosswise; i < leni; i++) {
		for(var j = 0, lenj = config.vertical; j < lenj; j++) {
			if((i == 3 || i == 4 || i == 5) && (j == 1 || j == 2 || j == 4 || j == 5)) {
				li += "<li class='lt water' type='water' tr=" + (i + 1) + " td=" + (j + 1) + " ></li>"
			} else {
				var ifchess = false;
				for(var chesslocayoui = 0; chesslocayoui < 8; chesslocayoui++) {
					if(config.chesslocayou[chesslocayoui].tr == i && config.chesslocayou[chesslocayoui].td == j) {
						li += "<li class='lt you' tr=" + (i + 1) + " td=" + (j + 1) + " ><div type='chessyou' class='chessyou' content='" + config.chess[7 - chesslocayoui] + "'>" + config.chess[7 - chesslocayoui] + "</div></li>"
						ifchess = true
						break;
					}
				}
				for(var chesslocamei = 0; chesslocamei < 8; chesslocamei++) {
					if(config.chesslocame[chesslocamei].tr == i && config.chesslocame[chesslocamei].td == j) {
						li += "<li class='lt me' tr=" + (i + 1) + " td=" + (j + 1) + " ><div type='chessme' class='chessme' content='" + config.chess[chesslocamei] + "'>" + config.chess[chesslocamei] + "</div></li>"
						ifchess = true;
						break;
					}
				}

				for(var chesslocayouj = 0; chesslocayouj < 3; chesslocayouj++) {
					if(config.chesslocayoutrap[chesslocayouj].tr == i && config.chesslocayoutrap[chesslocayouj].td == j) {
						li += "<li class='lt trapyou' type='trap' tr=" + (i + 1) + " td=" + (j + 1) + " ></li>"
						ifchess = true;
						break;
					}
				}
				for(var chesslocamej = 0; chesslocamej < 3; chesslocamej++) {
					if(config.chesslocametrap[chesslocamej].tr == i && config.chesslocametrap[chesslocamej].td == j) {
						li += "<li class='lt trapme' type='trap' tr=" + (i + 1) + " td=" + (j + 1) + " ></li>"
						ifchess = true;
						break;
					}
				}

				if(config.chesslocayouboss.tr == i && config.chesslocayouboss.td == j) {
					li += "<li class='lt bossyou' type='boss' tr=" + (i + 1) + " td=" + (j + 1) + " ></li>"
					ifchess = true;
				}
				if(config.chesslocameboss.tr == i && config.chesslocameboss.td == j) {
					li += "<li class='lt bossme' type='boss' tr=" + (i + 1) + " td=" + (j + 1) + " ></li>"
					ifchess = true;
				}

				if(!ifchess) {
					li += "<li class='lt' tr=" + (i + 1) + " td=" + (j + 1) + " ></li>"
				}
			}
		}
	}
	$("#content").html(li);

	//行走
	var oDiv = null,
		oDivLi = null,
		oldtop = 0,
		oldleft = 0,
		objChange = [],
		isGo = false;
	$("li.me>div").on("touchstart",meDown);
	function meDown(e) {
		console.log()
		if(!isGo){
			return false;
		}
		e.preventDefault();
		e = e.originalEvent.touches[0];
		var x = e.clientX;
		var y = e.clientY;
		oDiv = $(this);
		oDivLi = oDiv.parent("li");
		oldtop = oDiv.css("top");
		oldleft = oDiv.css("left");
		oDiv.css({
			"transition": "none",
			"z-index": "10",
			"background": "rgba(255,255,255,1)"
		})
		var tr = oDivLi.attr("tr");
		var td = oDivLi.attr("td");
		objChange = [];
		isShowLoad($("li[tr='" + (tr - 1) + "'][td='" + td + "']"), "tr")
		isShowLoad($("li[tr='" + (tr - 0 + 1) + "'][td='" + td + "']"), "tr1")
		isShowLoad($("li[tr='" + tr + "'][td='" + (td - 1) + "']"), "td")
		isShowLoad($("li[tr='" + tr + "'][td='" + (td - 0 + 1) + "']"), "td1")

		function isShowLoad(obj, orientation) {
			if(!obj.is(".water")) {
				if(obj.html() == "") {
					if(!obj.is(".bossme")) {
						obj.css("background", "rgba(255,0,0,0.4)");
						objChange.push({
							obj: obj,
							top: obj.offset().top,
							topmax: obj.offset().top + obj.width(),
							left: obj.offset().left,
							leftmax: obj.offset().left + obj.width()
						})
					}
				} else {
					//判断是否为敌人 并判断是否级别大于敌人
					if(obj.is(".you") && isGreat(obj.children("div").html(), oDiv.html())) {
						obj.css("background", "rgba(255,0,0,0.4)");
						objChange.push({
							obj: obj,
							top: obj.offset().top,
							topmax: obj.offset().top + obj.width(),
							left: obj.offset().left,
							leftmax: obj.offset().left + obj.width()
						})
					}

					function isGreat(you, me) {
						if(obj.is(".trapme")) {
							return true;
						}
						if(me == "鼠" && (you == "象" || you == "鼠")) {
							return true;
						} else if(me == "猫" && (you == "鼠" || you == "猫")) {
							return true;
						} else if(me == "狗" && (you == "鼠" || you == "猫" || you == "狗")) {
							return true;
						} else if(me == "狼" && (you == "鼠" || you == "猫" || you == "狗" || you == "狼")) {
							return true;
						} else if(me == "虎" && (you == "鼠" || you == "猫" || you == "狗" || you == "狼" || you == "虎")) {
							return true;
						} else if(me == "豹" && (you == "鼠" || you == "猫" || you == "狗" || you == "狼" || you == "虎" || you == "豹")) {
							return true;
						} else if(me == "狮" && (you == "鼠" || you == "猫" || you == "狗" || you == "狼" || you == "虎" || you == "豹" || you == "狮")) {
							return true;
						} else if(me == "象" && (you == "猫" || you == "狗" || you == "狼" || you == "虎" || you == "豹" || you == "狮" || you == "象")) {
							return true;
						} else {
							return false;
						}
					}
				}
			} else {
				//是水
				if(oDiv.html() == "鼠" || oDiv.html() == "狼") {
					obj.css("background", "rgba(255,0,0,0.4)");
					objChange.push({
						obj: obj,
						top: obj.offset().top,
						topmax: obj.offset().top + obj.width(),
						left: obj.offset().left,
						leftmax: obj.offset().left + obj.width()
					})
				} else if(oDiv.html() == "狮" || oDiv.html() == "虎") {
					if(orientation == "tr") {
						isShowLoad($("li[tr='" + (tr - 4) + "'][td='" + td + "']"))
					} else if(orientation == "tr1") {
						isShowLoad($("li[tr='" + (tr - 0 + 4) + "'][td='" + td + "']"))
					} else if(orientation == "td") {
						isShowLoad($("li[tr='" + tr + "'][td='" + (td - 3) + "']"))
					} else if(orientation == "td1") {
						isShowLoad($("li[tr='" + tr + "'][td='" + (td - 0 + 3) + "']"))
					}
				}
			}
		}
		document.addEventListener("touchmove",meMove);
		document.addEventListener("touchend",meUp);

		function meMove(e1) {
			e1.preventDefault();
			e1 = e1.touches[0];
			//获取手指位置
			x1 = e1.clientX;
			y1 = e1.clientY;
			//计算div位移
			console.log(x)
			var top = y1 - y;
			var left = x1 - x;
			//设置div位置
			oDiv.css({
				"top": top,
				"left": left
			})
		}
	}
	
	var x1 = 0,
		y1 = 0;
	function meUp(e) {
		e.preventDefault();
		$("li[type!='water'][type!='trap'][type!='boss']").css("background", "none")
		$(".water").css({
			"background": "url(../../image/water.jpg) no-repeat",
			"background-position": "center",
			"background-size": "200% 200%"
		})
		$(".bossme,.bossyou").css({
			"background": "url(../../image/boss.png) no-repeat",
			"background-position": "center",
			"background-size": "80% 80%"
		})
		$(".trapme,.trapyou").css({
			"background": "url(../../image/trap.png) no-repeat",
			"background-position": "center",
			"background-size": "80% 80%"
		})

		//循环记录的位置 找到匹配的li
		for(var i = 0, len = objChange.length; i < len; i++) {
			if(y1 > objChange[i].top && y1 < objChange[i].topmax && x1 > objChange[i].left && x1 < objChange[i].leftmax) {
				oDivLi.removeClass("me");
				objChange[i].obj.html(oDiv).addClass("me").removeClass("you");
				ws.send(JSON.stringify({
					id:homeid,
					user:utype,
					tr: 10 - objChange[i].obj.attr("tr"),
					td: 8 - objChange[i].obj.attr("td"),
					obj: oDiv.html()
				}))
				isGo = false;
				$(".chessme").css("animation","none");
				AreYouOk();
			}
		}
		objChange = [];

		oDiv.css({
			"top": oldtop,
			"left": oldleft,
			"background": "rgba(255,255,255,0.8)",
			"z-index": "2",
			"transition": "all 0.4s"
		})
		$(document).mousemove && $(document).unbind("mousemove");
		$(document).touchmove && $(document).unbind("touchend");
	}

	//判断输赢
	function AreYouOk() {
		if($("li>div[type='chessyou']").length == 0 || $(".bossyou").html() != "") {
			$.hint("胜利")
			location.href = "../../index.html";
			//请求接口 参数 uid1(胜利方) uid2(失败方) money(赌注)
		} else if($("li>div[type='chessme']").length == 0 || $(".bossme").html() != "") {
			$.hint("失败")
			location.href = "../../index.html";
		}
	}

	//链接websocket
	//websocket 传输数据
	var socketData = {
		obj: "鼠",
		tr: 9,
		td: 4
	}
	//youChange(socketData)
	//接受到数据 处理
	function youChange(socketData) {
		console.log(socketData);
		console.log(utype);
		if(utype == 0 || utype == 1){
			isGo = true;
			$(".chessme").css("animation","myfirst 2s infinite");
			var obj = $("li.you>div[content='" + socketData.obj + "']");
			obj.parent("li").remove("you")
			$("li[tr=" + socketData.tr + "][td=" + socketData.td + "]").html(obj).addClass("you").removeClass("me")
		}else{
			if(socketData.user == 1){
				var obj = $("li.you>div[content='" + socketData.obj + "']");
				obj.parent("li").remove("you")
				$("li[tr=" + socketData.tr + "][td=" + socketData.td + "]").html(obj).addClass("you").removeClass("me")
			}else{
				var obj = $("li.me>div[content='" + socketData.obj + "']");
				obj.parent("li").remove("me")
				$("li[tr=" + (10-socketData.tr) + "][td=" + (8-socketData.td) + "]").html(obj).addClass("me").removeClass("you")
			}
		}
		
		
		AreYouOk();
	}
	
	
	var utype = 2; //默认为观战状态
	ws.onmessage = function(evt) {
		var data = JSON.parse(evt.data);
		if(data.type == "getHome"){
			return false;
		}
		if(data.type == "msg"){
			$.hint(data.msg)
		}else if(data.type == "set"){
			if(data.settype=="urlerror"){
				$.hint("连接方式错误");
				setTimeout(function(){
					location.href = "../../index.html";
				},1000)
			}else{
				if(data.utype || data.utype == 0){
					utype = data.utype;
					$.session("utype",utype);
					if(utype == 0 && data.len == 2){
						isGo = true;
						$(".chessme").css("animation","myfirst 2s infinite");
					}
				}
				if(data.len >= 2){
					$(".youimg").css("background-image","url(../../image/me/mouseme.png");
					$("#peopleNum").html(data.len - 2);
				}else{
					$(".youimg").css("background-image","none");
				}
			}
			
		}else if(data.type == "close"){
			$.hint(data.msg);
			setTimeout(function(){
				location.href = "../../index.html";
			},1000)
		}else{
			if(Array.isArray(data)){
				for(var i in data){
					youChange(data[i]);
				}
			}else{
				youChange(data);
			}
		}
	};
	ws.onerror = function(evt) {
		$.hint("断开链接")
	};
	
	//点击退出房间
	$("#close").click(function(){
		$.hint("即将退出房间")
		setTimeout(function(){
			location.href = "../../index.html";
		},1000)
	})

	
	
})
