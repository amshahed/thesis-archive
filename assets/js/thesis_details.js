
var theid = '';

function getQueryString(field, url){
	var href = url ? url : window.location.href;
	var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
	var string = reg.exec(href);
	return string ? string[1] : null;
}

$(document).ready(function(){
	var id = getQueryString('id');
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
				$('.title').html(json.title);
				$('.category').html(json.category);
				$('.abstract').html(json.abstract);
				$('.supervisor').html(json.supervisor[1]);
				theid = json.supervisor[0];
				$('.authors').append('<span style="cursor:pointer" onclick=\'location.href="/viewstudent?id='+json.authors[0]+'"\'>'+json.authors[1]+'</span><br>');
				$('.authors').append('<span style="cursor:pointer" onclick=\'location.href="/viewstudent?id='+json.authors[2]+'"\'>'+json.authors[3]+'</span><br>');
				$('.authors').append('<span style="cursor:pointer" onclick=\'location.href="/viewstudent?id='+json.authors[4]+'"\'>'+json.authors[5]+'</span>');
				$('.keys').html(json.keywords.join(', '));
				$('.location').html('Shelf '+json.location.shelf+', Row '+json.location.row);
				if (json.publishInfo.isPublished==true){
					$('.pub').html(json.publishInfo.publication);
					$('.pub_date').html(json.publishInfo.date);
				}
				else {
					$('.pub').html('N/A');
					$('.pub_date').html('N/A');
				}
				if (json.user)
					$('.pdflink').attr('href','/getpdf/'+json._id);
				else
					$('.pdflink').hide();
			}
		}
	});
});

function viewProfile(){
	window.location.replace('/viewfaculty?id='+theid);
}