
$(document).ready(function(){
	var id = getQueryString('id');
	if (id==null)	window.open('/', '_self');
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
				$('.status').append('Cuurent')
				$('.year').append('N/A');
				$('.level').append(json.level);
			}
			else {
				$('.status').append('Former');
				$('.year').append(json.year);
				$('.level').append('N/A');
			}
			$('.name').html(json.name);
			$('.name2').append(json.name);
			$('.id').append(json._id);
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