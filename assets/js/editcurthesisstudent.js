var id = '';

$(document).ready(function(){
	$.ajax({
		type: 'post',
		url: '/editcurthesisstudentpost',
		success: function(json){
			if (json.hasOwnProperty('error') && json.error=='nomatch'){
				toastr.error('You have no current thesis', '', {timeOut:1300});
				return;
			}
			else if (json.hasOwnProperty('error')){
				toastr.error(json.error, '', {timeOut:1300});
				return;
			}
			id = json._id;
			$('.category').html(json.category);
			$('.title').html(json.title);
			$('.supervisor').html(json.supervisor[1]);
			$('.authors').html(json.authors[1]+'<br>'+json.authors[3]+'<br>'+json.authors[5]);
			for (var i=0; i<json.updates.length; i++){
				var div = '<label><strong>Updated on '+json.updates[i].date+' by '+json.updates[i].author+'</strong></label>';
				div += '<blockquote><h4>'+json.updates[i].edit+'</h4></blockquote>';
				div += '<div style="margin-left:50px"><font color="black"><strong>Feedback from Supervisor</strong></font>';
				div += '<h4 style="margin-left:20px">'+json.updates[i].feedback+'</h4></div>';
				$('.editwrap').append(div);
			}
		}
	})
})

function edit(){
	var edit = $('#message').val();
	var name = localStorage.getItem('name');
	if (edit==''){
		toastr.warning('Enter your update', '', {timeOut:1300});
		return;
	}
	$.ajax({
		type:'POST',
		data: { id, name, edit },
		url: '/updatecurthesisstudent',
		success: function(json){
			if (json.hasOwnProperty('error')){
				toastr.error(json.error, '', {timeOut:1300});
				return;
			}
			location.reload();
		}
	})
}