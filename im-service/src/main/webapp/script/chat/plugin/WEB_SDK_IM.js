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
})();

var m_isDug = true;

var IMClient = function(){
	var bsoh_conn = undefined;//连接
	var imc = this;
	var im_req = this.im_req = im_dom();
	var hson = this.hson = im_hson();
	
	
//	im_req.get("http://192.168.56.1:8888/im-service/demo/aa",{},function(val){
//		alert(val);
//	})
//	
	this.acc_type = 0;//IM账号类型
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
		unsubscribe:"unsubscribe",
		unavailable:"unavailable"
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
	
	
//	var CacheType = {
//			user_info:0,//用户信息
//			group_info: 1,//群信息
//			rosters:2,//好友列表
//			groups:3,//群
//			group_members:4//群成员
//		};
	/**
	 * 转换父房间
	 * @param type 0 基本信息 1 详情
	 * @param roomId 房间id
	 */
	var _paseRoomBaseObj = function(type,roomId){
		if(type > 1){
			return;
		}
		var obj = cacheOpt.getByData(CacheType.group_info,roomId);
		
		if(obj == undefined){
			//在此做http获取群详情操作
			
			
			
			cacheOpt.addCacheData(CacheType.group_info,roomId,obj);
		}
		
		
		if(tyep==0){//
			var base = {};
			base.roomId = obj.roomId;
			base.name =obj.name;
			base.ownerJid = obj.ownerJid;
			base.owner = obj.owner;
			base.createTime = obj.createTime;
			
			obj = base;
		}
		return obj;
	}
	
	this.EeleErrorBuilder = function(obj){
		
	}
	
	//参数------end
	
	
	/**
	 * 工具类
	 */
	var util  = {
			
			/**
			 * msgID
			 */
			getTimeRndString:function (to) {
				var tm=new Date();
				var str=tm.getMilliseconds()+tm.getSeconds()*60+tm.getMinutes()*3600+tm.getHours()*60*3600+tm.getDay()*3600*24+tm.getMonth()*3600*24*31+tm.getYear()*3600*24*31*12;
				
				var hex = parseInt((Math.random()*100000)*str).toString(16);
				var id = "WEBIM-"+""+hex;
				return id;
			},
			/**
			 * 消息发送
			 * @param xml报文
			 */
			send :function(xml){
				var t = xml.tree();
				util.toXMPPString(t);
				imc.bsoh_conn.send(t);
			},
			/**
			 * 针对IQ消息房东
			 */
			sendIQ : function(xml,callback,errback,timeout){
				var t = xml.tree();
				util.toXMPPString(t);
				imc.bsoh_conn.sendIQ(t,callback,errback,timeout);
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
//				if(_type == 'groupchat'){///房间
//					_to = '10'+imc.domin;
//				}
				
				
				
				//判断公共属性
				var xmpp = {id:_id/*,from:imc.account+imc.domin+imc.resource*/};
				if(_type){
					xmpp.type = _type;
				}
				
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
			/**Strophe.serialize(xml)
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
//				obj.sys = a_jid[0];
//				obj.source = a_jid[1];
//				obj.id = a_jid[2];
				return a_jid[2];
			}
			
	};
	
	this.ChatMessageListen = null;//聊天消息监听
	
	this.RoomListen = {//群监听
		/**
		 * 返回群的简要信息
		 * @param obj 
		 * {
		 * 	groupName:"群名字"
		 * 	describe："描述"
		 * }
		 */ 
		onCreateRoom:function(obj){
			
		},
		/**
		 * 直接邀请
		 * @param obj
		 * {
						fromJid:""//邀请人JID
						from:""//邀请人ID
						roomId:""//房间id
						name：""//房间名字
						members:[
							{
								localpartJid:"进去成员jid"//可能包含自己
								localpart:""//成员Id
							}
						}
			}
		 */
		onDirectInvitation:function(obj){
			
		},
		/**
		 * 间接邀请
		 * @param obj
		 * {
		 * 	
		 * }
		 */
		onMediatedInvitation:function(obj){
			
		},
		/**
		 * @param obj
		 * {
		 * 	roomId ： //房间Id
			localpartJid：//退出群成员jid
			localpart ： //退出群成员id
		 * }
		 */
		onExitRoom:function(obj){
			
		},
		/**
		 * 
		 * @param obj
		 * [
		 * {
		 * 	localpartJid:"",//成员Jid
			localpart:"",//成员id
			type : 成员类型
			remark ：备注
		 * }
		 * ]
		 */
		onRoomMember:function(obj){
			
		},
		/**
		 * @param obj
		 * 	{
		 * 	roomId ： //房间Id
			localpartJid://操作人JID
			localpart : //操作人id
			reason://描述
		 *  members: [//删除的成员
		 * 	{
			localpartJid：//退出群成员jid
			localpart ： //退出群成员id
			}
		 * ]
		 */
		onRemoveRoomMembers:function(obj){
			
		},
		/**
		 * 解散群
		 * @param obj
		 * {
		 * 	localpartJid : ;//操作人jid
			localpart : "";//操作人id
			roomId :  //群id
			reason ："" //描述
			}
		 */
		onDestroyRoom:function(obj){
			
		}
		
		
			
	}
	
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
	
	//****************************************************************************************************
	//****************************************************************************************************
	//****************************************客户端调用****************************************************
	//****************************************************************************************************
	//****************************************************************************************************


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
	this.sendMsg=function(sessionType,to,msgBuilder,cbError){
		if(IM_Length(to)){
			IM_log("发送方不能为空！");
			return;
		}
		
		if(IM_Length(msgBuilder._body)){
			IM_log("消息不能为空！");
			return;
		}
		
		//
		var msgId = util.getTimeRndString();//消息ID
		
		var jid = to+imc.domin;
		if(imc.sessionType.groupchat == sessionType){
			jid = to+imc.roomdomin;
		}
		
		var xml =util.rootNode(imc.element.message,msgId,jid,sessionType,msgBuilder._msgType);
		xml.c('body',JSON.stringify(msgBuilder)).up();
		//xml.c('sendtime',imc.util.sendtime()).up();
		
		util.send(xml);//发送XMPP消息
		
//		imc.handleEeceive('sendMsg',undefined,cbError);
	}

	/**
	 * 获取群列表
	 * 
	 * 
	 * @param cbError 成功回调
	 * @param cbError 失败回调
	 */
	this.getRoomList=function(cbSuccess,cbError){
		var msgId = util.getTimeRndString("getGroupList");//消息ID
		
		
		var xml =util.rootNode(imc.element.iq,msgId,imc.roomdomin.substring(1),imc.sessionType.get);
		xml.c('query').attrs({"xmlns":"http://jabber.org/protocol/disco#items"});
		util.send(xml);//发送XMPP消息
		
		imc.handleEeceive('getGroupList',cbSuccess,cbError);
	}



	/**
	 * 获取好友列表
	 * @param cbError 成功回调
	 * @param cbError 失败回调
	 */
	this.getRostersList=function(cbSuccess,cbError){
		var msgId = util.getTimeRndString("getRostersList");//消息ID
		
		var xml =util.rootNode(imc.element.iq,msgId,undefined,imc.sessionType.get);
		xml.c('query').attrs({"xmlns":Strophe.NS.IM_ROSTERS});
		util.send(xml);//发送XMPP消息
		
		imc.handleEeceive('getRostersList',cbSuccess,cbError);
	}

	/**
	 * 移除好友
	 * @param imAccount IM账号
	 * @param cbError 成功回调
	 * @param cbError 失败回调
	 */
	this.removeRoster = function(imAccount){
		var msgId = util.getTimeRndString("removeRosters");//消息ID
		
		var to = imc.account+imc.domin;
		var jid = imAccount+imc.domin;
		
		var xml =util.rootNode(imc.element.iq,msgId,to,imc.sessionType.set);
		var ele_query = xml.c('query').attrs({"xmlns":Strophe.NS.IM_ROSTERS});
		ele_query.c("item").attrs({"jid":jid,"subscription":"remove"});
		util.send(ele_query);//发送XMPP消息
		
		
//		<iq xmlns="jabber:client" to="hzong@free/cvlep" id="rsttig7" type="set">
//		<query xmlns="jabber:iq:roster">
//		<item jid="caocao@free" subscription="remove"/>
//		</query>
	//</iq>
	}


	/**
	 * 申请好友
	 * @param imAccount 米账号
	 * @param reason 申请内容
	 * @param cbSuccess 成功
	 * @param cbError 失败
	 */
	this.applyRoster = function(imAccount,reason){
		var msgId = util.getTimeRndString("applyRoster");//消息ID
		
		var to = imAccount+imc.domin;
		
		var xml =util.rootNode(imc.element.presence,msgId,to,imc.sessionType.subscribe);
		if(!IM_isUndefined(reason)){
			xml.c("reason",reason).up();
		}
		util.send(xml);//发送XMPP消息
	}
	/**
	 * 好友-同意
	 * @param imAccount 账号
	 */
	this.agreeRoster = function(imAccount/*,remark,group*/){
		var msgId = util.getTimeRndString("onAgreeRoster");//消息ID
		
		var to = imAccount+imc.domin;
		
		var xml =util.rootNode(imc.element.presence,msgId,to,imc.sessionType.subscribed);
		util.send(xml);//发送XMPP消息
		
//		if(remark != undefined || group != undefined){
//			imc.updateRoster(imAccount, remark, group);
//		}
		
	}
	/**
	 * 好友-拒绝
	 * @param imAccount IM账号
	 * @param reason 描述 非必填
	 */
	this.refuseRoster = function(imAccount,reason){
		var msgId = util.getTimeRndString("onRefuseRoster");//消息ID
		
		var to = imAccount+imc.domin;
		
		var xml =util.rootNode(imc.element.presence,msgId,to,imc.sessionType.unsubscribe);
		if(!IM_isUndefined(reason)){
			xml.c("reason",reason).up();
		}
		util.send(xml);//发送XMPP消息
	}


	/**
	 * 更改好友 信息
	 * @param imAccount 好友IM账号
	 * @param remark 好友备注名
	 * @param group 分组
	 */
	this.updateRoster = function(imAccount,remark,group){
		var msgId = util.getTimeRndString("updateRoster");//消息ID
		var jid = imAccount+imc.domin;
		var is_send = false;
		
		
		var xml =util.rootNode(imc.element.iq,msgId,undefined,imc.sessionType.set);
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
			util.send(ele_query);//发送XMPP消息
		}
	}
	/**
	 * 创建群
	 * <presence id="iHx8vv-312" to="我j@room.free/hzong" >
		<x xmlns="http://jabber.org/protocol/muc"></x>
	   </presence>
	   @param groupName 群名字
	   @param describe 描述
	   @param members 成员 
	   [
	   	{
	   	localpartJid：“”，
	   	}
	   ]
	 */
	this.createRoom = function(groupName,describe,members){
		var msgId = util.getTimeRndString("updateRoster");//消息ID
		var jid = groupName+imc.roomdomin;
		
		var obj = {xmlns:"http://jabber.org/protocol/muc"};
		if(describe != undefined){
			obj.describe=describe;
		}
		
		var xml =util.rootNode(imc.element.presence,msgId,jid);
		var x = xml.c("x",obj);
		
		if(members != undefined){
			for(var i=0; i < members.length;i++){
				var m_obj = members[i];
				x.c("item",{"jid":m_obj.localpartJid+imc.domin}).up();
			}
		}
		
		util.send(x);
	}
	
	
	
	
	/**
	 * 间接邀请-邀请非群成员用户但是不是直接加入而是需要同意、拒绝加入
	 * @param roomId 群id 必填
	 * @param localpartJid 接收方jid 必填
	 * @param reason 描述
	 */
	this.mediatedInvitationMember = function(obj){
		var msgId = util.getTimeRndString("inviteNonMembers");//消息ID
		var jid = obj.roomId+imc.roomdomin;
		
		var xml =util.rootNode(imc.element.message,msgId,jid);
		var x = xml.c("x",{xmlns:Strophe.NS.MUC_USER}	);
		var invite = x.c("invite",{"to":obj.localpartJid+imc.domin});
		if(!IM_isUndefined(obj.reason)){
			invite.c("reason",obj.reason);
		}
		util.send(xml);
	}
	
	/**
	 * 直接邀请
	 * @param roomId 群id 必填
	 * @param members 成员 必填
	 *  {
	 *  	{
			   	localpartJid：“”，
			}
		}
	 */
	this.directInvitationMembers = function(roomId,members){
		if(IM_isUndefined(members)){
			throw "members 不能为空";
		}

		var msgId = util.getTimeRndString("directInvitationMembers");//消息ID
		var jid = roomId+imc.roomdomin;
		
		var xml =util.rootNode(imc.element.message,msgId,jid);
		var x = xml.c("x",{xmlns:Strophe.NS.MUC_X_CONFERENCE}	);
		
		var o_mem = null;
		for(var i =0 ; i < members.length;i++){
			o_mem = {"jid":members[i].localpartJid+imc.domin};
			if(!IM_isUndefined(members[i].remark)){
				o_mem.remark = members[i].remark
			}
			x.c("item",o_mem).up();
		}
		
		
		util.send(xml);
	}
	
	
	/**
	 * 认证方拒绝
	 * @param roomId 群id 必填
	 * @param localpartJid 接收方jid 必填
	 * @param reason 描述
	 */
	this.declineRoomInvite = function(obj){
		var msgId = util.getTimeRndString("declineRoomInvite");//消息ID
		var jid = obj.roomId+imc.roomdomin;
		
		var xml =util.rootNode(imc.element.message,msgId,jid);
		var x = xml.c("x",{xmlns:Strophe.NS.MUC_USER}	);
		var agree = x.c("decline",{"to":obj.localpartJid+imc.domin});
		if(!IM_isUndefined(obj.reason)){
			agree.c("reason",obj.reason);
		}
		util.send(xml);
	}
	/**
	 * 认证方同意
	 * @param roomId 群id 必填
	 * @param localpartJid 接收方jid 
	 */
	this.agreeRoomInvite = function(obj){
		var msgId = util.getTimeRndString("agreeRoomInvite");//消息ID
		var jid = obj.roomId+imc.roomdomin;
		
		var xml =util.rootNode(imc.element.message,msgId,jid);
		var x = xml.c("x",{xmlns:Strophe.NS.MUC_USER}	);
		var invite = x.c("agree",{"to":obj.localpartJid+imc.domin});
		util.send(xml);
	}
	
	/**
	 * 认证方申请
	 * @param roomId 群id 必填
	 * @param localpartJid 接收方jid 必填
	 * @param reason 描述
	 */
	this.applyRoomInvite = function(obj){
		var msgId = util.getTimeRndString("applyRoomInvite");//消息ID
		var jid = obj.roomId+imc.roomdomin;
		
		var xml =util.rootNode(imc.element.message,msgId,jid);
		var x = xml.c("x",{xmlns:Strophe.NS.MUC_USER}	);
		var apply = x.c("apply");
		util.send(xml);
	}
	
	
	/**
	 * 退出群
	 * @param roomId 群id
	 */
	this.exitRoom = function(roomId){
		var msgId = util.getTimeRndString("exitRoom");//消息ID
		var jid = roomId+imc.roomdomin;
		
		var xml =util.rootNode(imc.element.presence,msgId,jid,imc.sessionType.unavailable);
		util.send(xml);
	}
	
	
	/**
	 * 踢出房间
	 * @param obj 
	 * {
	 * 	roomId:房间Id,
	 *	membersJid:{"","",""} JID
	 *  reason: 备注
	 * }
	 */
	this.removeRoomMembers = function(obj){
		var msgId = util.getTimeRndString("removeRoomMembers");//消息ID
		var jid = obj.roomId+imc.roomdomin;
		
		var xml =util.rootNode(imc.element.iq,msgId,jid,imc.sessionType.set);
		
		if(obj.membersJid  && obj.membersJid.length > 0){
			var query = xml.c("query",{"xmlns":Strophe.NS.MUC_ADMIN,"reason":obj.reason});
			for(var i = 0;i < obj.membersJid.length;i++){
				var mj = obj.membersJid[i];
				query.c("item",{"jid":mj+imc.domin}).up();
			}
			util.send(xml);
		}
	}
	
	/**
	 * 获取群成员
	 * @param roomId 群id
	 */
	this.getRoomMember = function(roomId){
		var msgId = util.getTimeRndString("getRoomMember");//消息ID
		var jid = roomId+imc.roomdomin;
		
		var xml =util.rootNode(imc.element.iq,msgId,jid,imc.sessionType.get);
		var query = xml.c("query",{"xmlns":Strophe.NS.MUC_ADMIN});
		query.c("item",{"affiliation":"member"});
		
		var callback = function(xml){
			var iq = new XMPP_XML(xml);
			var a_members = [];
			im_req(xml).find("query[xmlns=\""+Strophe.NS.MUC_ADMIN+"\"] item").each(function(i,item){
				var obj = {};
				obj.localpartJid = Strophe.getNodeFromJid(im_req(item).attr("jid"));
				obj.localpart = util.getLocalpart(obj.localpartJid);//成员id
				obj.type = im_req(item).attr("affiliation");
				obj.remark = im_req(item).attr("remark");
				a_members[a_members.length] = obj;
			});
			
			cacheOpt.addCacheData(CacheType.group_members,roomId,a_members);
			imc.RoomListen.onRoomMember(a_members);
		};
		util.sendIQ(xml, callback);
	}
	
	/**
	 * 解散群
	 * @param obj
	 * {
	 *  roomId 群id,
	 *  reason 描述原因 非必填
	 * }
	 */
	this.destroyRoom = function(obj){
		var msgId = util.getTimeRndString("destroyRoom");//消息ID
		var jid = obj.roomId+imc.roomdomin;
		
		var xml =util.rootNode(imc.element.iq,msgId,jid,imc.sessionType.set);
		var query = xml.c("query",{"xmlns":Strophe.NS.MUC_OWNER});
		var destroy = query.c("destroy");
		if(obj.reason){
			destroy.attrs({"reason":obj.reason});
		}
		
//		var callback = function(xml){
//			var iq = new XMPP_XML(xml);
//			im_req(iq).find("query[xmlns='+"+Strophe.NS.MUC_ADMIN+"+'] item").each(function(i,item){
//				
//			});
//		};
		
		util.sendIQ(xml);
	}
	
	
	
	//****************************************************************************************************
	//****************************************************************************************************
	//*********************************************监听****************************************************
	//****************************************************************************************************
	//****************************************************************************************************
	
	/**
	 * 添加监听
	 */
//	this.addListen = function(){
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
		 * 获取元素属性
		 */
		var getEle_attr = function(xml,node,attr){
			var node = getEle_node(xml,node);
			if(node.length > 0){
				return node[0].getAttribute(attr);
			}
			return undefined;
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
//						if(IM_IsArray(obj)){//数组
//							obj.push(key);
//						}else{
							obj[key] = val;
//						}
					},
					removeCacheData: function(type,key){
						var obj = this.getCacheDataType(type);
						
//						if(IM_IsArray(obj)){//数组
//								obj.splice(key, 1);
//						}else{
							delete obj[key];
//						}
					},
					isExists:function(type,key){
						return getByData(type, key) == undefined;
					}
		};
		
		
		var oncbHandle = null;
		
		 // IQ相关对象
		/**
		 * 获取群列表
		 * 
		 * [
		 * 	{
		 * 		roomId:12//群id
		 * 		name: ""//群名字
		 * 		ownerJid: ""//创建人jid
		 * 		owner:""//创建人id,
		 * 		createTime:""//创建时间
		 * 	}
		 * ]
		 * 
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
						msg.items[i].roomId =item.getAttribute('jid');//群ID
						msg.items[i].ownerJid = Strophe.getNodeFromJid(item.getAttribute('create'));//创建人JID
						msg.items[i].owner = util.getLocalpart(msg.items[i].ownerJid);//业务账号Id
						msg.items[i].createTime = item.getAttribute("date");
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
						

						msg.items[i].localpartJid =Strophe.getNodeFromJid(item.getAttribute('jid'));//好友jid
						msg.items[i].localpart = util.getLocalpart(msg.items[i].localpartJid);//好友id

						//客户端使用
						
						//缓存
						cacheOpt.addCacheData(CacheType.rosters,msg.items[i].localpartJid, msg.items[i]);
						//调用回调
						oncbHandle(msg.items[i],i);
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
					var jid = Strophe.getNodeFromJid(item.getAttribute('jid'));//好友id
					var localpart = util.getLocalpart(jid);//好友id
					var obj = {
						"localpart":localpart,
						"localpartJid":jid
					};
					
					
					if(IM_isUndefined(imc.RosterListen.onRemoveRoster)){
						IM_log("未注册聊天聊天监听（removeRosters）");
						return;
					}
					cacheOpt.removeCacheData(CacheType.rosters, jid);
					imc.RosterListen.onRemoveRoster(obj);//删除好友
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
			var jid = Strophe.getNodeFromJid(msg.from);
			var localpart = util.getLocalpart(jid);//好友id
			
			var obj = {};
//			obj.remark = undefined;//备注名
//			obj.group = undefined;//分组
			obj.localpartJid =jid;//好友jid
			obj.localpart = localpart;
			
			cacheOpt.addCacheData(CacheType.rosters, jid, obj);
			imc.RosterListen.onAgreeRoster(obj);
		}
		
		var refuseRoster=function(xml,msg){//拒绝好友
			var reason = getEle_text(xml,'reason');
			var jid = Strophe.getNodeFromJid(msg.from);
			var obj = {};
			obj.localpartJid =jid;//好友jid
			obj.localpart = util.getLocalpart(jid);
			obj.reason = reason;
			imc.RosterListen.onRefuseRoster(obj);
		}
		
		var createRoom =function(xml,msg){//创建群
			var from_jid = Strophe.getNodeFromJid(msg.from);
			var to_jid = Strophe.getNodeFromJid(msg.to);
			var obj = {
				roomId:from_jid,//群id
				name:Strophe.getResourceFromJid(msg.from),//群名称
				describe:getEle_attr(xml,"x","describe"),//描述
				owner:util.getLocalpart(to_jid),//创建人
				ownerJid:to_jid//创建人JID
			};
			
//			//添加缓存
//			cacheOpt.addCacheData(CacheType.group_info, obj.roomId, obj);
			
			//添加缓存房间列表
			var a_room = cacheOpt.getByData(CacheType.groups, to_jid) || [];//获取缓存列表
			//追加值
			a_room[a_room.length] = {
				roomId:obj.roomId,//群id
				name:obj.name,//房间名字
				owner:obj.owner,//创建人
				ownerJid:obj.ownerJid//创建人JID
			};
			cacheOpt.addCacheData(CacheType.groups, to_jid, a_room);
			
			imc.RoomListen.onCreateRoom(obj);
		}
		
		
		var _removeMemberCache = function(roomId,members){
			var mr = cacheOpt.getByData(CacheType.group_members,roomId);
			if(!mr){
				return;
			}
			var a_member = [];
			
			var result = false;
			im_req.each(mr,function(j,mem){
				im_req.each(members,function(i,item){
					if(item.localpartJid == mem.localpartJid){
						return result = true;
					}
				});
				if(!result){
					a_member[a_member.length] = mem;
				}
				result = false;
			});
			cacheOpt.addCacheData(CacheType.group_members, roomId, a_member);
		}
		
		var exitRoom = function(xml,msg){
			var roomId = Strophe.getNodeFromJid(msg.from);
			var jid = Strophe.getNodeFromJid(im_req(xml).find("x item").attr("jid"));
			var obj = {};
			obj.roomId = roomId;
			obj.localpartJid =jid;//退出群成员jid
			obj.localpart = util.getLocalpart(jid);//退出群成员id
			
			_removeMemberCache(roomId,[obj]);
			
			imc.RoomListen.onExitRoom(obj);
		}
		
		var removeRoomMembers = function(xml,msg){
			var roomId = Strophe.getNodeFromJid(msg.from);
			var a_member = [];
			var obj = {};
			obj.roomId = roomId;
			obj.localpartJid = Strophe.getResourceFromJid(msg.from);
			obj.localpart =  util.getLocalpart(obj.localpartJid);
			obj.reason = getEle_attr(xml,"x","reason");
			im_req(xml).find("x item").each(function(i,item){
				var jid = Strophe.getNodeFromJid(im_req(item).attr("jid"));
				var member = {};
				member.localpartJid =jid;//退出群成员jid
				member.localpart = util.getLocalpart(jid);//退出群成员id
				a_member[a_member.length] = member
			});
			obj.members = a_member;
			
			
			_removeMemberCache(roomId,obj.members);
			imc.RoomListen.onRemoveRoomMembers(obj);
		}
		
		var destroyRoom = function(xml,msg){
			var destroy = im_req(xml).find("x destroy");
			if(!destroy){
				return;
			}
			var obj = {};
			obj.localpartJid = Strophe.getResourceFromJid(msg.from);//操作人jid
			obj.localpart = util.getLocalpart(obj.localpartJid);//操作人id
			obj.roomId = Strophe.getNodeFromJid(msg.from);
			obj.reason = destroy.attr("reason");
			imc.RoomListen.onDestroyRoom(obj);
		}
		
		
		var listens = {
			onMessage:function(xml){
				util.toXMPPString(xml);
				
				
				var msg = new XMPP_XML(xml);
				var xmlns = getEle_attr(xml,"x","xmlns");
				//针对群操作处理
				if(xmlns == Strophe.NS.MUC_X_CONFERENCE){
					
					var a_obj = {};
					//公共部分后期使用_paseRoomBaseObj来设置
					a_obj.roomId = Strophe.getNodeFromJid(msg.from);
					a_obj.name = a_obj.roomId;
					a_obj.ownerJid = "";
					a_obj.owner = "";
					a_obj.createTime = "";
//					此处是其他字段
					a_obj.fromJid=Strophe.getResourceFromJid(msg.from),//邀请人JID
					a_obj.from=util.getLocalpart(a_obj.fromJid)//邀请人ID
					a_obj.members = [];
					
					//解析成员
					im_req(xml).find("x item").each(function(i,item){
						var obj = {};
						obj.localpartJid= Strophe.getNodeFromJid(item.getAttribute("jid"));//成员jid
						obj.localpart=util.getLocalpart(obj.localpartJid);//成员id
						obj.remark=item.getAttribute("remark");//备注
						a_obj.members[a_obj.members.length] = obj;
					});
					imc.RoomListen.onDirectInvitation(a_obj);
					return;
				}else if(xmlns == Strophe.NS.MUC_USER){
					var obj = {};
					obj.roomId = Strophe.getNodeFromJid(msg.from);
					obj.fromJid = Strophe.getNodeFromJid(im_req(xml).find("x invite").attr("from"));
					obj.from = util.getLocalpart(obj.fromJid);
					obj.reason = im_req(xml).find("x invite reason").html();
					imc.RoomListen.onMediatedInvitation(obj);
					
				}
				
				if(msg.type == imc.sessionType.chat || msg.type == imc.sessionType.groupchat){//单聊、群聊
					//消息公共部分
					var body = parseObject(getEle_text(xml,'body'));
					msg.body = body._body;
					msg.ext = body._ext;
					msg.sendtime =util.sendtime();

					
					if(IM_isUndefined(imc.ChatMessageListen)){
						IM_log("未注册聊天聊天监听（ChatMessageListen）");
						return false
					}
					
					if(imc.sessionType.chat == msg.type){
					}else if(imc.sessionType.groupchat == msg.type){
						msg.room = getEle_text(xml,'room');//获取房间
					}
					
					imc.ChatMessageListen(msg.type,msg);
				}
				
				return true;
			},
			onPresence:function(xml){//在线包
				util.toXMPPString(xml);
				
				var presence = new XMPP_XML(xml);
				
				if(imc.sessionType.subscribe == presence.type ){//申请添加好友-发送
					applyRoster(xml, presence);
				}else if(imc.sessionType.subscribed == presence.type ){//申请添加好友-同意
					agreeRoster(xml, presence);
				}else if(imc.sessionType.unsubscribe == presence.type ){//申请添加好友-拒绝
					refuseRoster(xml, presence);
				}else if(presence.type == undefined ){
					if(getEle_attr(xml,"x","xmlns") == Strophe.NS.MUC_BASE){//创建群
						createRoom(xml,presence);
					}
				}else if(imc.sessionType.unavailable == presence.type){//退群
					var xmlns = getEle_attr(xml,"x","xmlns");
					var status = getEle_attr(xml,"x","status");
					if(xmlns== Strophe.NS.MUC_USER && status == 110){//退群
						exitRoom(xml,presence);
					}else if(xmlns== Strophe.NS.MUC_USER && status == 307){//退群
						removeRoomMembers(xml,presence);
					}else if(xmlns== Strophe.NS.MUC_USER){
						destroyRoom(xml,presence);
					}
				}
				
			},
			onIQ:function(xml){//IQ包拦截
				util.toXMPPString(xml);
				
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
		
		
		
//	}
	
	
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
	IMClient.prototype.onConnect= function(paras){
		var imc = this;
		this.domin = "@free";
		this.roomdomin = "@room.free";
		this.resource = '/webim';
		 
		var account =imc.account = paras.source+"_"+paras.account;
		var login_account = account+imc.domin;
		var wait = 30;
		
		
		//登录
		imc.bsoh_conn.connect(login_account,paras.password,this.status,wait);
//		imc.addListen();
		//message报文
		imc.bsoh_conn.addHandler(onListens,null,null,null,null,null);
		
		//新跳包
		var handler = function(){
			var xml=  $iq({to: account+imc.domin, type: "get", id: "ping1"}).c("ping", {xmlns: "urn:xmpp:ping"});
			util.send(xml);//发送XMPP消息
	    };
		//setTimeout( handler , 1000*5,11); //50秒发一次ping包 ct.sendpingtimer
		
	}
	
	
	
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
 * 连接事件
 * @param appTag 应用标签
 * @param account 平台账号
 * @param statusEvent
 * {
 * 	onConnecting,//连接中事件
 *  onDisconnected，//断开连接事件
 *  onConnected//连接成功
 * }
 */
IMClient.prototype.initialize = function(statusEvent){
	this.bosh_server = "http://192.168.56.1:5280/";
	var bsoh_conn = this.bsoh_conn = new Strophe.Connection(this.bosh_server);
	var imc = this;
	
	var datetime = new Date();
	
	this.status = function(status){
		if (status == Strophe.Status.CONNECTING) {
			statusEvent.onConnecting();//连接中事件
	    } else if (status == Strophe.Status.CONNFAIL) {
	    	statusEvent.onDisconnected();//断开连接事件
	    } else if (status == Strophe.Status.DISCONNECTING) {
	    	statusEvent.onConnecting();//连接中事件
	    } else if (status == Strophe.Status.DISCONNECTED) {
	    	statusEvent.onDisconnected();//断开连接事件
//	    	IM_log(datetime.getTime()-oldtime);
	    } else if (status == Strophe.Status.CONNECTED) {
	    	statusEvent.onConnected();//连接成功
	    	bsoh_conn.send($pres().tree());
//	    	oldtime = datetime.getTime();
	    }
	};
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








