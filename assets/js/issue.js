
$(document).ready(function(){
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
					div += '<input type="checkbox" id="copy" onclick=\'returnThesis('+json[i]._id+')\' name="copy"><label for="copy"></label></div></td>';
					div += '<td><input type="date" name="retdate" id="retdate"></td></tr>';
				}
				else {
					div += '<input type="checkbox" checked disabled id="copy" name="copy"><label for="copy"></label></div></td>';
					div += '<td><input type="date" name="retdate" value="'+json[i].return-date+'" disabled id="retdate"></td></tr>';
				}
				$('.issuewrapper').append(div);
			}
		}
	})
})

function returnThesis(id){
	console.log(id);
}

function newThesis(){
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
}