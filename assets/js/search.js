
function getQueryString(field, url){
	var href = url ? url : window.location.href;
	var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
	var string = reg.exec(href);
	return string ? string[1] : null;
}

$(document).ready(function(){
	var val = decodeURIComponent(getQueryString('val'));
	$.ajax({
		type: 'post',
		async: false,
		data: { val },
		url: '/searchpost',
		success: function(json){
			if (json.hasOwnProperty('error')){
				toastr.error(json.error, '', {timeOut:1300});
				return;
			}
			$('.val').html('"'+val+'"');
			for (var i=0; i<json.length; i++){
				var div = '<div><div class="box" ';
				if (i%2)
					div += 'id="right_box"><div class="content">';
				else
					div += 'id="left_box"><div class="content">';
				div += '<header class="align-center">';
				div += '<font color="111">Category: </font><p>'+json[i].category+'</p>';
				div += '<h2>'+json[i].title+'</h2></header>';
				div += '<h4 style="margin-bottom:2px" class="pull-right"><strong>Supervisor</strong></h4>';
				div += '<h4 style="margin-bottom:2px"><strong>Authors</strong></h4>';
				div += '<h4 class="pull-right">'+json[i].supervisor[1]+'</h5>';
				div += '<h5>'+json[i].authors[1]+'<br>'+json[i].authors[3]+'<br>'+json[i].authors[5]+'</h5>';
				div += '<footer class="align-center">';
				div += '<a href="/showthesis?id='+json[i]._id+'" class="button alt">Learn More</a></footer>';
				div += '</div></div></div>';
				$('.thesiswrapper').append(div);
			}
		}
	})

	$.ajax({
		type: 'post',
		async: false,
		url: '/searchfieldpost',
		success: function(json){
			if (json.hasOwnProperty('error')){
				toastr.error(json.error, '', {timeOut:1300});
				return;
			}
			for (var i=0; i<json.faculties.length; i+=2){
				$('.supervisor').append('<option value="'+json.faculties[i]+'">'+json.faculties[i+1]+'</option>');
			}
			for (var i=0; i<json.batches.length; i++){
				$('.batch').append('<option value="'+json.batches[i]+'">CSE '+json.batches[i]+'</option>');
			}
			for (var i=0; i<json.categories.length; i++){
				$('.category').append('<option value="'+json.categories[i]+'">'+json.categories[i]+'</option>');
			}
		}
	})
})

function advancedSearch(){
	var title = $('.title').val();
	var id = $('.id').val();
	var name = $('.name').val();
	var keyword = $('.keyword').val();
	var supervisor = $('.supervisor').val();
	var category = $('.category').val();
	var batch = $('.batch').val();
	if (title=='' && id=='' && name=='' && keyword=='' && supervisor=='' && category=='' && batch==''){
		toastr.error('Apply at least one filter', '', {timeOut:1300});
		return;
	}
	console.log(title+' '+id+' '+name+' '+keyword+' '+supervisor+' '+category+' '+batch);
	$.ajax({
		type:'post',
		data: { title, id, name, keyword, supervisor, category, batch },
		url: '/advancedsearchpost',
		success: function(json){
			if (json.hasOwnProperty('error')){
				toastr.error(json.error, '', {timeOut:1300});
				return;
			}
			$('.title').val('');
			$('.id').val('');
			$('.name').val('');
			$('.keyword').val('');
			$('.supervisor').val('');
			$('.category').val('');
			$('.batch').val('');
			$('.thesiswrapper').html('');
			$('.thesis_title').html('');
			for (var i=0; i<json.length; i++){
				var div = '<div><div class="box" ';
				if (i%2)
					div += 'id="right_box"><div class="content">';
				else
					div += 'id="left_box"><div class="content">';
				div += '<header class="align-center">';
				div += '<font color="111">Category: </font><p>'+json[i].category+'</p>';
				div += '<h2>'+json[i].title+'</h2></header>';
				div += '<h4 style="margin-bottom:2px" class="pull-right"><strong>Supervisor</strong></h4>';
				div += '<h4 style="margin-bottom:2px"><strong>Authors</strong></h4>';
				div += '<h4 class="pull-right">'+json[i].supervisor[1]+'</h5>';
				div += '<h5>'+json[i].authors[1]+'<br>'+json[i].authors[3]+'<br>'+json[i].authors[5]+'</h5>';
				div += '<footer class="align-center">';
				div += '<a href="/showthesis?id='+json[i]._id+'" class="button alt">Learn More</a></footer>';
				div += '</div></div></div>';
				$('.thesiswrapper').append(div);
			}
		}
	})
}