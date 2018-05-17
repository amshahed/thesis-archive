
var keyarr=[], superarr=[], studentarr=[];

//functions for adding keywords
function adinkey(el){			//pass value to add keyword when Enter is pressed
	if (event.key=='Enter'){
		var val = el.value;
		addKeyword(val);
	}
}
function removeKey(val){
	var i = keyarr.indexOf(val);
	keyarr.splice(i,1);
	$('#keyholder li').eq(i).remove();
}
function addKeyword(val){
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


//functions for adding supervisors
function adinsup(el){
	if (event.key=='Enter'){
		var val = el.value;
		addSuper(val);
	}
}
function removeSuper(val){
	var i = superarr.indexOf(val);
	superarr.splice(i,1);
	$('#superholder li').eq(i).remove();
}
function addSuper(val){
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

//functions for adding and removing students
function adinstu(el){
	if (event.key=='Enter'){
		var val = el.value;
		addStudent(val);
	}
}
function removeStudent(val){
	var i = studentarr.indexOf(parseInt(val));
	studentarr.splice(i,1);
	$('#studentholder li').eq(i).remove();
}
function addStudent(val){
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
				studentarr.push(json._id);
				$('#studentholder').append('<li>'+json.name+'&nbsp;&nbsp;<i class="fa fa-times" onclick="removeStudent(\''+json._id+'\')"></i></li>');
			}
		}
	});
}
function addThesis(){
	var title = $('#title').val();
	if (title.length==0){
		toastr.error('Enter the title of the thesis', '', {timeOut: 1300});
		return;
	}
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
	var obj
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

$('#uploadform').submit()