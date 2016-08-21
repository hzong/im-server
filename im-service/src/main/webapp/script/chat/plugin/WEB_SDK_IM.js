/**
 * 即时通信-数据连接层
 * 作者：hzong
 */
function IM_log(msg){
	if(m_isDug){
		console.log(msg);
	}
}
/**
 * 是否为undefined
 * @param val 变量
 * @returns true 等于undefined ,false 不等于undefined
 */
function IM_isUndefined(val){
	return val == undefined ? true :false;
}

/**
 * 是否为空
 * @param val 变量
 * @returns true val == null ,false val != null
 */
function IM_isNull(val){
	return IM_isUndefined(val) ? true: (val == null ? true : false);
}
/**
 * 长度是否大于1
 * @param val 变量
 * @returns true val == 0,false val > 0;
 */
function IM_Length(val){
	return IM_isNull(val) ? true: (val.length ==  0 ? true : false);	
}

/**
 * 是否哦为数组
 * @param v
 * @returns {Boolean}
 */
function IM_IsArray(v){ 
	return toString.apply(v) === '[object Array]'; 
} 


(function(){
	var imurl = "http://192.168.56.1:8888/im-service/";
	document.write("<script type='text/javascript' src='"+imurl+"script/chat/strophe.js'></script>");
	document.write("<script type='text/javascript' src='"+imurl+"script/common/syscom.js'></script>");
	
//	document.write("<script type='text/javascript' src='"+imurl+"script/chat/plugin/WEB_SDK_IM.js'></script>");
})();

var m_isDug = true;

var IMClient = function(){
	this.bsoh_conn = undefined;//连接
	var imc = this;
	var im_req = this.im_req = im_dom();
	var hson = this.hson = im_hson();
	
	
//	im_req.get("http://192.168.56.1:8888/im-service/demo/aa",{},function(val){
//		alert(val);
//	})
//	
	/**
	 * 消息类型
	 */
	this.MsgType = {
		text : 0//文字
	};
	
	/**
	 * 会话类型
	 */
	this.sessionType = {
		// message types
		chat:'chat',//单聊
		groupchat:'groupchat',//群聊
		
		error:'error',//错误消息
		
		//iq types
		result:'result',//成功
		get:'get',//获取
		set:'set',//设置
			
			
		subscribe:"subscribe",
		subscribed:"subscribed",
		unsubscribe:"unsubscribe"
	};
	
	/**
	 * 订阅类型
	 */
	this.SubscriptionType = {
		none_pending_out : "none_pending_out",//好友申请的状态
		both:"both"
	}
	
	/**
	 * 元素
	 */
	this.element = {
		message:'message',
		iq:'iq',
		presence:'presence'
		
	};
	
	/**
	 * 处理代码
	 */
	this.HandleCode = {
	}
	
	
	//参数------begin
	/**
	 * @param obj {
	 * 		content,//内容
	 *  	ext //扩展字段
	 * }
	 */
	this.MsgTextBuilder =function(obj,ext){
		this._msgType = imc.MsgType.text;//消息类型
		this._body = hson.stringify(obj);//消息内容
		this._ext = ext;//自定义扩展
	}
	
	this.EeleErrorBuilder = function(obj){
		
	}
	
	//参数------end
	
	
	/**
	 * 工具类
	 */
	this.util = {
			
			/**
			 * msgID
			 */
			getTimeRndString:function (to) {
				var tm=new Date();
				var str=tm.getMilliseconds()+tm.getSeconds()*60+tm.getMinutes()*3600+tm.getHours()*60*3600+tm.getDay()*3600*24+tm.getMonth()*3600*24*31+tm.getYear()*3600*24*31*12;
				return imc.appTag+"-"+imc.account+"-"+Math.random()+"#"+to+"-webim—"+str;
			},
			/**
			 * 消息发送
			 * @param xml报文
			 */
			send :function(xml){
				imc.util.toXMPPString(xml);
				imc.bsoh_conn.send(xml.tree());
			},
			/**
			 * message顶级节点
			 * <message id = "消息id" to ="接受方IM账号" from = "发送方IM账号" type="chat" msgType = "消息类型">
			 *	
			 * </message>
			 * @param _ele 元素类型
			 * @param _id 消息ID
			 * @param _to 接收方IM账号
			 * @param _type 会话类型
			 * @param _msgType 消息类型
			 * @return msg对象
			 */
			rootNode:function(_ele,_id,_to,_type,_msgType){
				var domain = "";
				if(_type == 'groupchat'){///房间
					_to = '10'+imc.domin;
				}
				
				//判断公共属性
				var xmpp = {id:_id,from:imc.account+imc.domin/*+imc.resource*/,type:_type};
				if(_to){
					xmpp.to = _to;
				}
				if(_msgType){
					xmpp.msgType = _msgType;
				}

				//判断元素
				var ele_node = null;
				if(imc.element.message == _ele){
					ele_node = $msg(xmpp);
				}else if(imc.element.iq == _ele){
					ele_node = $iq(xmpp);
				}else if(imc.element.presence == _ele){
					ele_node = $pres(xmpp);
				}
				return ele_node;
			},
			/**
			 * XMPP对象转换字符串
			 * @param xml XMPP对象
			 * @return 字符串
			 */
			toXMPPString :function(xml){
				var xml = Strophe.serialize(xml);
				IM_log(xml);
				return xml;
			},
			/**
			 * 发送时间
			 */
			sendtime:function(){
				//调用
				return new Date().format("yyyy-MM-dd hh:mm:ss");
			},
			/**
			 * <message>
			 * 	<body>阿斯蒂芬</body>
			 * </message>
			 */
			eleXMPP: function(xml,paths){
				Strophe.forEachChild(xml,'body',function(node){
					var aa = '';
				});
			},
			/**
			 * 拷贝对象
			 */
			deepCopy: function(obj) { 
				var result={};
				for (var key in obj) {
				      result[key] = typeof obj[key]==='object' ? deepCoyp(obj[key]) : obj[key];
				   } 
				   return result; 
			},
			getLocalpart:function(jid){
				var obj = {};
				var a_jid = jid.split("_");
				obj.sys = a_jid[0];
				obj.source = a_jid[1];
				obj.id = a_jid[2];
				return obj;
			}
			
	};
	
	this.ChatMessageListen = null;//聊天消息监听
	this.RosterListen = {//好友消息监听
		/**
		 * 申请好友事件
		 * @param username 发送方IM账号
		 * @param reason 发送方-描述
		 */
		onApplyRoster:function(username,reason){//申请好友
			
		},
		/**
		 * 删除好友事件
		 * @param username 发送方IM账号
		 */
		onRemoveRoster:function(username){//删除好友
			
		},
		/**
		 * 同意好友
		 * @param username  发送方账号
		 */
		onAgreeRoster:function(username){//同意好友
			
		},
		/**
		 * 同意好友
		 * @param username  发送方账号
		 */
		onRefuseRoster:function(username){//拒绝好友
			
		}
	};
	
	
}


//扩展Date的format方法   
Date.prototype.format = function (format) {  
	var o = {  
		"M+": this.getMonth() + 1,  
		"d+": this.getDate(),  
		"h+": this.getHours(),  
		"m+": this.getMinutes(),  
		"s+": this.getSeconds(),  
		"q+": Math.floor((this.getMonth() + 3) / 3),  
		"S": this.getMilliseconds()  
	}  
	if (/(y+)/.test(format)) {  
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));  
	}  
	for (var k in o) {  
		if (new RegExp("(" + k + ")").test(format)) {  
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));  
		}  
	}  
	return format;  
} 

/**
 * 初始化操作
 */
IMClient.prototype.initialize = function(statusEvent){
	this.onConnect(statusEvent);
} 


/**
 * 打开连接登录
 * @param paras 
 * {
 * 	account：账号
 *  password： 密码
 *  source: 来源
 * }
 * 	
 */
IMClient.prototype.open = function(paras){
	var imc = this;
	
	var account =paras.account = paras.source+"_"+paras.account;
	var login_account = account+imc.domin;
	var wait = 30;
	
	IMClient.prototype.domin = "@free";
	IMClient.prototype.roomdomin = "room.free";
	IMClient.prototype.resource = '/webim';
	IMClient.prototype.room = '/room';
	
	
	//登录
	bsoh_conn.connect(login_account,paras.password,this.status,wait);
	this.addListen();
	
	
	//新跳包
	var handler = function(){
		var xml=  $iq({to: account+imc.domin, type: "get", id: "ping1"}).c("ping", {xmlns: "urn:xmpp:ping"});
		imc.util.send(xml);//发送XMPP消息
    };
	//setTimeout( handler , 1000*5,11); //50秒发一次ping包 ct.sendpingtimer
}


/**
 * 连接事件
 * @param appTag 应用标签
 * @param account 平台账号
 * @param statusEvent
 * {
 * 	onConnecting,//连接中事件
 *  onDisconnected，//断开连接事件
 *  onConnected//连接成功
 * 
 * }
 */
IMClient.prototype.onConnect= function(statusEvent){
	this.bosh_server = "http://192.168.56.1:5280/";
	var bsoh_conn =this.bsoh_conn = new Strophe.Connection(this.bosh_server);
	var imc = this;
	
	var datetime = new Date();
	var oldtime = 0;
	
	IMClient.prototype.account = account;//初始化平台账号
	IMClient.prototype.appTag = appTag;//应用标识
	this.status = function(status){
		if (status == Strophe.Status.CONNECTING) {
			statusEvent.onConnecting();//连接中事件
	    } else if (status == Strophe.Status.CONNFAIL) {
	    	statusEvent.onDisconnected();//断开连接事件
	    } else if (status == Strophe.Status.DISCONNECTING) {
	    	statusEvent.onConnecting();//连接中事件
	    } else if (status == Strophe.Status.DISCONNECTED) {
	    	statusEvent.onDisconnected();//断开连接事件
	    	IM_log(datetime.getTime()-oldtime);
	    } else if (status == Strophe.Status.CONNECTED) {
	    	statusEvent.onConnected();//连接成功
	    	bsoh_conn.send($pres().tree());
	    	oldtime = datetime.getTime();
	    }
	};
	
}

/**
 * 添加监听
 */
IMClient.prototype.addListen = function(){
	var imc = this;
	var im_req = this.im_req;
	var hson = this.hson;
	//XMPP 基本报文 
	var XMPP_XML = function(xml){
		var xmpp = {};
		
		var _id = xml.getAttribute('id');
		xmpp.id = _id;
		
		var _to = xml.getAttribute('to');
		xmpp.to = _to;
		
		var _from = xml.getAttribute('from');
		if(!IM_isUndefined(_from)){
			xmpp.from = _from;
		}
		
		var _type = xml.getAttribute('type');
		xmpp.type = _type;
		
		var _msgType = xml.getAttribute('msgType');
		if(!IM_isUndefined(_msgType)){
			xmpp.msgType = _msgType;
		}
		
		return xmpp;
	};
	/**
	 * 获取XML节点
	 */
	var getEle_node = function(xml,node){
		return xml.getElementsByTagName(node);//消息规则定义/chat/groupchat/....
	};
	/**
	 * 获取元素内容
	 */
	var getEle_text = function(xml,node){
		var node = getEle_node(xml,node);
		if(node.length > 0){
			return Strophe.xmlunescape(Strophe.getText(node[0]));
		}
		return undefined;
	};
	/**
	 * 转换对象
	 */
	var parseObject = function(json){
		return hson.parse(json);
	}
	
	var iteratorEle = function(xml,elementPath,cbHandle){
		var ind = 0;
		var path = null;
		var isSuccess = false;
		
		
		var child = function(xml){
				if(IM_isUndefined(xml)){
					return;
				}
				
				if(!cbHandle(xml)){
					ind++;
					ite(xml);
				}
		};
		var ite = function(xml){
			if(elementPath.length < ind+1){
				return;
			}
			
			path = elementPath[ind];
			
			Strophe.forEachChild(xml,path.eleName,child);
			
			
		}
		ite(xml);
	}
	
	
	/**
	 * 是否存在静态命名空间字符串
	 * @param xml xmpp元素
	 * @param elementPath 元素数组路径
	 * @param xmlns 命名空间
	 */
	var isXMLNSStaticStr = function(xml,elementPath,xmlns){
		var isResult = false;
		iteratorEle(xml, elementPath, function(ele){
			if(ele.namespaceURI == xmlns){
				return isResult = true;
			}else{
				return false;
			} 
		});
		
		return isResult;
	}
	
	/**
	 * 
	 */
	var CacheType = {
		user_info:0,//用户信息
		group_info: 1,//群信息
		rosters:2,//好友列表
		groups:3,//群
		group_members:4//群成员
	};
	
	
	/**
	 * 数据
	 */
	var cacheData ={
			a_info:{},//用户信息
			a_group_info :{},//群信息
			a_members:{},//群成员列表
			a_rosters:{},//好友列表
			a_groups:{}//用户群列表
	};
	
	
	/**
	 * 缓存处理处理
	 */
	var cacheOpt = {
				/**
				 * 获取缓存类型
				 */
				getCacheDataType: function(type){
					var obj = null;
					if(CacheType.user_info == type){
						obj =cacheData.a_info;
					}else if(CacheType.rosters == type){
						obj =cacheData.a_rosters;
					}else if(CacheType.groups == type){
						obj =cacheData.a_groups;
					}else if(CacheType.group_members == type){
						obj =cacheData.a_members;
					}else if(CacheType.group_info == type){
						obj =cacheData.a_group_info;
					}
					return obj;
				},
				getByData: function(type,key){
					var obj = this.getCacheDataType(type);
					return obj[key];
				},
				addCacheData: function(type,key,val){
					var obj = this.getCacheDataType(type);
//					if(IM_IsArray(obj)){//数组
//						obj.push(key);
//					}else{
						obj[key] = val;
//					}
				},
				removeCacheData: function(type,key){
					var obj = this.getCacheDataType(type);
					
//					if(IM_IsArray(obj)){//数组
//							obj.splice(key, 1);
//					}else{
						delete obj[key];
//					}
				},
				isExists:function(type,key){
					return getByData(type, key) == undefined;
				}
	};
	
	
	var oncbHandle = null;
	
	 // IQ相关对象
	/**
	 * 获取群列表
	 * @param xml 报文
	 * @param msg 消息
	 */
	var getGroupList = function(xml,msg){
		msg.items = [];
		oncbHandle = imc.HandleCode['getGroupList'][0];
		if(msg.type == imc.sessionType.result){
			Strophe.forEachChild(xml,'query',function(query){
				Strophe.forEachChild(query,'item',function(item,i){
					msg.items[i] = {};
					msg.items[i].name =item.getAttribute('name');//群名称
					msg.items[i].groupId =Strophe.getNodeFromJid(item.getAttribute('jid'));//群ID
					oncbHandle(msg.items[i],i);
				});
			});
			
		}else if(msg.type == imc.sessionType.error){
			
		}
	}
	
	/**
	 * 获取还有列表
	 * /**
	 * <iq id="Cjj4I-5" to="zhugeliang@free/cvlep" type="result">
	  <query xmlns="jabber:iq:roster">
	    <item jid="caocao@free" name="caocao" subscription="both">
	      <group>Friends</group>
	    </item>
	    <item jid="hzong@free" name="hzong" subscription="both">
	      <group>Friends</group>
	    </item>
	  </query>
	</iq>
	 */
	var getRostersList = function(xml,msg){
		msg.items = [];
		oncbHandle = imc.HandleCode['getRostersList'][0];
		if(msg.type == imc.sessionType.result){
			im_req(xml).find("query item").each(function(i,item){
				
				if(item.getAttribute('subscription') == imc.SubscriptionType.both){
					msg.items[i] = {};
					//公共部分
					msg.items[i].remark =item.getAttribute('remark');//备注名
					msg.items[i].group = im_req(item).find("group").html();//分组
					
					//复制对象
					var obj = imc.util.deepCopy(msg.items[i]);

//					SDK使用
					msg.items[i].jid =item.getAttribute('jid');//好友jid
					var localpart =msg.items[i].localpart = imc.util.getLocalpart(Strophe.getNodeFromJid(item.getAttribute('jid')));//好友id

					//客户端使用
					obj.id = localpart.id;
					
					//缓存
					cacheOpt.addCacheData(CacheType.rosters,msg.items[i].jid, msg.items[i]);
					//调用回调
					oncbHandle(obj,i);
				}
			});
		}else if(msg.type == imc.sessionType.error){
			
		}
	}
	
	/**
	 * 删除还有
	 */
	var removeRosters = function(xml,msg){
		if(msg.type == imc.sessionType.set){
			im_req(xml).each(function(i,item){
				var jid = item.getAttribute('jid');//好友id
				var localpart = imc.util.getLocalpart(Strophe.getNodeFromJid(jid));//好友id
				
				if(IM_isUndefined(imc.RosterListen.onRemoveRoster)){
					IM_log("未注册聊天聊天监听（removeRosters）");
					return;
				}
				cacheOpt.removeCacheData(CacheType.rosters, jid);
				imc.RosterListen.onRemoveRoster(localpart.id);//删除好友
			});
		}
	}
	
	/*
	 * 申请好友
	 */
	var applyRoster = function(xml,msg){
		var reason = getEle_text(xml,'reason');
		var jid = Strophe.getNodeFromJid(msg.from);
		imc.RosterListen.onApplyRoster(jid,reason);
	}
	
	var agreeRoster = function(xml,msg){//同意好友
		var jid = msg.from;
		var localpart = imc.util.getLocalpart(Strophe.getNodeFromJid(jid));//好友id
		
		var obj = {};
		obj.remark = undefined;//备注名
		obj.group = undefined;//分组
		obj.jid =jid;//好友jid
		obj.localpart = localpart;
		
		cacheOpt.addCacheData(CacheType.rosters, jid, obj);
		imc.RosterListen.onAgreeRoster(localpart.id);
		
		
		
	}
	
	var refuseRoster=function(xml,msg){//拒绝好友
		var reason = getEle_text(xml,'reason');
		var jid = Strophe.getNodeFromJid(msg.from);
		imc.RosterListen.onRefuseRoster(jid,reason);
	}
	
	
	var listens = {
		onMessage:function(xml){
			imc.util.toXMPPString(xml);
			
			
			var msg = new XMPP_XML(xml);
			
			if(msg.type == imc.sessionType.chat || msg.type == imc.sessionType.groupchat){//单聊、群聊
				//消息公共部分
				var body = parseObject(getEle_text(xml,'body'));
				msg.body = body._body;
				msg.ext = body._ext;
				msg.sendtime =imc.util.sendtime();

				
				if(IM_isUndefined(imc.ChatMessageListen)){
					IM_log("未注册聊天聊天监听（ChatMessageListen）");
					return false
				}
				
				if(imc.sessionType.chat == msg.type){
				}else if(imc.sessionType.groupchat == msg.type){
					msg.room = getEle_text(xml,'room');//获取房间
				}
				
				imc.ChatMessageListen(msg.type,msg);
			}else{//其他
				
			}
			
			return true;
		},
		onPresence:function(xml){//在线包
			imc.util.toXMPPString(xml);
			
			var presence = new XMPP_XML(xml);
			
			if(imc.sessionType.subscribe == presence.type ){//申请添加好友-发送
				applyRoster(xml, presence);
			}
			if(imc.sessionType.subscribed == presence.type ){//申请添加好友-同意
				agreeRoster(xml, presence);
			}
			if(imc.sessionType.unsubscribe == presence.type ){//申请添加好友-拒绝
				refuseRoster(xml, presence);
			}
			
		},
		onIQ:function(xml){//IQ包拦截
			imc.util.toXMPPString(xml);
			
			var iq = new XMPP_XML(xml);
			
			
			if(imc.sessionType.result == iq.type){//成功
				if(isXMLNSStaticStr(xml, [{"eleName":"query"}], Strophe.NS.MUC_GROUPS)){//MUC群列表
					getGroupList(xml, iq);
				}else if(isXMLNSStaticStr(xml, [{"eleName":"query"}], Strophe.NS.IM_ROSTERS)){
					var result = undefined;
						im_req(xml).find("query item").each(function(i,ele){
							var subscription = im_req(ele).attr('subscription');
							if(iq.type == imc.sessionType.result){
								if(subscription){//好友列表
									result = false;//终止循环执行
									getRostersList(xml, iq)
								}else if(subscription =="remove"){
									removeRosters(ele, iq);
								}
							}else if(msg.type == imc.sessionType.error){//判断如果错误则终止执行
								
								result = false;//终止循环执行
							}
							return result;
						});
				}
			}else if(imc.sessionType.set == iq.type){//成功
				if(isXMLNSStaticStr(xml, [{"eleName":"query"}], Strophe.NS.IM_ROSTERS)){
					var result = undefined;
						im_req(xml).find("query item").each(function(i,ele){
							var subscription = im_req(ele).attr('subscription');
								if(subscription =="remove"){//好友列表
									removeRosters(ele, iq);
								}
							return result;
						});
				}
				
				
			}
		}
	};
	
	var onListens = function(xml){
		var tagName = xml.tagName;
		
		try{
		if(imc.element.message == tagName){//监听message
			listens.onMessage(xml);
		}else if(imc.element.iq == tagName){//iq监听
			listens.onIQ(xml);
		}else if(imc.element.presence == tagName){//presence监听
			listens.onPresence(xml);
		}
		}catch (e) {
			IM_log("异常:"+e.message);
		}
		return true;
		
	}
	
	
	//message报文
	imc.bsoh_conn.addHandler(onListens,null,null,null,null,null);
}


/**
 * 错误消息代码
 */
IMClient.prototype.ErrorCode = {
		
};


/**
 * 处理回调
 * @param code 代码
 * @param cbSuccess 成功回调
 * @param cbError 错误回调
 */
IMClient.prototype.handleEeceive = function(code,cbSuccess,cbError){
	var imc = this;
	imc.HandleCode[code]  = [cbSuccess,cbError];
}


/**
 * 发送消息
 * @param sessionType 会话类型
 * @param to 接受方IM账号
 * @param msgBuilder 消息参数详情请参照 MsgBuilder对象
 * @param cbError 失败回调
 * 
 * 单聊-文本消息
 *<message id = "消息id" to ="接受方IM账号" from = "发送方IM账号" type="chat" msgType = "text">
 *	<body>{content:"",ext:""}<body>
 *  <sendtime>当前时间</sendtime>//发送方的时间
 *</message>
 */
IMClient.prototype.sendMsg=function(sessionType,to,msgBuilder,cbError){
	var imc = this;
	if(IM_Length(to)){
		IM_log("发送方不能为空！");
		return;
	}
	
	if(IM_Length(msgBuilder._body)){
		IM_log("消息不能为空！");
		return;
	}
	
	//
	var msgId = this.util.getTimeRndString();//消息ID
	
	var xml =this.util.rootNode(imc.element.message,msgId,to+imc.domin,sessionType,msgBuilder._msgType);
	xml.c('body',JSON.stringify(msgBuilder)).up();
	//xml.c('sendtime',imc.util.sendtime()).up();
	
	this.util.send(xml);//发送XMPP消息
	
	imc.handleEeceive('sendMsg',undefined,cbError);
}

/**
 * 获取群列表
 * @param cbError 成功回调
 * @param cbError 失败回调
 */
IMClient.prototype.getGroupList=function(cbSuccess,cbError){
	var imc = this;
	var msgId = this.util.getTimeRndString("getGroupList");//消息ID
	
	
	var xml =this.util.rootNode(imc.element.iq,msgId,"room"+imc.domin,imc.sessionType.get);
	xml.c('query').attrs({"xmlns":"http://jabber.org/protocol/disco#items"});
	this.util.send(xml);//发送XMPP消息
	
	imc.handleEeceive('getGroupList',cbSuccess,cbError);
}



/**
 * 获取好友列表
 * @param cbError 成功回调
 * @param cbError 失败回调
 */
IMClient.prototype.getRostersList=function(cbSuccess,cbError){
	var imc = this;
	var msgId = this.util.getTimeRndString("getRostersList");//消息ID
	
	
	var xml =this.util.rootNode(imc.element.iq,msgId,undefined,imc.sessionType.get);
	xml.c('query').attrs({"xmlns":Strophe.NS.IM_ROSTERS});
	this.util.send(xml);//发送XMPP消息
	
	imc.handleEeceive('getRostersList',cbSuccess,cbError);
}

/**
 * 移除好友
 * @param imAccount IM账号
 * @param cbError 成功回调
 * @param cbError 失败回调
 */
IMClient.prototype.removeRoster = function(imAccount){
	var imc = this;
	var msgId = this.util.getTimeRndString("removeRosters");//消息ID
	
	var to = imc.account+imc.domin;
	var jid = imAccount+imc.domin;
	
	var xml =this.util.rootNode(imc.element.iq,msgId,to,imc.sessionType.set);
	var ele_query = xml.c('query').attrs({"xmlns":Strophe.NS.IM_ROSTERS});
	ele_query.c("item").attrs({"jid":jid,"subscription":"remove"});
	this.util.send(ele_query);//发送XMPP消息
	
	
//	<iq xmlns="jabber:client" to="hzong@free/cvlep" id="rsttig7" type="set">
//	<query xmlns="jabber:iq:roster">
//	<item jid="caocao@free" subscription="remove"/>
//	</query>
//</iq>
}


/**
 * 申请好友
 * @param imAccount 米账号
 * @param reason 申请内容
 * @param cbSuccess 成功
 * @param cbError 失败
 */
IMClient.prototype.applyRoster = function(imAccount,reason){
	var imc = this;
	var msgId = this.util.getTimeRndString("applyRoster");//消息ID
	
	var to = imAccount+imc.domin;
	
	var xml =this.util.rootNode(imc.element.presence,msgId,to,imc.sessionType.subscribe);
	if(!IM_isUndefined(reason)){
		xml.c("reason",reason).up();
	}
	this.util.send(xml);//发送XMPP消息
}
/**
 * 好友-同意
 * @param imAccount 账号
 */
IMClient.prototype.agreeRoster = function(imAccount/*,remark,group*/){
	var imc = this;
	var msgId = this.util.getTimeRndString("onAgreeRoster");//消息ID
	
	var to = imAccount+imc.domin;
	
	var xml =this.util.rootNode(imc.element.presence,msgId,to,imc.sessionType.subscribed);
	this.util.send(xml);//发送XMPP消息
	
//	if(remark != undefined || group != undefined){
//		imc.updateRoster(imAccount, remark, group);
//	}
	
}
/**
 * 好友-拒绝
 * @param imAccount IM账号
 * @param reason 描述 非必填
 */
IMClient.prototype.refuseRoster = function(imAccount,reason){
	var imc = this;
	var msgId = this.util.getTimeRndString("onRefuseRoster");//消息ID
	
	var to = imAccount+imc.domin;
	
	var xml =this.util.rootNode(imc.element.presence,msgId,to,imc.sessionType.unsubscribe);
	if(!IM_isUndefined(reason)){
		xml.c("reason",reason).up();
	}
	this.util.send(xml);//发送XMPP消息
}


/**
 * 更改好友 信息
 * @param imAccount 好友IM账号
 * @param remark 好友备注名
 * @param group 分组
 */
IMClient.prototype.updateRoster = function(imAccount,remark,group){
	var imc = this;
	var msgId = this.util.getTimeRndString("updateRoster");//消息ID
	var jid = imAccount+imc.domin;
	var is_send = false;
	
	
	var xml =this.util.rootNode(imc.element.iq,msgId,undefined,imc.sessionType.set);
	var ele_query = xml.c('query').attrs({"xmlns":Strophe.NS.IM_ROSTERS});
	var ele_item = ele_query.c("item")
	ele_item.attrs({"jid":jid});
	if(remark != undefined){
		ele_item.attrs({"remark":remark});
		is_send = true;
	}
	if(group != undefined){
		ele_item.c("group",group);
		is_send = true;
	}
	if(is_send){
		this.util.send(ele_query);//发送XMPP消息
	}
}







