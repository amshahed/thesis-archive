
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
				div += '<input type="checkbox" id="copy" name="copy"><label for="copy"></label></div></td>';
				div += '<input type="date" name="retdate" id="retdate"></td></tr>';
				$('.issuewrapper').append(div);
			}
		}
	})
})