;(function (win, doc) {
	//获取父元素下的子元素
	var $ = function (s, parent) {
		return (parent || document).querySelectorAll(s);
	}
	//创建元素函数
	var crtEle = function (s) {
		return document.createElement(s);
	}
	var index = 0 ,
		clsName = "layer",
		loop = function () {},
		extend = function (target, opts) {
			for (var key in opts) {
				target[key] = opts[key];
			}

			return target;
		},
		timer = {};
	//扩展对象
	function mLayer(opts) {
		this.settings = {
			shadow: true,
			type: 1,
			shadowClose: true, 
			init: loop,
			yes: loop,
			cancel: loop,
			end: loop,
		}

		extend(this.settings, opts)
		this.render();
	}
	//渲染弹出框
	mLayer.prototype.render = function () {
		this.index = index;
		var settings = this.settings;

		// 渲染主体
		var layerBox = this.layerBox = crtEle("div");
		this.id = layerBox.id = clsName + index;
		layerBox.className = clsName + " " + clsName + settings.type;

		// 渲染阴影
		var shadeEle = settings.shadow ? "<div class='" + clsName + "-mask layer-fadeIn'></div>" : "";
		//渲染内容框
		var titleEle = settings.title ? "<div class='" + clsName + "-title" + "'> " + settings.title + " </div>": "";
		var contentEle = this.contentEle = settings.content ? "<div class='layer-content'>" + settings.content + "</div>" : "";
		//图片
		if (settings.type === 2) {
			var msgEle = "<div class='layer-msg layer-fadeIn'>" + settings.content + "</div>";
			this.layerBox.innerHTML = shadeEle + msgEle;
			this.show();
			return
		}
		//加载动画
		if (settings.type === 3) {
			mlayer.closeAll(3);
			var loadEle = "<div class='layer-loading layer-fadeIn'></div>";
			this.layerBox.innerHTML = shadeEle + loadEle;
			this.show();
			return
		}
		//按钮
		var btnsEle = "";
		if (settings.btns) {
			typeof settings.btns === "string" && (settings.btns = [settings.btns]);
			var btnEle = "<span class='layer-btn layer-btn-yes'>" + settings.btns[0] + "</span>";
			if (settings.btns.length >= 2) {
				btnEle += "<span class='layer-btn layer-btn-no'>" + settings.btns[1] + "</span>";
			}
			btnsEle = "<div class='layer-btns'>" + btnEle + "</div>" 
		}

		layerBox.innerHTML = shadeEle + "<div class='layer-main layer-scaleIn'>" + titleEle + contentEle + btnsEle + "</div>";

		this.show();

	}
	mLayer.prototype.show = function () {
		

		this.settings.init();

		document.body.appendChild(this.layerBox);
		this.ele = $("#" + clsName + index)[0];
		index ++;
		this.action();
	}
	
	mLayer.prototype.action = function () {
		var that = this;
		var settings = this.settings;

		if (settings.time) {
			timer[this.index] = setTimeout(mlayer.close, settings.time, this);
		}

		this.shadowEle = $(".layer-mask", this.ele)[0];
		this.yesBtn = $(".layer-btn-yes", this.ele)[0];
		this.noBtn = $(".layer-btn-no", this.ele)[0];

		if (settings.shadowClose && this.shadowEle) {
			this.shadowEle.addEventListener("click", function () {
				var cliked  = this.getAttribute('click');

				if (!cliked) {
					settings.cancel(that);
					mlayer.close(that);
				}

				this.setAttribute("click", "clicked")
			});
		}

		if (this.yesBtn) {
			this.yesBtn.addEventListener("click", function (e) {
				var cliked  = this.getAttribute('click');

				if (!cliked) {
					settings.yes(that);
					mlayer.close(that);
				}
				
				this.setAttribute("click", "clicked")
			});
		}
		
		if (this.noBtn) {
			this.noBtn.addEventListener("click", function (e) {
				var cliked  = this.getAttribute('click');

				if (!cliked) {
					settings.cancel(that);
					mlayer.close(that);
				}
				
				this.setAttribute("click", "clicked")
			});
		}
	}

	win.mlayer = {
		open (opts) {
			return new mLayer(opts);
		},
		close (layer) {
			clearTimeout(timer[layer.index]);

			layer.ele.innerHTML = "";
			document.body.removeChild(layer.ele);
			layer.settings.end(layer);
		},
		closeAll (type) {
			var eles = $("." + clsName + (type?type:""));
			for(var i = 0 ; i < eles.length; i ++) {
				eles[i].innnerHTML = "";
				eles[i].parentNode.removeChild(eles[i]);
			}
		},
		alert (content, opts) {
			return new mLayer(extend({
				type: 1,
				title: "信息",
				content: content,
				btns: "确定",
				shadowClose: false
			}, opts));
		},
		confirm (content, opts) {
			return new mLayer(extend({
				type: 1,
				title: "信息",
				content: content,
				btns: ["确定","取消"],
				shadowClose: false
			}, opts));
		},
		load (opts) {
			opts = opts || {}
			opts.type = 3;
			opts.shadowClose = false;
			return new mLayer(opts);
		},
		msg (content, time) {
			return new mLayer({
				type: 2,
				shadowClose: false,
				content: content||'',
				time: time || 4000,
				shadow: false
			});
		}
	}
})(window, document);
