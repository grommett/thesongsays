function SlideShow(element){
	var e 		= element;
	var current = 0;
	var images 	= $(e).children("img");
	var total  	= images.length-1;
	var last	= $(images[0]);
	var scope 	= this;
	var slideHold = 5000;
	var buttons   = new Array();
	var b;
	var timeoutID;
	var loopCount = 1;
	
	init();
	
	function init()
	{

		if(total > 0)
		{
			for(var i=0; i<= total; i++)
			{
				if(i != current) $(images[i]).hide();
				b = new SlideButton($('#carousel_list'), i, selectImage);
				buttons.push(b);
			}
			var button = buttons[current];
			select(button);
			
			timeoutID = setTimeout(function(){autoPlay();}, slideHold);
		}else{
			
		}
	}
	
	function autoPlay()
	{
		var last = $(images[current]);
		last.fadeOut();
		if(current < total) timeoutID = setTimeout(function(){autoPlay();}, slideHold);
		current = ((current + 1) > total) ? 0 : current + 1;
		var button = buttons[current];
		select(button);
		$(images[current]).fadeIn();
	}
	

 	function selectImage (_button)
	{
		clearTimeout(timeoutID);
		var id = _button.id;
		select(_button)
		last = $(images[current]);
		last.fadeOut();
		current = id;
		$(images[current]).fadeIn();
	}
	
	function select(_button)
	{
		var i=0;
		var button;
		
		for(i in buttons)
		{
			button = buttons[i];
			if(button.id != _button.id) 
			{
				button.deselect();
			}else{
				button.select();
			}
		}
	}
}

function SlideButton(element, _id, _callBack)
{
	this.id = _id;
	var element = element;
	var h = element.html();
	var li = '<li id="li_'+	this.id+'" class="carousel_static">'+	this.id+'</li>';
	var callBack = _callBack;
	var button = this;
	
	element.append(li);
	
	$("#li_"+this.id).click(click);
	
	function click(e)
	{
		callBack(button);
		$("#li_"+button.id).removeClass('carousel_static');
		$("#li_"+button.id).addClass('carousel_selected');
	}
	
	this.deselect = function()
	{
		$("#li_"+String(this.id)).removeClass('carousel_selected');
		$("#li_"+String(this.id)).addClass('carousel_static');
	}
	
	this.select = function()
	{
		$("#li_"+button.id).removeClass('carousel_static');
		$("#li_"+button.id).addClass('carousel_selected');
	}
	
	this.click = function()
	{
		click(null);
	}
	
	return this;
}