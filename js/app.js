// ioESP JavaScript & jQuery Library

// $(document).ready(function(e) { onDeviceReady(); });

function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
	if(typeof(Storage) === "undefined") {
    	window.alert("Sorry! No Web Storage support..");
	}
	
	var ip = localStorage.ip;
	if (!IPValid(ip))
		localStorage.ip = ip = "192.168.4.1";
	$(".ipedit-popup").find("div.sub-text").text(ip);
	
	SlideManu = false;
	Dialog = popup = false;
	DialogName = "";
	popupname = "";
	pinNumberToGPIOPin = [2, 4, 5, 12, 13, 14, 15, 16];
	
	UpDateListAll();

	$(".slide-menu-show").click(function(e) {
        $("#slide-menu").show().css({"transition": "300ms", "-webkit-transition": "300ms", "-webkit-transform": "translate(280px, 0)", "box-shadow": "0 0 5px rgba(0, 0, 0, 0.5)"});
		$("#back-background").fadeIn(300);
		SlideManu = true;
    });
	
	$(".slide-menu-hide").click(function(e) {
        $("#slide-menu").css({"transition": "300ms", "-webkit-transition": "300ms", "-webkit-transform": "translate(0, 0)", "box-shadow": "none"});
		$("#back-background").fadeOut(300);
		SlideManu = false;
    });
	
	$("#slide-menu > .menu-list li > a").click(function(e) {
        $(".slide-menu-hide").click();
		$("[data-type='page']").each(function(index, element) {
            $(this).hide();
        });
		$("[data-type='page'][data-page='" + $(this).attr("data-href") + "']").show();
		$("#title").text($("[data-type='page'][data-page='" + $(this).attr("data-href") + "']").attr("data-title"));
		$("body > header > .icon-right").remove();
		if ($("[data-type='page'][data-page='" + $(this).attr("data-href") + "']").attr("data-icon-right"))
			$("body > header").prepend('<span class="icon-right"><i class="' + $("[data-type='page'][data-page='" + $(this).attr("data-href") + "']").attr("data-icon-right").replace(/\,/g, ' ') + '"></i></span>');
		if ($(this).attr("data-href") == 'manage'){
			$(".new-io").click(function(e) {
                $("#new-dialog").css({"transition": "300ms", "-webkit-transition": "300ms", "-webkit-transform": "translate(0, 0)"});
				Dialog = true;
				DialogName = "#new-dialog";
            });
		}
    });
	
	$(document).swipe( {
        swipeStatus:function(event, phase, direction, distance , duration , fingerCount) {
           // console.log("swiped " + direction + " : " + distance + ' px');
			if (popup == false){
				if (Dialog == false){
					if (SlideManu == false && direction == "right" && distance <= 280)
						$("#slide-menu").show().css({"transition": "none", "-webkit-transition": "none", "-webkit-transform": "translate(" + distance + "px, 0)", "box-shadow": "0 0 5px rgba(0, 0, 0, 0.5)"});
					else if (SlideManu == true && direction == "left" && distance <= 280)
						$("#slide-menu").show().css({"transition": "none", "-webkit-transition": "none", "-webkit-transform": "translate(" + (280 - distance) + "px, 0)", "box-shadow": "0 0 5px rgba(0, 0, 0, 0.5)"});
					if(phase === $.fn.swipe.phases.PHASE_END || phase === $.fn.swipe.phases.PHASE_CANCEL) {
						if (SlideManu == false)
							$(".slide-menu-hide").click();
						else if (SlideManu == true)
							$(".slide-menu-show").click();
					}
				}else{
					if (direction == "right")
						$(DialogName).css({"transition": "none", "-webkit-transition": "none", "-webkit-transform": "translate(" + distance + "px, 0)"});
					if(phase === $.fn.swipe.phases.PHASE_END || phase === $.fn.swipe.phases.PHASE_CANCEL) {
						$(DialogName).css({"transition": "300ms", "-webkit-transition": "300ms", "-webkit-transform": "translate(0, 0)"});
					}
				}
			}
        },
        swipe:function(event, direction, distance, duration, fingerCount) {
			if (popup == false){
				if (Dialog == false){
					if (SlideManu == false && direction == "right")
						$(".slide-menu-show").click();
					else if (SlideManu == true && direction == "left")
						$(".slide-menu-hide").click();
				}else{
					$(DialogName).css({"transition": "300ms", "-webkit-transition": "300ms"}).css({"-webkit-transform": "translate(100%, 0)"});
					Dialog = false;
				}
			}
        },
		fingers:$.fn.swipe.fingers.ALL  
	});
	
	$(".DialogCancel").click(function(e) {
        $(DialogName).css({"transition": "300ms", "-webkit-transition": "300ms", "-webkit-transform": "translate(100%, 0)"});
		Dialog = false;
		DialogName = "";
    });
	
	$(".Edit-Save").click(function(e) {
		$("#edit-form").submit();
    });
	
	$(".New-Save").click(function(e) {
		$("#newio-form").submit();
	});
	
	$("#newio-form").submit(function(e) {
        e.preventDefault();
		if ($("#new-name").val().length <= 0){
			$("#new-name").focus();
			return false;
		}
			
		if ($("#new-pin").val().length <= 0 || $("#new-pin").val() < 1 || $("#new-pin").val() > 8){
			$("#new-pin").focus();
			return false;
		}
		
		var ListIOJson = localStorage.io;
		if (typeof ListIOJson === "undefined")
			ListIOJson = "[]";
		var ListIO = JSON.parse(ListIOJson);
		ListIO.push({name: $("#new-name").val(), status: false, port: $("#new-pin").val()});
		localStorage.io = JSON.stringify(ListIO);
		UpDateListAll();
		$(".DialogCancel").click();
		$(this)[0].reset();
    });
	
	$("#edit-form").submit(function(e) {
        e.preventDefault();
		var id = $("#edit-id").val();
		if ($("#edit-name").val().length <= 0){
			$("#edit-name").focus();
			return false;
		}
			
		if ($("#edit-pin").val().length <= 0 || $("#edit-pin").val() < 1 || $("#edit-pin").val() > 8){
			$("#edit-pin").focus();
			return false;
		}
		
		var ListIOJson = localStorage.io;
		if (typeof ListIOJson === "undefined")
			ListIOJson = "[]";
		var ListIO = JSON.parse(ListIOJson);
		ListIO[id] = {name: $("#edit-name").val(), status: false, port: $("#edit-pin").val()};
		localStorage.io = JSON.stringify(ListIO);
		UpDateListAll();
		$(".DialogCancel").click();
		$(this)[0].reset();
    });
	
	$(".ipedit-popup").click(function(e) {
		$("#ip-address").val(localStorage.ip);
		$("#edit-ip, #back-background").show();
		popup = true;
		popupname = "#edit-ip";
    });
	
	$(".popup #cancel").click(function(e) {
        $(popupname + ", #back-background").hide();
		popup = false;
		popupname = "";
    });
	
	$(".popup#edit-ip #ok").click(function(e) {
		$("#editip-form").submit();
    });
	
	$("#editip-form").submit(function(e) {
		e.preventDefault();
		var ip = $("#ip-address").val();
		if (ip.length <= 0 || !IPValid(ip)){
			$("#ip-address").focus();
			return false;
		}
		localStorage.ip = ip;
		$(".ipedit-popup").find("div.sub-text").text(ip);
		$(".popup #cancel").click();
    });
	
	$("select.sty-select").each(function(index, element) {
		html = '<div class="select-input" data-selector="#' + $(this).attr("id") + '">';
		html += '<span class="text">' + $(this).find("option:first-child, option:selected").text() + '</span>';
		html += '<span class="back-icon"><i class="md-unfold-more"></i></span>';
		html += '</div>';
		html += '<div class="select-toplist" data-selector="#' + $(this).attr("id") + '">';
		html += '<div class="bk-black"></div>';
		html += '<div class="list">';
		html += '<ul>';
		html += '</ul>';
		html += '</div>';
		html += '</div>';
		$(this).before(html);
		
		var this_id = $(this).attr("id");
		//alertBox(this_id);
		
		$(".select-input[data-selector='#" + this_id + "']").click(function(e) {
			//alertBox(this_id + ' click.');
            $(".select-toplist[data-selector='#" + this_id + "']").show();
			var selected_text = $("select#" + this_id + ".sty-select").find("option:selected").text();
			$(".select-toplist[data-selector='#" + this_id + "'] > .list > ul").html('');
			$("select#" + this_id).find("option").each(function(index, element) {
				//alertBox("select#" + this_id);
				//alertBox($(".select-toplist[data-selector='#" + this_id + "'] > .list > ul").html());
				html = '<li';
				html += ($(this).text() == selected_text ? ' class="active"' : '');
				html += '>';
				html += $(this).text();
				html += '</li>';
				//alertBox('Add - ' + html);
				$(".select-toplist[data-selector='#" + this_id + "'] > .list > ul").append(html);
				//alertBox(".select-toplist[data-selector='#" + this_id + "'] > .list > ul > li");
			});
			$(".select-toplist[data-selector='#" + this_id + "'] > .list > ul > li").click(function(e) {
				$(this).parent("ul").find("li.active").removeClass("active");
				$(this).addClass("active");
				var this_text = $(this).text();
				$("#" + this_id).find("option").each(function(index, element) {
					if ($(this).text() == this_text){
						$("#" + this_id).val($(this).val());
					}
				});
				$(".select-input[data-selector='#" + this_id + "'] > span.text").text(this_text);
						// alertBox(this_text);
				$(".select-toplist[data-selector='#" + this_id + "']").hide();
				// console.log(this_id);
				if ($(this).parents(".select-toplist").attr("data-selector") == '#card'){
					if ($("#card").val() == 'acash' || $("#card").val() == 'cookiecard' || $("#card").val() == 'winnercard')
						$("#phone-number-box").show();
					else
						$("#phone-number-box").hide();
					NewAmount();
				}
			});
			// $(this).find("span.text").text();
        });
	});
}

function UpDateListAll(){
	var ListIOJson = localStorage.io;
	if (typeof ListIOJson !== "undefined"){
		var ListIO = JSON.parse(ListIOJson);
		if (ListIO.length > 0){
			$("article[data-page='index'] > ul").html('');
			$("article[data-page='manage'] > ul#edit-list").html('');
			ListIO.forEach(function(IO, index, array){
				var name = IO.name;
				var status = IO.status;
				var port = IO.port;
				html = '';
				html += '<li data-id="' + index + '">';
				html += '<div class="name">' + name + '</div>';
				html += '<div class="right-icon">';
				html += '<i class="io-icon ' + (status ? 'i' : 'o') + '"></i>';
				html += '</div>';
				html += '</li>';
				$("article[data-page='index'] > ul").append(html);
				
				html = '';
				html += '<li data-id="' + index + '">';
				html += '<div class="name">' + name + '</div>';
				html += '<div class="right-icon manage-icon-box">';
				html += '<span class="edit">';
				html += '<i class="md md-mode-edit"></i>';
				html += '</span>';
				html += '<span class="remove">';
				html += '<i class="md md-close"></i>';
				html += '</span>';
				html += '</div>';
				html += '</li>';
				$("article[data-page='manage'] > ul#edit-list").append(html);
			});
		}
	}
	
	$("#edit-list > li span.edit").click(function(e) {
		var id = $(this).parents("li").attr("data-id");
		$("#edit-id").val(id);
		var ListIOJson = localStorage.io;
		var ListIO = JSON.parse(ListIOJson);
		if (typeof ListIO[id] !== "undefined"){
			$("#edit-name").val(ListIO[id].name);
			$("#edit-pin option").eq(ListIO[id].port-1).prop('selected', true);
			$(".select-input[data-selector='#edit-pin'] > .text").text("GPIO" + pinNumberToGPIOPin[ListIO[id].port-1]);
		}
        $("#edit-dialog").css({"transition": "300ms", "-webkit-transition": "300ms", "-webkit-transform": "translate(0, 0)"});
		Dialog = true;
		DialogName = "#edit-dialog";
    });
	
	$("#edit-list > li span.remove").click(function(e) {
		var id = $(this).parents("li").attr("data-id");
		$(this).parents("li").slideUp(400, "swing", function(){
			$(this).remove(); 
			$("ul.list-io > li[data-id='" + id + "']").each(function(index, element) {
				$(this).remove();
			});
			var ListIOJson = localStorage.io;
			var ListIO = JSON.parse(ListIOJson);
			if (typeof ListIO[id] !== "undefined")
				ListIO.splice(id, 1);
			localStorage.io = JSON.stringify(ListIO);
		});
	});
	
	$("[data-page='index'] ul.list-io > li").click(function(e) {
		var id = $(this).attr("data-id");
		var ListIOJson = localStorage.io;
		var ListIO = JSON.parse(ListIOJson);
		var ToST = ($(this).find("i.io-icon").attr("class").indexOf("io-icon i") >= 0 ? false : true);
		var url = "http://" + localStorage.ip + "/api/gpio" + pinNumberToGPIOPin[ListIO[id].port-1] + "/" + (ToST ? 1 : 0);
		var eIcon = $(this).find("i.io-icon");
		loadingStart();
		$.ajax({
			url: url,
			success: function(data, textStatus, jqXHR){
				loadingFinish(function(){
					if (data == "OK"){
						eIcon.attr("class", "io-icon " + (ToST ? "i" : "o"));
					}else{
						AlertBox("Error : " + textStatus);
					}
				});
			},
			timeout: 20000,
			error: function(jqXHR, textStatus, errorThrown){
				loadingFinish(function(){
					AlertBox("Error : " + errorThrown);
				});
			}
		});
    });
}

function IPValid(ip){
	var pattern = /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/;
	return pattern.test(ip);
}

function loadingStart(complet){
	$(".page-loading").show().find(".bar > div").removeClass().addClass("start").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		if (typeof complet === "function")
		  setTimeout(function(){ complet(); }, 1);
	});
}

function loadingFinish(complet){
	$(".page-loading").show().find(".bar > div").addClass("finish").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		$(this).parents(".page-loading").hide(0, function(){
			$(this).find(".bar > div").removeClass();
			if (typeof complet === "function")
			  setTimeout(function(){ complet(); }, 1);
		});
    });;
}

function AlertBox(msg, complet){
	var html = "";
	html += '<div class="popup alert" id="alert-box" style="display: block;">';
	html += '<article>';
	html += '<p>error ! : time out</p>';
	html += '</article>';
	html += '<footer>';
	html += '<button id="ok">OK</button>';
	html += '</footer>';
	html += '</div>';
	$("body").append(html);
	$("#alert-box, #back-background").show();
	popup = true;
	popupname = "#alert-box";
	$("#alert-box.popup #ok").click(function(e) {
		popup = false;
		popupname = "";
        $("#alert-box").remove();
		$("#back-background").hide();
		if (typeof complet === "function")
			setTimeout(function(){ complet(); }, 1);
    });
}