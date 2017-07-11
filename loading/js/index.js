function lazy(options){
	var tmp=options.id?document.getElementById(options.id):document;
	if(tmp===null) return ;
	//获取所有的图片
	var imgs=tmp.getElementsByTagName("img"),
		imgslen=imgs.length,
		imgobj=[];  //存放图片的data-src属性
	for(var i=0;i<imgslen;i++){
		var imgL=imgs[i];
		if(imgL.getAttribute("data-src")!==null){
			if(loadscroll(imgL)){
				setimg(imgL)
			}else{
				imgobj.push(imgL)
			}
		}
	}
	var len=imgobj.length
	function hanble(){
		//console.log(len);
		for(var i=0;i<len;i++){
			var imgO=imgobj[i]
			if(loadscroll(imgO)){
				_setimg(imgO);
				imgobj.splice(i,1);
				len--;

				
				if(len===0){scrollstop()}
			}
		}
	}
	function loadscroll(ele){
		//获取距离顶部的距离
		var scrollTop=document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
		if(ele === "undefined") return false;
		//加载距离
		var edit=~~ele.getAttribute("data-range") || options.lazyRange;
		//图片距离顶部的距离=滚动的距离+可视区高度
		var clientHeight=scrollTop+document.documentElement.clientHeight+edit;
		var offsetTop=0;
		while(ele.tagName.toUpperCase() !== "BODY"){
			offsetTop+=ele.offsetTop;
			ele=ele.offsetParent;
		}
		return (clientHeight>offsetTop)
	}
	function _setimg(ele){
		if(options.lazyTime){
			setTimeout(function(){
				setimg(ele)
			},options.lazyTime)
		}else{
			setimg(ele)
		}
	}
	//将图片的真实地址付给src
	function setimg(ele){
		ele.src=ele.getAttribute("data-src")
	}
	function scrollstop(){
		window.removeEventListener?window.removeEventListener("scroll",hanble,false):window.detachEvent("onscroll",hanble)
	}	
	window.addEventListener?window.addEventListener("scroll",hanble,false):window.attachEvent("onscroll",hanble)
}