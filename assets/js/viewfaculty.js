
$(document).ready(function(){
	var id = getQueryString('id');
	$.ajax({
		type: 'POST',
		data: { id },
		url: '/facultyprofilepost',
		success: function(json){
			if (json.hasOwnProperty('error')){
				toastr.error(json.error, '', {timeOut: 1300});
				return;
			}
			$('.name').html(json.name);
			$('.name2').append(json.name);
			$('.designation').append(json.designation);
			$('.university').append(json.university);
			$('.phone').append(json.phone);
			$('.email').append(json.email);
			if (json.hasOwnProperty('picture'))
				$('.propic').attr('src', '/papers/'+json.picture);
		}
	})
})

function getQueryString(field, url){
	var href = url ? url : window.location.href;
	var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
	var string = reg.exec(href);
	return string ? string[1] : null;
}