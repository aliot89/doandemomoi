let myChart = document.getElementById('myChart').getContext('2d');
// Global Options

Chart.defaults.global.defaultFontFamily = 'Lato';
Chart.defaults.global.defaultFontSize = 18;
Chart.defaults.global.defaultFontColor = '#777';

let massPopChart = new Chart(myChart, {
    type: 'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
        labels: [<%chart1.forEach(loca0 =>{%>
            '<%=loca0.hours%>', <%})%>
        ],
        datasets: [{
            label: 'Population',

            data: [<%chart1.forEach(loca0 =>{%>
                <%=loca0.Percentsals%>, <%})%>
            ],
            //backgroundColor:'green',
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 99, 132, 0.6)'
            ],
            fill: false,

            borderWidth: 1,
            borderColor: '#777',
            hoverBorderWidth: 3,
            hoverBorderColor: '#000',
            tension: 0

        }, {
            label: 'conchimnon',
            data: [
                0.5,
                1,
                1,
                3,
                4,
                5
            ],
            //backgroundColor:'green',
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 99, 132, 0.6)'
            ],
            fill: false,

            borderWidth: 1,
            borderColor: '#000',
            hoverBorderWidth: 3,
            hoverBorderColor: '#fff',
            tension: 0,
            pointBackgroundColor: '#000',
        }],

    },

    options: {
        title: {
            display: true,
            text: 'con chim non',
            fontSize: 20
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'probability'
                }
            }]
        },
        title: {
            display: true,
            text: 'con chim non heheheheheheh',
            fontSize: 20
        },
        legend: {
            display: true,
            position: 'right',
            labels: {
                fontColor: '#000'
            }
        },
        layout: {
            padding: {
                left: 50,
                right: 0,
                bottom: 0,
                top: 0
            }
        },
        tooltips: {
            enabled: true
        }
    }
});