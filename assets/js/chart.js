
function drawChart1(arr) {
	var data = new google.visualization.arrayToDataTable(arr, false);
	var options = {
		title: 'Thesis Category Statistics',
		backgroundColor: 'transparent',
		width: 600,
		height: 300,
		is3D: true
  	};
	var chart = new google.visualization.PieChart(document.getElementById('chartholder1'));
	chart.draw(data, options);
}

function drawChart2(arr) {
	var data = new google.visualization.arrayToDataTable(arr, false);
	var options = {
		title: 'Thesis Publication Statistics',
		backgroundColor: 'transparent',
		width: 600,
		height: 300,
		is3D: true
  	};
	var chart = new google.visualization.PieChart(document.getElementById('chartholder2'));
	chart.draw(data, options);
}

$(document).ready(function(){
	$.ajax({
		type: 'POST',
		url: '/chartinfo',
		success: function(json){
			console.log(json);
			if (json.hasOwnProperty('error')){
				toast.error(json.error, '', {timeOut:1300});
				return;
			}
			json.category.unshift([ 'Thesis Category', 'Number of Theses' ]);
			google.charts.load('current', {'packages':['corechart']});
			google.charts.setOnLoadCallback(function(){
				drawChart1(json.category);
			})
			json.publication.unshift([ 'State of Thesis', 'Number of Theses' ]);
			google.charts.load('current', {'packages':['corechart']});
			google.charts.setOnLoadCallback(function(){
				drawChart2(json.publication);
			})
		}
	})
})