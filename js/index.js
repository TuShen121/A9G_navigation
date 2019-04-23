/*==============================显示菜单===============================================*/
$("#btn_meanu").click(function(){
	$("#div_view").toggle()
})
/*==============================创建地图===============================================*/
      	var map = new AMap.Map('div_map', {
            zoom:11,//级别
            //center:[116,39],//中心点坐标
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
/*=============================与服务器通信================================================*/
		var ws = new WebSocket("ws://www.bigiot.net:8383");
		ws.onmessage=function(evt){
			resMsg = JSON.parse(evt.data)
			console.log("收到原始数据： "+evt.data)
			switch(resMsg.M){
				case "WELCOME TO BIGIOT":
					console.log("收到wc")
					break;
				case "ping":
					ws.send('{"M":"beat"}')
					break;				
			}
			
		}