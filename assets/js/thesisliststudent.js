$(document).ready(function(){
	var name = localStorage.getItem('name');
	$.ajax({
		type: 'POST',
		url: '/studentthesislistpost',
		success: function(json){
			if (json.hasOwnProperty('error')){
				toastr.error(json.error, '', {timeOut: 1300});
				return;
			}
			for (var i=0; i<json.doc.length; i++){
				var div = '<div><div class="box">';
				div += '<div class="content">';
				div += '<header class="align-center"><font>Category:</font><p>'+json.doc[i].category+'</p>';
				div += '<h2>'+json.doc[i].title+'</h2></header>';
				div += '<h4 style="margin-bottom:2px" class="pull-right"><strong>Supervisor</strong></h4>';
				div += '<h4 style="margin-bottom:2px"><strong>Authors</strong></h4>';
				div += '<h5 class="pull-right">'+json.doc[i].supervisor[1]+'</h5>';
				div += '<h5>'+json.doc[i].authors[1]+'<br>'+json.doc[i].authors[3]+'<br>'+json.doc[i].authors[5]+'</h5>';
				div += '<footer class="align-center"><a href="/showthesis?id='+json.doc[i]._id+'" class="button alt">Learn More</a></footer>';
				div += '</div></div></div>';
				$('.thesiswrapper').append(div);
			}
			if (json.user.current==false || (json.user.current==true && json.user.level!=4)){
				$('.editcurthesis').hide();
				$('.addcurthesis').hide();
			}
			else if (json.user.current==true && json.user.level==4 && json.user.curthesis==''){
				$('.editcurthesis').hide();
				$('.addcurthesis').attr('href', '/addcurthesis?id='+json.user._id+'&name='+json.user.name);
			}
			else if (json.user.current==true && json.user.curthesis!=''){
				$('.addcurthesis').hide();
			}
		}
	})
})

function search(){
	var val = $('#searchval').val();
	if (val=='')	return;
	$('#searchval').val('');
	window.open('/search?val='+val, '_self');
}