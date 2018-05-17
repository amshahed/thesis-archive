
function getQueryString(field, url){
	var href = url ? url : window.location.href;
	var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
	var string = reg.exec(href);
	return string ? string[1] : null;
};

$(document).ready(function(){
	var id = getQueryString('id');
	$.ajax({
		type: 'POST',
		url: '/getinfo',
		data: { id:id },
		success: function(json){
			if (json.hasOwnProperty('error')){
				if (json.error=='nomatch')
					$('#body').append('<div class="jumbotron">error: 404<br><a class="btn btn-success" href="/">Home</a><div>');
				else 
					toastr.error(json.error, '', {timeOut:1300});
			}
			else {
				$('.title').html(json.title);
				$('.supervisor').html(json.supervisor[1]);
				$('.authors').html(json.authors[1]+'<br>'+json.authors[3]+'<br>'+json.authors[5]);
				$('.keys').html(json.keywords[0]);
				for (var i=1; i<json.keywords.length; i++)
					$('.keys').append(json.keywords[i]);
				$('.location').html('Shelf '+json.location.shelf+', Row '+json.location.row);
				if (json.publishInfo.isPublished==true){
					$('.pub').html(json.publishInfo.publication);
					$('.pub_date').html(json.publishInfo.date);
				}
				$('.pdflink').attr('href','/getpdf/'+json._id);
			}
		}
	});
});