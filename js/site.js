function onInputFocus(){this.value==this.defaultValue&&(this.value="")}function onInputBlur(){""==$.trim(this.value)&&(this.value=this.defaultValue)}function submitComment(){var e=$("textarea");return currVal=e[0].value,defVal=e[0].defaultValue,currVal==defVal||""==currVal?($("#comment_error").slideDown("fast"),!1):void $("#commentform").submit()}function checkEmail(e){var a=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,t=$("#"+e).val();return a.test(t)}function emailSubmit(){if($("#sub_form").submit(function(){return!1}),formAction=$("#sub_form").attr("action"),emailId="ukiydd",emailId=emailId.replace("/",""),emailId=emailId+"-"+emailId,!checkEmail(emailId))return void $("#email_malformed").fadeIn("slow");var e=$("#sub_form").serialize();final=e+"&action="+formAction,$.ajax({url:"/cm_proxy.php",type:"POST",data:final,success:function(){$("#sub_form").fadeOut("fast",function(){$("#email_confirmation").fadeIn("fast")}),$("#email_sub_error").is(":visible")&&$("#email_sub_error").fadeOut("fast"),$("#email_malformed").is(":visible")&&$("#email_malformed").fadeOut("fast")},error:function(){$("#email_sub_error").fadeIn("fast")}})}function bookingSubmit(){var e=$("#yourname").val(),a=$("textarea").val(),t=!0;formAction=$("#contact-form-7").attr("action"),$("div.wpcf7-response-output").hide(),getLabel("email").removeClass("error_bkg"),getLabel("yourname").removeClass("error_bkg"),getLabel("booking_message").removeClass("error_bkg"),$("#booking_form_error").hide(),(""==$.trim(e)||e==$("#yourname")[0].defaultValue)&&(getLabel("yourname").addClass("error_bkg"),t=!1),checkEmail("email")||(getLabel("email").addClass("error_bkg"),t=!1),(""==$.trim(a)||a==$("textarea")[0].defaultValue)&&(getLabel("booking_message").addClass("error_bkg"),t=!1),t||$("#booking_form_error").fadeIn("fast"),$("#contact-form-7").submit(t?function(){this.submit()}:function(){return!1})}function getArtistNameHTML(e){return'<h1 class="column grid_8 font_large">'+e+'</h1><hr class="column grid_8 section_hr" />'}function getLabel(e){return $("label[for="+e+"]")}$(document).ready(function(){if($('input[type="text"]').focus(onInputFocus),$('input[type="text"]').blur(onInputBlur),$("textarea").focus(onInputFocus),$("textarea").blur(onInputBlur),$("textarea")[0]&&($("textarea")[0].defaultValue=$("textarea").val()),$("#sub_form").submit(function(){return!1}),$("#email_button").click(emailSubmit),$("#booking_submit_button").click(bookingSubmit),$("#carousel a").children("img").length>0){new SlideShow($("#carousel a"))}});