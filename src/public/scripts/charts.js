let created = false;
let myJoinsChart;
let myMessagesChart;

createCharts()

function destroy() {
    if (created) {
        myJoinsChart.destroy();
        myMessagesChart.destroy();
    }
}

// Joins
function createCharts() {
    // Destroy existing chart
    destroy();

    const theme = localStorage.getItem('currentTheme');
    // If theme is currently dark mode
    if (theme === 'dark') {
        bgColor = 'rgb(18, 17, 23)';
    } else {
        bgColor = 'rgb(247 247 247)';
    }

    const joinsChart = document.getElementById('joinsChart');
    myJoinsChart = new Chart(joinsChart, {
        type: 'bar',
        data: {
            labels: dateArr.split(',').reverse(),
            datasets: [{
                label: 'Server Joins',
                data: joinsArr.split(',').reverse(),
                backgroundColor: [
                    'rgb(154, 253, 164)',
                ],
                // barThickness: 15,
                borderColor: '',
                categoryPercentage: 0.4,
                barPercentage: 0.8
            }, {
                label: 'Server Leaves',
                data: leavesArr.split(',').reverse(),
                backgroundColor: [
                    'rgb(255, 141, 141)',
                ],
                // barThickness: 15,
                borderColor: '',
                categoryPercentage: 0.4,
                barPercentage: 0.8
            }]
        },
        plugins: [{
            id: 'custom',
            beforeDraw: (chart) => {
                const ctx = chart.canvas.getContext('2d');
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
            }
        }],
        options: {
            layout: {
                padding: {
                    top: 5,
                    left: 5
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        padding: 5,
                        usePointStyle: true,
                        boxWidth: 6
                    },
                    align: 'start'
                }
            }
        }
    });

    // Messages
    const messagesChart = document.getElementById('messagesChart');
    myMessagesChart = new Chart(messagesChart, {
        type: 'bar',
        data: {
            labels: dateArr.split(',').reverse(),
            datasets: [{
                label: 'Messages Sent',
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
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
            }
        }],
        options: {
            layout: {
                padding: {
                    top: 5,
                    left: 5
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        padding: 5,
                        usePointStyle: true,
                        boxWidth: 6
                    },
                    align: 'start'
                }
            }
        }
    });
    created = true;
}