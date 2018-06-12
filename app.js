var http = require("http"),
	https = require("https"),
	express = require('express'),
	app = express(),
	fs = require('fs'),
	path = require('path'),
	socket = require('ws'),
	WebSocketServer = socket.Server;
	

//设置跨域访问
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1');
	next();
});

app.use(express.static(path.join(__dirname, "public")));

var options = {
	key:fs.readFileSync('./2_ccskill.club.key'),
	cert:fs.readFileSync('./1_ccskill.club_bundle.crt')
};
 
var httpsServer = https.createServer(options, app).listen(3000,function(){
	console.log("443端口已启动！")
});

wss = new WebSocketServer({ server: httpsServer });
var sockets = {}; //房间字典
var chesslay = {}; //近2步数据
//广播
function onSend(message){
	wss.clients.forEach(function(client) {
		if(client.readyState == 1){
	    	client.send(message);
		}
    });
}
//向房间内的用户广播
function onSendHome(homeid,message){
	var thissockets = sockets[homeid];
	for(var k in thissockets){
		if(thissockets[k].readyState == 1){
			thissockets[k].send(message);
		}
	}
}
//向客户端发送房间列表
function getHome(ws,isonsend){
	var socketsname = [];
	for(var k in sockets){
		socketsname.push({"name":k,"len":sockets[k].length})
	}
	if(isonsend){
		onSend(JSON.stringify({type:"getHome",socketsname}));
	}else{
		ws.send(JSON.stringify({type:"getHome",socketsname}));
	}
}
wss.on('connection', function (ws,req) {
	var obj = []
	if(req.url == "/undefined"){
		if(ws.readyState == 1){
			ws.send(JSON.stringify({"type":"set","settype":"urlerror"}))
		}
		return false;
	}
	var socketsid = decodeURI(req.url,"utf-8").split("");
	socketsid.shift();
	socketsid = socketsid.join("");
	if(sockets[socketsid]){
		obj = sockets[socketsid];
	}
	obj.push(ws);

	//发送状态
	for(let i = 0, len = obj.length;i<len;i++){
		if(i > 1 || len <= 2){
			if(obj[i].readyState == 1){
				obj[i].send(JSON.stringify({"type":"set","utype":i,"len":len}));
			}
		}else{
			if(obj[i].readyState == 1){
				obj[i].send(JSON.stringify({"type":"set","len":len}));
			}
		}
	}
	if(chesslay[socketsid]){
		if(ws.readyState == 1){
			ws.send(JSON.stringify(chesslay[socketsid]))
		}
	}
	
	if(socketsid != "getHome"){
		sockets[socketsid] = obj;
	}
	getHome(ws,true);
	ws.on('message', function (message) {
        var message = JSON.parse(message);
        var thissockets = sockets[decodeURI(message.id,"utf-8")];
    	var chesslays = chesslay[decodeURI(message.id,"utf-8")]
    	if(chesslays){
    		chesslays.push(message)
    	}else{
    		chesslays = [];
    		chesslays.push(message);
    	}
    	chesslay[decodeURI(message.id,"utf-8")] = chesslays;
        for(let i = 0, len = thissockets.length; i < len; i ++){
        	if(thissockets[i] != ws){
        		if(thissockets[i].readyState == 1){
        			thissockets[i].send(JSON.stringify(message));
        		}
        	}
        }
    });
    ws.on("close",function(){
    	close(ws)
    })
    ws.on("error",function(){
    	close(ws)
    })
    function close(ws){
    	for(var s in sockets){
    		var thissockets = sockets[s];
    		for(let i = 0, len = thissockets.length;i<len;i++){
    			if(thissockets[i] == ws){
    				thissockets.splice(i,1);
	        		sockets[s] = thissockets;
	        		if(i == 0 || i == 1){
	        			onSendHome(s,JSON.stringify({"type":"close","msg":"主角已经离开了 该房间即将解散"}))
	        			delete sockets[s];
	        			delete chesslay[s];
	        			getHome(ws,true);
	        		}else{
		        		onSendHome(s,JSON.stringify({"type":"set","len":thissockets.length}))
	        		}
	        		break ;
    			}
    		}
    	}
    }
});