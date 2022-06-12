// Joins
const joinsChart = document.getElementById('joinsChart');
const myJoinsChart = new Chart(joinsChart, {
    type: 'bar',
    data: {
        labels: dateArr.split(',').reverse(),
        datasets: [{
            label: 'Server Bans',
            data: joinsArr.split(',').reverse(),
            backgroundColor: [
                'rgb(154, 253, 164)',
            ],
            barThickness: 15,
            borderColor: ''
        }]
    },
    plugins: [{
        id: 'custom',
        beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'rgb(23, 24, 30)';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    }],
    options: {
        layout: {
            padding: {
                top: 30,
                left: 5
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// Messages
const messagesChart = document.getElementById('messagesChart');
const myMessagesChart = new Chart(messagesChart, {
    type: 'bar',
    data: {
        labels: dateArr.split(',').reverse(),
        datasets: [{
            label: 'Messages',
            data: messagesArr.split(',').reverse(),
            backgroundColor: [
                'rgb(153, 197, 255)',
            ],
            barThickness: 15,
            borderColor: ''
        }]
    },
    plugins: [{
        id: 'custom',
        beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'rgb(23, 24, 30)';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    }],
    options: {
        layout: {
            padding: {
                top: 30,
                left: 5
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});