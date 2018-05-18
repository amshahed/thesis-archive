
var keyarr=[], superarr=[], studentarr=[];

function removeKey(val){
	var i = keyarr.indexOf(val);
	keyarr.splice(i,1);
	$('#keyholder li').eq(i).remove();
}
function addKeyword(){
	val = $('#keyword').val();
	if (val=='')
		return;
	$('#keyword').val('');
	if (keyarr.includes(val))
		toastr.info('keyword already added', '', {timeOut:1300});
	else {
		keyarr.push(val);
		$('#keyholder').append('<li>'+val+'&nbsp;&nbsp;<i class="fa fa-times" onclick="removeKey(\''+val+'\')"></i></li>');
	}
}

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
	});
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

function processForm(){
	var title = $('#title').val();
	if (keyarr.length<2){
		toastr.error('Enter at least 2 keywords', '', {timeOut: 1300});
		return;
	}
	if (superarr.length==0){
		toastr.error('Enter supervisor', '', {timeOut: 1300});
		return;
	}
	if (studentarr.length<3){
		toastr.error('Enter at least 3 students', '', {timeOut: 1300});
		return;
	}
	$.ajax({
		type: 'POST',
		url: '/theinfo',
		data: { title:title, keys:JSON.stringify(keyarr), sv:JSON.stringify(superarr), students:JSON.stringify(studentarr) },
		success: function(json){
			if (json.hasOwnProperty('error'))
				toastr.error(json.error, '', {timeOut: 1300});
			else {
				toastr.success('Thesis inserted', '', {timeOut: 1300});
				location.reload();
			}
		}
	});
}

function hidePublishInfo(){
	$('#publication').val('');
	$('#date').val('');
	$('.publishinfo').hide();
}

function showPublishInfo(){
	$('.publishinfo').show();
}

$(document).ready(function(){
	$('.publishinfo').hide();
})

$('.thesisadd').submit(function(e){
	e.preventDefault();
	if (keyarr.length<2){
		toastr.error('Enter at least 2 keywords', '', {timeOut: 1300});
		return;
	}
	if (superarr.length==0){
		toastr.error('Enter supervisor', '', {timeOut: 1300});
		return;
	}
	if (studentarr.length<3){
		toastr.error('Enter at least 3 students', '', {timeOut: 1300});
		return;
	}
	var title = $('#title').val();
	var category = $('#category').val();
	var keywords = JSON.stringify(keyarr);
	var supervisor = JSON.stringify(superarr);
	var students = JSON.stringify(studentarr);
	var batch = $('#batch').val();
	var year = $('#year').val();
	var isPublished = $('input[name=publish]:checked').val();
	var publication = $('#publication').val();
	var date = $('#date').val();
	var code = $('#code').val();
	var shelf = $('#shelf').val();
	var row = $('#row').val();
	$(this).ajaxSubmit({
		data : { title, category, keywords, supervisor, students, batch, year, isPublished, publication, publication, date, code, shelf, row },
		success: function(json){
			if (json.hasOwnProperty('error'))
				toastr.error(json.error, '', {timeOut: 1300});
			else {
				toastr.success('Thesis Added', '', {timeOut: 1300});
				location.reload();
			}
		}
	})
})