var chart = c3.generate({
	  size: {
        height: 350,
        width: 480
    },
    bindto: '#chart',
    data: {
      columns: [
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 50, 20, 10, 40, 15, 25]
      ],
	   types: {
            data1: 'area'
        },
	   axes: {
		    data2: 'y2'
	    }
    }, 
	grid: {
        x: {
            show: true
        },
        y: {
            show: true
        }
    },
	legend: {
        position: 'right'
    },
	axis: {
		y2: {
			show: true
		}
	},
	zoom: {
        enabled: true
    },
	 subchart: {
        show: true
    }
});

setTimeout(function () {
    chart.load({
        columns: [
            ['data1', 230, 190, 300, 500, 300, 400]
        ]
    });
}, 1000);

setTimeout(function () {
    chart.load({
        columns: [
            ['data3', 130, 150, 200, 300, 200, 100]
        ]
    });
}, 1500);

setTimeout(function () {
    chart.unload({
        ids: 'data1'
    });
}, 2000);

