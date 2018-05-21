
var superarr=[], studentarr=[];

function getQueryString(field, url){
	var href = url ? url : window.location.href;
	var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
	var string = reg.exec(href);
	return string ? string[1] : null;
}

$(document).ready(function(){
	var id = getQueryString('id');
	var name = decodeURIComponent(getQueryString('name'));
	studentarr.push(Number(id)); studentarr.push(name);
})

function removeSuper(val){
	var i = superarr.indexOf(val);
	superarr.splice(i,1);
	$('#superholder li').eq(i).remove();
}
function addSupervisor(){
	val = $('#super').val();
	if (val=='')
		return;
	$('#super').val('');
	$.ajax({
		type: 'POST',
		url: '/supercheck',
		async: false,
		data: { name: val },
		success: function(json){
			console.log(json);
			if (json.hasOwnProperty('error')){
				if (json.error=='nomatch')
					toastr.error('No match found', '', {timeOut: 1300});
				else if (json.error=='toomanymatch')
					toastr.error('Please be more specific', '', {timeOut: 1300});
				else
					toastr.error(json.error, '', {timeOut: 1300});
			}
			else if (superarr.includes(json._id))
				toastr.info('Supervisor already added', '', {timeOut: 1300});
			else {
				superarr.push(json._id); superarr.push(json.name);
				$('#superholder').append('<li>'+json.name+'&nbsp;&nbsp;<i class="fa fa-times" onclick="removeSuper(\''+json._id+'\')"></i></li>');
			}
		}
	})
}

function removeStudent(val){
	var i = studentarr.indexOf(parseInt(val));
	studentarr.splice(i,1);
	$('#studentholder li').eq(i).remove();
}
function addStudent(){
	val = $('#student').val();
	if (val=='')
		return;
	$('#student').val('');
	$.ajax({
		type: 'POST',
		url: '/studentcheck',
		async: false,
		data: { id: val },
		success: function(json){
			if (json.hasOwnProperty('error')){
				if (json.error=='nomatch')
					toastr.error('No match found', '', {timeOut: 1300});
				else
					toastr.error(json.error, '', {timeOut: 1300});
			}
			else if (studentarr.includes(json._id))
				toastr.info('Student already added', '', {timeOut: 1300});
			else {
				studentarr.push(json._id); studentarr.push(json.name);
				$('#studentholder').append('<li>'+json.name+'&nbsp;&nbsp;<i class="fa fa-times" onclick="removeStudent(\''+json._id+'\')"></i></li>');
			}
		}
	});
}

function addCurrentThesis(){
	var title = $('#title').val();
	var category = $('#category').val();
	if (title=='' || category==''){
		toastr.error('Enter title and category', '', {timeOut: 1300});
		return;
	}
	if (superarr.length==0){
		toastr.error('Enter supervisor', '', {timeOut: 1300});
		return;
	}
	if (studentarr.length<2){
		toastr.error('Enter 2 students', '', {timeOut: 1300});
		return;
	}
	var supervisor = JSON.stringify(superarr);
	var students = JSON.stringify(studentarr);
	$.ajax({
		type: 'post',
		url: '/addcurthesispost',
		data : { title, category, supervisor, students },
		success: function(json){
			if (json.hasOwnProperty('error'))
				toastr.error(json.error, '', {timeOut: 1300});
			else {
				toastr.success('Current Thesis Added', '', {timeOut: 1300});
				window.open('/thesislist', '_self');
			}
		}
	})
}