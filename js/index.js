mui.plusReady(function(){

var me_lacal={
	latitude:0,
	longitude:0,
}
var he_lacal={
	latitude:30.873211,
	longitude:120.106350,
	power:0,
	lose:1,
}
/*==============================创建地图===============================================*/
      	var map = new AMap.Map('div_map', {
            zoom:11,//级别
            //center:[116,39],//中心点坐标
        });
/*==============================创建标记===============================================*/
        var marker_me = new AMap.Marker({	
        	
		});
		marker_me.setMap(map);
		//marker_me.hide()
		
    	var marker_he = new AMap.Marker({	
        	
		});
		marker_he.setMap(map);
		//marker_he.hide()
		
	      //构造路线导航类
	    var driving = new AMap.Driving({
	        map: map,
	//      panel: "panel"
	    }); 

/*======================加入地图控件==========================================================*/
        // 同时引入工具条插件，比例尺插件和鹰眼插件
		AMap.plugin([
		    'AMap.ToolBar',
		    'AMap.Scale',
		], function(){
		    // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
		    map.addControl(new AMap.ToolBar());
		
		    // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
		    map.addControl(new AMap.Scale());
		});
/*==============================开机读取id key===============================================*/
		var _ID = plus.storage.getItem("ID");
		var _KEY = plus.storage.getItem("KEY");
		
		$("#ipt_id").val(_ID);
		$("#ipt_key").val(_KEY);	

/*==============================读取本机定位信息===============================================*/
plus.geolocation.watchPosition(
	function(position){
		me_lacal.latitude = position.coords.latitude;
		me_lacal.longitude = position.coords.longitude;
		marker_me.setPosition(new AMap.LngLat(me_lacal.longitude,me_lacal.latitude))
//		console.log(me_lacal.latitude)
//		console.log(me_lacal.longitude)
}, function(error ){
	console.log("出错")
}, {});

/*==============================显示菜单===============================================*/
$("#btn_meanu").click(function(){
	$("#div_view").toggle()
})
/*==============================确定修改id key===============================================*/
$("#btn_ok").click(function(){
	var _ID = $("#ipt_id").val();
	var _KEY = $("#ipt_key").val();
	
	plus.storage.setItem("ID", _ID);
	plus.storage.setItem("KEY", _KEY);
	
	mui.toast("设置成功")

})
/*==============================取消修改id key===============================================*/
$("#btn_cancel").click(function(){
	var _ID = plus.storage.getItem("ID");
	var _KEY = plus.storage.getItem("KEY");
	
	$("#ipt_id").val(_ID);
	$("#ipt_key").val(_KEY);
	
})
/*==============================确定修改 速度===============================================*/
$("#btn_speed_ok").click(function(){
	var _SPEED = $("#ipt_speed").val();
	
	plus.storage.setItem("SPEED", _SPEED);
	
	mui.toast("设置成功")

})
/*==============================取消修改 速度===============================================*/
$("#btn_speed_cancel").click(function(){
	var _SPEED = plus.storage.getItem("SPEED");
	
	$("#ipt_id").val(_SPEED);
	
})
/*==============================路径显示===============================================*/
var static_i=true;
$("#rd").click(function(){
	
	if(static_i){
		// 根据起终点经纬度规划驾车导航路线
	    driving.search(new AMap.LngLat(me_lacal.longitude, me_lacal.latitude), new AMap.LngLat(he_lacal.longitude,he_lacal.latitude), function(status, result) {
	        // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
	        if (status === 'complete') {
	            mui.toast('绘制驾车路线完成')
	        } else {
	            mui.toast('获取驾车数据失败：' + result)
	        }
	    });
	    static_i=false
	}else{
		static_i=true
		driving.clear()
	}
})
/*==============================视图观看===============================================*/
$("#lk").click(function(){
	map.setFitView()
})
/*==============================显示定位端===============================================*/
$("#he").click(function(){
	marker_he.setPosition(new AMap.LngLat(he_lacal.longitude,he_lacal.latitude))
	map.panTo(new AMap.LngLat(he_lacal.longitude,he_lacal.latitude))
	//marker_he.show()
})
/*==============================显示自己===============================================*/
$("#me").click(function(){
	marker_me.setPosition(new AMap.LngLat(me_lacal.longitude,me_lacal.latitude))
	map.panTo(new AMap.LngLat(me_lacal.longitude,me_lacal.latitude))
	console.log(me_lacal.latitude+","+me_lacal.longitude)
	//marker_me.show()
})


/*=============================与服务器通信================================================*/
		var ws = new WebSocket("ws://www.bigiot.net:8383");
		ws.onmessage=function(evt){
			resMsg = JSON.parse(evt.data)
			console.log("收到原始数据： "+evt.data)
			switch(resMsg.M){
				case "WELCOME TO BIGIOT":
					var _ID = plus.storage.getItem("ID");
					var _KEY = plus.storage.getItem("KEY");
					ws.send('{"M":"checkin","ID":"'+_ID+'","K":"'+_KEY+'"}')
					break;
				case "ping":
					ws.send('{"M":"beat"}')
					break;	
				case "say":
					var C = resMsg.C.split('_')
					
					if(C[4]=='A'){
						$("#tex_geo_way").html("LBS")
						he_lacal.longitude=C[0]
						he_lacal.latitude=C[1]
						$("#tex_geo_long").html(he_lacal.longitude)
						$("#tex_geo_lat").html(he_lacal.latitude)
					}							
					else if(C[4]=='V'){
						$("#tex_geo_way").html("GPS")
						he_lacal.longitude=C[2]
						he_lacal.latitude=C[3]
						$("#tex_geo_long").html(he_lacal.longitude)
						$("#tex_geo_lat").html(he_lacal.latitude)
					}
					marker_he.setPosition(new AMap.LngLat(he_lacal.longitude,he_lacal.latitude))
					
					var power=C[5]
					var lose =C[7]
					var speed=C[6]
					
					var local_speed=plus.storage.getItem("SPEED");
					
					$("#tex_power").html(power)
					$("#tex_lose").html(lose)
					$("#tex_speed").html(speed)
					
					if(speed>local_speed || lose==1){
						mui.toast("警报")
						plus.push.createMessage( "丢失警告警报", "payload",{
							cover:true,
							title:"警报",
						});
					}
					
					break;
			}
			
		}
		
/*=====================================================================================*/
})//mui.pulsready()



   
/*     116.481053_39.998204_116.081053_39.098204_A_98_55_1                            */