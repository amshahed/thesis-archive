
$(document).ready(function(){
	$('.submitbtn').hide();
	$('.cancelbtn').hide();
	$.ajax({
		type: 'post',
		url: '/issuepost',
		success: function(json){
			if (json.hasOwnProperty('error')){
				toastr.error(json.error, '', {timeOut:1300});
				return;
			}
			for (var i=0; i<json.length; i++){
				var div = '<tr><td>'+json[i].title+'</td>';
				div += '<td>'+json[i].code+'</td>';
				div += '<td>'+json[i].student+'</td>';
				div += '<td>'+json[i].date+'</td>';
				div += '<td><div class="6u 12u$(small)">';
				if (json[i].returned==false){
					div += '<input type="checkbox" id="'+json[i]._id+'" onclick=\'returnThesis("'+json[i]._id+'")\'><label for="'+json[i]._id+'"></label></div></td>';
					div += '<td></td></tr>';
				}
				else {
					div += '<input type="checkbox" id="copy" checked disabled><label for="copy"></label></div></td>';
					div += '<td>'+json[i].retdate+'</td></tr>';
				}
				$('.issuewrapper').append(div);
			}
			div = '<tr class="issuefield"><td><input type="text" id="title"></td>';
			div += '<td><input type="text" id="code"></td>';
			div += '<td><input type="number" id="id"></td>';
			div += '<td></td><td></td><td></td></tr>';
			$('.issuewrapper').append(div);
			$('.issuefield').hide();
		}
	})
})

function returnThesis(id){
	$.ajax({
		type: 'post',
		data: { id },
		url: '/returnissuepost',
		success: function(json){
			if (json.hasOwnProperty('error')){
				toastr.error(json.error, '', {timeOut:1300});
				return;
			}
			$('#'+id).prop('disabled', true);
			$('#'+id).prop('checked', true);
		}
	})
}

$('.issuebtn').click(function(){
	$('.issuefield').show();
	$('.issuebtn').hide();
	$('.submitbtn').show();
	$('.cancelbtn').show();
})

$('.cancelbtn').click(function(){
	$('#title').val('');
	$('#code').val('');
	$('#date').val('');
	$('.issuefield').hide();
	$('.submitbtn').hide();
	$('.cancelbtn').hide();
	$('.issuebtn').show();
})

$('.submitbtn').click(function(){
	var title = $('#title').val();
	var code = $('#code').val();
	var student = $('#id').val();
	var date = $('#date').val();
	if (title=='' || code=='' || student=='' || date==''){
		toastr.error('Fill out all the info', '', {timeOut:1300});
		return;
	}
	$.ajax({
		type: 'post',
		data: { title, code, student, date },
		url: '/addissue',
		success: function(json){
			if (json.hasOwnProperty('error')){
				toastr.error(json.error, '', {timeOut:1300});
				return;
			}
			location.reload();
		}
	})
})