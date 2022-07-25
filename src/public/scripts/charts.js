let created = false;
let myJoinsChart;
let myMessagesChart;

createCharts()

function destroy() {
    if (created) {
        myJoinsChart.destroy();
        myMessagesChart.destroy();
        myBansChart.destroy();
    }
}

// Joins
function createCharts() {
    // Destroy existing chart
    destroy();

    const theme = localStorage.getItem('currentTheme');
    // If theme is currently dark mode
    if (theme === 'dark') {
        bgColor = 'rgb(33, 37, 41)';
        bgLine = 'rgb(255 255 255 / 5%)';
    } else {
        bgColor = 'rgb(247 247 247)';
        bgLine = 'rgb(0 0 0 / 10%)'
    }

    const joinsChart = document.getElementById('joinsChart');
    myJoinsChart = new Chart(joinsChart, {
        type: 'bar',
        data: {
            labels: dateArr.split(',').slice(0, 7).reverse(),
            datasets: [{
                label: 'Server Joins',
                data: joinsArr.split(',').slice(0, 7).reverse(),
                backgroundColor: [
                    'rgb(154, 253, 164)',
                ],
                barThickness: 20,
                // borderColor: '',
                // categoryPercentage: 0.4,
                // barPercentage: 0.8
            }, {
                label: 'Server Leaves',
                data: leavesArr.split(',').slice(0, 7).reverse(),
                backgroundColor: [
                    'rgb(255, 141, 141)',
                ],
                barThickness: 20,
                // borderColor: '',
                // categoryPercentage: 0.4,
                // barPercentage: 0.8
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
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    stacked: true,
                    grid: {
                        display: true,
                        drawBorder: false
                    }
                }
            },
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
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    });

    // Messages
    const messagesChart = document.getElementById('messagesChart');
    myMessagesChart = new Chart(messagesChart, {
        type: 'bar',
        data: {
            labels: dateArr.split(',').slice(0, 7).reverse(),
            datasets: [{
                label: 'Messages Sent',
                data: messagesArr.split(',').slice(0, 7).reverse(),
                backgroundColor: [
                    'rgb(153, 197, 255)',
                ],
                barThickness: 20,
                // borderColor: ''
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
            responsive: true,
            scales: {
                x: {
                    stacked: false,
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    stacked: false,
                    grid: {
                        display: true,
                        drawBorder: false
                    }
                }
            },
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
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    });

    // Moderting
    let daysTotal = [];
    for (let i = 0; i < 14; i++) {
        daysTotal.push(parseInt(bansArr.split(',').slice(0, 14).reverse()[i]) + parseInt(timeoutsArr.split(',').slice(0, 14).reverse()[i]) + parseInt(warningsArr.split(',').slice(0, 14).reverse()[i]))
    }

    const bansChart = document.getElementById('bansChart');
    myBansChart = new Chart(bansChart, {
        data: {
            labels: dateArr.split(',').slice(0, 7).reverse(),
            datasets: [{
                type: 'line',
                label: 'Members Banned',
                data: bansArr.split(',').slice(0, 7).reverse(),
                borderColor: [
                    'rgb(255 154 154)',
                ],
                borderWidth: 3
            }, {
                type: 'line',
                label: 'Members Timed Out',
                data: timeoutsArr.split(',').slice(0, 7).reverse(),
                borderColor: [
                    'rgb(183 139 255)',
                ],
                borderWidth: 3
            }, {
                type: 'line',
                label: 'Members Warned',
                data: warningsArr.split(',').slice(0, 7).reverse(),
                borderColor: [
                    'rgb(132 199 255)',
                ],
                borderWidth: 3
            }, {
                type: 'bar',
                label: 'Total Actions',
                data: daysTotal,
                backgroundColor: [
                    bgLine,
                ],
                barThickness: 20,
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
            scales: {
                x: {
                    stacked: false,
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    stacked: false,
                    grid: {
                        display: true,
                        drawBorder: false
                    }
                }
            },
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
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
        }
    });

    created = true;
}