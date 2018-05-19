
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
		url: '/studentprofilepost',
		success: function(json){
			if (json.hasOwnProperty('error')){
				toastr.error(json.error, '', {timeOut: 1300});
				return;
			}
			if (json.current==true){
				$('.status').val('yes')
				$('.year').val('N/A');
				$('.level').val(json.level);
			}
			else {
				$('.status').val('no');
				$('.year').val(json.year);
				$('.level').val('N/A');
			}
			document.picform.id.value = json._id;
			$('.name').html(json.name);
			$('.name2').val(json.name);
			$('.id').val(json._id);
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
	$('.status').prop('disabled', false);
	$('.year').prop('disabled', false);
	$('.level').prop('disabled', false);
})

$('.submitbtn').click(function(){
	var id = localStorage.getItem('id');
	var regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	var name = $('.name2').val();
	var phone = $('.phone').val();
	var email = $('.email').val();
	var status = $('.status').val();
	var year = Number($('.year').val());
	var level = Number($('.level').val());
	if (name==''){
		toastr.error('Please enter name', '', {timeOut:1300});
		return;
	}
	if (status=='yes' && (level=='' || isNaN(level) || level<1 || level>4)){
		toastr.error('Please enter correct level', '', {timeOut:1300});
		return;
	}
	if (status=='no' && (year=='' || isNaN(year) || year<1900 || year>2020)){
		toastr.error('Please enter correct year', '', {timeOut:1300});
		return;
	}
	if (email!='' && !email.match(regexp)){
		toastr.error('Please enter a valid email address', '', {timeOut:1300});
		return;
	}
	$.ajax({
		type: 'POST',
		data: { id, name, phone, email, status, year, level },
		url: '/editstudentprofilepost',
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

