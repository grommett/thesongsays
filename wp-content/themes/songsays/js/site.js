$(document).ready(function() 
{  
	$('input[type="text"]').focus(onInputFocus);
    $('input[type="text"]').blur(onInputBlur);
	$('textarea').focus(onInputFocus);
	$('textarea').blur(onInputBlur);
	if($('textarea')[0]) $('textarea')[0].defaultValue = $('textarea').val();

	$('#sub_form').submit(function() { return false; });
	$('#email_button').click(emailSubmit);
	$('#booking_submit_button').click(bookingSubmit);

	if($('#carousel a').children("img").length > 0) var s = new SlideShow($('#carousel a'));
});

function onInputFocus() 
{
	if (this.value == this.defaultValue) this.value = '';
}

function onInputBlur()
{
	if ($.trim(this.value) == '') this.value = this.defaultValue;
}


function submitComment()
{
	var element = $('textarea');
	currVal 	= element[0].value;
	defVal 		= element[0].defaultValue;
	if (currVal == defVal || currVal == '') 
	{
	$("#comment_error").slideDown("fast");
		return false;
	}else{
		$('#commentform').submit();
	}
}


function checkEmail(email)
{	
	var pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	var emailVal = $("#" + email).val();
	return pattern.test(emailVal);
}


function emailSubmit()
{
	
	// First, disable the form from submitting
	$('#sub_form').submit(function() { return false; });
	
	// Grab form action
	formAction = $("#sub_form").attr("action");
	
	// Hacking together id for email field
	// Replace the xxxxx below:
	// If your form action were http://mysiteaddress.createsend.com/t/r/s/abcde/, then you'd enter "abcde" below
	emailId = "ukiydd";
	emailId = emailId.replace("/", "");
	emailId = emailId + "-" + emailId;
	
	// Validate email address with regex
	if (!checkEmail(emailId)) 
	{
		$("#email_malformed").fadeIn("slow");
		return;
	}
	
	// Serialize form values to be submitted with POST
	var str = $("#sub_form").serialize();
	
	// Add form action to end of serialized data
	final = str + "&action=" + formAction;
	
	// Submit the form via ajax
	$.ajax({
		url: '/cm_proxy.php', // var set in view file
		type: "POST",
		data: final,
		success: function(html)
		{
			$("#sub_form").fadeOut("fast", function(){
				$("#email_confirmation").fadeIn("fast");
				});
			if($("#email_sub_error").is(":visible")) $("#email_sub_error").fadeOut("fast");
			if($("#email_malformed").is(":visible")) $("#email_malformed").fadeOut("fast");
		},
		error:function (xhr, ajaxOptions, thrownError)
		{
			$("#email_sub_error").fadeIn("fast");  // Error
		} 
	});
}



/*
Booking Form submit
*/

function bookingSubmit()
{
	var nameValue = $('#yourname').val();
	var messageValue = $('textarea').val();
	var send = true;
	
	// First, disable the form from submitting
	// $('#contact-form-7').submit(function () { return false; });
	
	// Grab form action
	formAction = $("#contact-form-7").attr("action");
	$('div.wpcf7-response-output').hide();
	getLabel("email").removeClass("error_bkg");
	getLabel("yourname").removeClass("error_bkg");
	getLabel("booking_message").removeClass("error_bkg");
	$("#booking_form_error").hide();
	
	// Validate name
	if ($.trim(nameValue) == '' || nameValue == $('#yourname')[0].defaultValue)
	{
		getLabel("yourname").addClass("error_bkg");
		send = false;
	}
	
	// Validate email address with regex
	if (!checkEmail('email')) 
	{
		getLabel("email").addClass("error_bkg");
		send = false;
	}
	
	
	// Validate message
	if ($.trim(messageValue) == '' || messageValue == $('textarea')[0].defaultValue)
	{
		getLabel("booking_message").addClass("error_bkg");
		send = false;
	}
	
	if(!send) $("#booking_form_error").fadeIn("fast");
	if(send) 
	{
		$('#contact-form-7').submit(function () {this.submit()});	
	}else{
		$('#contact-form-7').submit(function () { return false; });
	}
}




function getArtistNameHTML(name)
{
		return '<h1 class="column grid_8 font_large">'+name+'</h1>'+
			'<hr class="column grid_8 section_hr" />';
}

function getLabel(id)
{
	return $('label[for='+id+']');
}