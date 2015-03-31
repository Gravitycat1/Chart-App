var chart = c3.generate({
	  size: {
        height: 350,
        width: 480
    },
    bindto: '#chart',
    data: {
      columns: [
        ['data1', 30, 200, 100, 400, 150, 250]
      ],
	   types: {
            data1: 'area'
        },
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
        show: false
    },
	zoom: {
        enabled: true
    }
});

