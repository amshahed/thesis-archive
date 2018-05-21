
function getQueryString(field, url){
	var href = url ? url : window.location.href;
	var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
	var string = reg.exec(href);
	return string ? string[1] : null;
}

$(document).ready(function(){
	var id = getQueryString('id');
	$('.submitbtn').hide();
	$('.cancelbtn').hide();
	$.ajax({
		type: 'POST',
		url: '/showthesispost',
		data: { id:id },
		success: function(json){
			if (json.hasOwnProperty('error')){
				if (json.error=='nomatch')
					$('#body').append('<div class="jumbotron">error: 404<br><a class="btn btn-success" href="/">Home</a><div>');
				else 
					toastr.error(json.error, '', {timeOut:1300});
			}
			else {
				$('.title').val(json.title);
				$('.category').val(json.category);
				$('.abstract').val(json.abstract);
				$('.supervisor').html(json.supervisor[1]);
				$('.authors').html(json.authors[1]+'<br>'+json.authors[3]+'<br>'+json.authors[5]);
				$('.keys').val(json.keywords.join(', '));
				if (json.publishInfo.isPublished==true){
					$('.pub').val(json.publishInfo.publication);
					$('.pub_date').val(json.publishInfo.date);
				}
				else {
					$('.pub').val('N/A');
					$('.pub_date').val('N/A');
				}
			}
		}
	});
})

$('.editbtn').click(function(){
	$('.editbtn').hide();
	$('.submitbtn').show();
	$('.cancelbtn').show();
	$('.category').prop('disabled', false);
	$('.title').prop('disabled', false);
	$('.abstract').prop('disabled', false);
	$('.keys').prop('disabled', false);
	$('.pub').prop('disabled', false);
	$('.pub_date').prop('disabled', false);
})

$('.cancelbtn').click(function(){
	location.reload();
})

$('.submitbtn').click(function(){
	var id = getQueryString('id');
	var category = $('.category').val();
	var title = $('.title').val();
	var abstract = $('.abstract').val();
	var pub = $('.pub').val();
	var date = $('.pub_date').val();
	var keys = $('.keys').val().split(', ');
	if (title=='' || category=='' || abstract.length<100 || keys.length<2){
		toastr.warning('Please fill out all relative info', '', {timeOut:1300});
		return;
	}
	if (pub!='' && date==''){
		toastr.warning('Please enter publication info properly', '', {timeOut:1300});
		return;
	}
	$.ajax({
		type: 'POST',
		data: { id, title, category, abstract, keywords: JSON.stringify(keys), publication: pub, date },
		url: '/editthesispost',
		success: function(json){
			if (json.hasOwnProperty('error')){
				toastr.error(json.error, '', {timeOut:1300});
				return;
			}
			location.reload();
		}
	})
})