function ContextMenu(menu){
	var self = this;
	var num = ContextMenu.count++;

	this.menu = menu;
	this.contextTarget = null;

	if(!(menu instanceof Array)){
		throw new Error("Argument 1 must be of type Array");
	}

	window.addEventListener("resize", function(){
		var menu = document.getElementById('cm_' + num);

		if(typeof menu !== "undefined"){
			menu.classList.remove("display");
		}
	});

	this.reload = function(){
		if(document.getElementById('cm_' + num) == null){
			var cnt = document.createElement("div");
			cnt.className = "cm_container";
			cnt.id = "cm_" + num;

			document.body.appendChild(cnt);
		}

		var container = document.getElementById('cm_' + num);
		container.innerHTML = "";

		container.appendChild(renderLevel(menu));
	}

	function renderLevel(level){
		var ul_outer = document.createElement("ul");

		level.forEach(function(item){
			var li = document.createElement("li");
			li.menu = self;

			if(typeof item.type === "undefined"){
				var icon_span = document.createElement("span");
				icon_span.className = 'cm_icon_span';

				icon_span.innerHTML = ContextUtil.getProperty(item, "icon", "");

				var text_span = document.createElement("span");
				text_span.className = 'cm_text';

				text_span.innerHTML = ContextUtil.getProperty(item, "text", "item");

				var sub_span = document.createElement("span");
				sub_span.className = 'cm_sub_span';

				if(typeof item.sub !== "undefined"){
					sub_span.innerHTML = '&#155;';
				}

				li.appendChild(icon_span);
				li.appendChild(text_span);
				li.appendChild(sub_span);

				if(!ContextUtil.getProperty(item, "enabled", true)){
					li.setAttribute("disabled", "");
				}else{
					if(typeof item.events === "object"){
						var keys = Object.keys(item.events);

						for(var i = 0; i < keys.length; i++){
							li.addEventListener(keys[i], item.events[keys[i]]);
						}
					}

					if(typeof item.sub !== "undefined"){
						li.appendChild(renderLevel(item.sub));
					}
				}
			}else{
				if(item.type == ContextMenu.DIVIDER){
					li.className = "cm_divider";
				}
			}

			ul_outer.appendChild(li);
		});

		return ul_outer;
	}

	this.display = function(e, target){
		if(typeof target !== "undefined"){
			self.contextTarget = target;
		}else{
			self.contextTarget = e.target;
		}

		var menu = document.getElementById('cm_' + num);

		var clickCoords = ContextUtil.getPosition(e);
		var clickCoordsX = clickCoords.x;
		var clickCoordsY = clickCoords.y;

		var menuWidth = menu.offsetWidth + 4;
		var menuHeight = menu.offsetHeight + 4;

		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;

		if((windowWidth - clickCoordsX) < menuWidth){
			menu.style.left = windowWidth - menuWidth + "px";
		}else{
			menu.style.left = (clickCoordsX + 2) + "px";
		}

		if((windowHeight - clickCoordsY) < menuHeight){
			menu.style.top = windowHeight - menuHeight + "px";
		}else{
			menu.style.top = (clickCoordsY + 2) + "px";
		}

		var sizes = ContextUtil.getSizes(menu);

		if((windowWidth - clickCoordsX) < sizes.width){
			menu.classList.add("cm_border_right");
		}else{
			menu.classList.remove("cm_border_right");
		}

		if((windowHeight - clickCoordsY) < sizes.height){
			menu.classList.add("cm_border_bottom");
		}else{
			menu.classList.remove("cm_border_bottom");
		}

		menu.classList.add("display");

		window.addEventListener("click", documentClick);

		e.preventDefault();
	}

	function documentClick(){
		document.getElementById('cm_' + num).classList.remove("display");
		window.removeEventListener("click", documentClick);
	}

	this.reload();
}

ContextMenu.count = 0;
ContextMenu.DIVIDER = "cm_divider";

const ContextUtil = {
	getProperty: function(options, opt, def){
		if(typeof options[opt] !== "undefined"){
			return options[opt];
		}else{
			return def;
		}
	},

	getSizes: function(obj){
		var lis = obj.getElementsByTagName('li');

		var width_def = 0;
		var height_def = 0;

		for(var i = 0; i < lis.length; i++){
			var li = lis[i];

			if(li.offsetWidth > width_def){
				width_def = li.offsetWidth;
			}

			if(li.offsetHeight > height_def){
				height_def = li.offsetHeight;
			}
		}

		var width = width_def;
		var height = height_def;

		for(var i = 0; i < lis.length; i++){
			var li = lis[i];

			var ul = li.getElementsByTagName('ul');
			if(typeof ul[0] !== "undefined"){
				var ul_size = ContextUtil.getSizes(ul[0]);

				if(width_def + ul_size.width > width){
					width = width_def + ul_size.width;
				}

				if(height_def + ul_size.height > height){
					height = height_def + ul_size.height;
				}
			}
		}

		return {
			"width": width,
			"height": height
		};
	},

	getPosition: function(e){
		var posx = 0;
		var posy = 0;

		if (!e) var e = window.event;

		if(e.pageX || e.pageY){
			posx = e.pageX;
			posy = e.pageY;
		}else if (e.clientX || e.clientY){
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		return {
			x: posx,
			y: posy
		}
	}
};

/*

var menu = [
	{
		"text": "Open",
		"icon": '<img src="images/open.png" />',
		"enabled": true,
		"events": {
			"click": function(e){
				console.log("clicked");
			}
		},
		"sub": [
			{
				"text": "New",
				"icon": '<img src="
		]
	}
];

*/
