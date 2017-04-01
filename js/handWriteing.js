var canvasWidth=Math.min(600,$(window).width()-20);
var canvasHeight= canvasWidth;
var isMouseDown=false;
var lastLoc={x:0,y:0};
var lastTimeStamp=0;
var lastLineWidth=-1;
var maxLineWidth=30;
var minLineWidth=1;
var maxStrokeV=10;
var minStrokeV=0.1;
var strokeColor="black";
window.onload=function(){
	$("#controller").css("width",Math.min(800,$(window).width()-20))
	var canvas=document.getElementById("canvas");
	var context=canvas.getContext("2d");
	canvas.width=canvasWidth;
	canvas.height=canvasHeight;
	drawGrid();
	$(".op_btn").click(function(){
		context.clearRect(0, 0, canvas.width, canvas.height);
		drawGrid();
	});
	$(".color_btn").click(function(){
		$(this).addClass('btn_selected').siblings('.color_btn').removeClass('btn_selected');
		strokeColor=$(this).css("backgroundColor");
	});
	function beginStroke(point){
		isMouseDown=true;
		 lastLoc=windowToCanvas(point.x,point.y);
		 lastTimeStamp=new Date().getTime();
	}
	function endStroke(){
		isMouseDown=false;
	}
	function moveStroke(point){
		var curLoc=windowToCanvas(point.x,point.y);
			var curTimeStamp=new Date().getTime();
			var s=calcDistance(lastLoc,curLoc);
			var t=curTimeStamp-lastTimeStamp;
			var lineWidth=calcLineWidth(t,s);
			context.beginPath();
			context.moveTo(lastLoc.x,lastLoc.y);
			context.lineTo(curLoc.x,curLoc.y);
			context.strokeStyle=strokeColor;
			context.lineWidth=lineWidth;
			context.lineCap="round";
			context.lineJoin="round";
			context.stroke();
			//console.log(lineWidth)
			lastLoc=curLoc;
			lastTimeStamp=curTimeStamp;
			lastLineWidth=lineWidth;
	}
	canvas.onmousedown=function(e){
		e.preventDefault();
		beginStroke({x:e.clientX,y:e.clientY});
	}
	canvas.onmouseup=function(e){
		e.preventDefault();
		endStroke();
		//console.log("onmouseup")
	}
	canvas.onmouseout=function(e){
		e.preventDefault();
		endStroke();
		//console.log("onmouseout")
	}
	canvas.onmousemove=function(e){
		e.preventDefault();
		if(isMouseDown){
			moveStroke({x:e.clientX,y:e.clientY});
		}
		
	}
	canvas.addEventListener("touchstart",function(e){
		e.preventDefault();
		touch=e.touches[0];
		beginStroke({x:touch.pageX,y:touch.pageY});
	});
	canvas.addEventListener("touchmove",function(e){
		e.preventDefault();
		if(isMouseDown){
			touch=e.touches[0];
			moveStroke({x:touch.pageX,y:touch.pageY});
		}
	});
	canvas.addEventListener("touchend",function(e){
		e.preventDefault();
		endStroke();
	});
	//坐标系的转换
	function windowToCanvas(x,y){
		var bbox=canvas.getBoundingClientRect();
		return {x:Math.round(x-bbox.left),y:Math.round(y-bbox.top)}
	}
	//获取两点距离
	function calcDistance(loc1,loc2){
		return Math.sqrt((loc1.x-loc2.x)*(loc1.x-loc2.x)+(loc1.y-loc2.y)*(loc1.y-loc2.y));
	}
	//获取线条粗细
	function calcLineWidth(t,s){
		var resultLineWidth;
		var v=s/t;
		if(v<=minStrokeV){
			resultLineWidth=maxLineWidth;
		}else if(v>=maxStrokeV){
			resultLineWidth=minLineWidth;
		}else{
			resultLineWidth=maxLineWidth-(v-minStrokeV)/(maxStrokeV-minStrokeV)*(maxLineWidth-minLineWidth);
		}
		if(lastLineWidth==-1){
			return resultLineWidth
		}
		return lastLineWidth*2/3+resultLineWidth*1/3
	}
	function drawGrid(){
		context.save();
		context.strokeStyle="rgb(230,11,9)";

		context.beginPath();
		context.moveTo(3,3);
		context.lineTo(canvas.width-3,3);
		context.lineTo(canvas.width-3,canvas.height-3);
		context.lineTo(3,canvas.height-3);
		context.closePath();
		context.lineWidth=6;
		context.stroke();

		context.beginPath();

		context.moveTo(0,0);
		context.lineTo(canvas.width,canvas.height);

		context.moveTo(0,canvas.height);
		context.lineTo(canvas.width,0);

		context.moveTo(0,canvas.height/2);
		context.lineTo(canvas.width,canvas.height/2);

		context.moveTo(canvas.width/2,0);
		context.lineTo(canvas.width/2,canvas.height);

		context.lineWidth=1;
		context.stroke();

		context.restore();
	}

}
