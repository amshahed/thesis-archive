
$(document).ready(function(){
	var id = localStorage.getItem('id');
	if (id==null)	window.open('/', '_self');
	$('.submitbtn').hide();
	$('.cancelbtn').hide();
	$('form').hide();
	$('.cancelbtn2').hide();
	$.ajax({
		type: 'POST',
		data: { id },
		url: '/staffprofilepost',
		success: function(json){
			if (json.hasOwnProperty('error')){
				toastr.error(json.error, '', {timeOut: 1300});
				return;
			}
			console.log(json);
			document.picform.id.value = json._id;
			$('.name').html(json.name);
			$('.name2').val(json.name);
			$('.resp').val(json.responsibility);
			$('.phone').val(json.phone);
			$('.email').val(json.email);
			if (json.hasOwnProperty('picture'))
				$('.propic').attr('src', '/papers/'+json.picture);
		}
	})
})

$('.editbtn').click(function(){
	$('.editbtn').hide();
	$('.submitbtn').show();
	$('.cancelbtn').show();
	$('.name2').prop('disabled', false);
	$('.phone').prop('disabled', false);
	$('.email').prop('disabled', false);
	$('.resp').prop('disabled', false);
})

$('.submitbtn').click(function(){
	var id = localStorage.getItem('id');
	var regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	var name = $('.name2').val();
	var phone = $('.phone').val();
	var email = $('.email').val();
	var resp = $('.resp').val();
	if (name=='' || resp==''){
		toastr.error('Please enter all the info', '', {timeOut:1300});
		return;
	}
	if (email!='' && !email.match(regexp)){
		toastr.error('Please enter a valid email address', '', {timeOut:1300});
		return;
	}
	$.ajax({
		type: 'POST',
		data: { id, name, phone, email, resp },
		url: '/editstaffprofilepost',
		success: function(json){
			if (json.hasOwnProperty('error')){
				toastr.error(json.error, '', {timeOut:1300});
				return;
			}
			location.reload();
		}
	})
})

$('.cancelbtn').click(function(){
	location.reload();
})

$('.picbtn').click(function(){
	$('form').show();
	$('.cancelbtn2').show();
	$('.picbtn').hide();
})

$('.cancelbtn2').click(function(){
	$('form').hide();
	$('.cancelbtn2').hide();
	$('.picbtn').show();
})

