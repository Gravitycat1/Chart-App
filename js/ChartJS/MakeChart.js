/*window.onload = function() {
	var obj = { 
		"data1": [1,2,3,4,5],
		"data2": [6,7,8,9,10]
	}
	console.log(priceData);
	var chart = c3.generate({
		  size: {
			height: 350,
			width: 480
		},
		bindto: '#chart',
		data: {
		  columns: [
			['Price'].concat(priceData)
		  ],
		   types: {
				Price: 'area'
			},
		}, 
		point: {
        show: false
		},
		grid: {
			x: {
				show: false
			},
			y: {
				show: true
			}
		},
		legend: {
			show: false
		},
		zoom: {
			enabled: true
		}
	});
}*/


//loads in the chart

function loadChart() {
 		var chart = c3.generate({
		  size: {
			height: 350,
			width: 480
		},
		bindto: '#chart',
		data: {
		  columns: [
			['Price'].concat(priceData)
		  ],
		   types: {
				Price: 'area'
			},
		}, 
		point: {
        show: false
		},
		grid: {
			x: {
				show: false
			},
			y: {
				show: true
			}
		},
		legend: {
			show: false
		},
		zoom: {
			enabled: true
		}
	});
}
