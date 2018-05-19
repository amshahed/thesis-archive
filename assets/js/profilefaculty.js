
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
		url: '/facultyprofilepost',
		success: function(json){
			if (json.hasOwnProperty('error')){
				toastr.error(json.error, '', {timeOut: 1300});
				return;
			}
			console.log(json);
			document.picform.id.value = json._id;
			$('.name').html(json.name);
			$('.name2').val(json.name);
			$('.designation').val(json.designation);
			$('.university').val(json.university);
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
	$('.designation').prop('disabled', false);
	$('.university').prop('disabled', false);
})

$('.submitbtn').click(function(){
	var id = localStorage.getItem('id');
	var regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	var name = $('.name2').val();
	var phone = $('.phone').val();
	var email = $('.email').val();
	var designation = $('.designation').val();
	var university = $('.university').val();
	if (name=='' || designation=='' || university==''){
		toastr.error('Please enter all the info', '', {timeOut:1300});
		return;
	}
	if (email!='' && !email.match(regexp)){
		toastr.error('Please enter a valid email address', '', {timeOut:1300});
		return;
	}
	$.ajax({
		type: 'POST',
		data: { id, name, phone, email, designation, university },
		url: '/editfacultyprofilepost',
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
	$('.editbtn').show();
	$('.submitbtn').hide();
	$('.cancelbtn').hide();
	$('.name2').prop('disabled', true);
	$('.phone').prop('disabled', true);
	$('.email').prop('disabled', true);
	$('.designation').prop('disabled', true);
	$('.university').prop('disabled', true);
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

