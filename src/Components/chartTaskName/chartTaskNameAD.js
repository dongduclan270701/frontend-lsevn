import React, { useEffect, useState } from 'react';
import './chartTaskName.css';
import axios from 'axios';
import { Auth } from 'Action';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
ChartJS.register(
    ChartDataLabels,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
const ChartTaskNameAD = (props) => {
    const { dataTaskNameWithGapAD } = props;
    const { dataTaskNameWithNameAD } = props;
    const { lengthTaskName } = props;
    const { avgAD } = props;
    const { GetPositionAD } = props;
    const { projectId } = props;
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        try {
            const element = document.getElementById('taskname-barAD');
            const rect = element.getBoundingClientRect();
            GetPositionAD(rect);
        } catch (error) {
            // console.log("Error get element")
        }

        // console.log(rect.y);
    }, [lengthTaskName, GetPositionAD]);

    const backgroundColor = new Array();
    const borderColor = new Array();
    var length = dataTaskNameWithGapAD.length;
    if (avgAD) {
        var indexTotal = dataTaskNameWithNameAD.indexOf('GRAND TOTAL OF PROJECT (A-D)');
        if (avgAD === Infinity) {
            dataTaskNameWithGapAD[indexTotal] = 0;
        } else {
            dataTaskNameWithGapAD[indexTotal] = avgAD;
        }
        if (avgAD > 0) {
            if (avgAD > 100) {
                borderColor[indexTotal] = ('red');
                backgroundColor[indexTotal] = ('rgba(53, 162, 235, 0.5)');
            } else {
                borderColor[indexTotal] = ('rgba(53, 162, 235, 0.5)');
                backgroundColor[indexTotal] = ('rgba(53, 162, 235, 0.5)');
            }
        } else {
            if (avgAD) {
                borderColor[indexTotal] = ('rgba(255, 99, 132, 0.5)');
                backgroundColor[indexTotal] = ('rgba(255, 99, 132, 0.5)');
            } else {
                borderColor[indexTotal] = ('rgb(255, 0, 0)');
                backgroundColor[indexTotal] = ('rgba(255, 99, 132, 0.5)');
            }
        }
    }
    useEffect(() => {
        dataTaskNameWithNameAD.push("GRAND TOTAL OF PROJECT (A-D)");
        dataTaskNameWithGapAD.push(avgAD);
    }, []);

    for (let index = 0; index < length; index++) {
        if (dataTaskNameWithGapAD[index] > 0) {
            if (dataTaskNameWithGapAD[index] > 100) {
                borderColor[index] = 'red';
                backgroundColor[index] = '#ff9090';
            } else {
                borderColor[index] = '#ff9090';
                backgroundColor[index] = '#ff9090';
            }
        } else {
            if (dataTaskNameWithGapAD[index] >= -100) {
                borderColor[index] = '#a9ff86';
                backgroundColor[index] = '#a9ff86';
            } else {
                borderColor[index] = 'red';
                backgroundColor[index] = '#a9ff86';
            }
        }
    }
    window.addEventListener('resize', () => {
        setWidth(window.innerWidth)
        window.removeEventListener('resize', null)
    })
    window.addEventListener('orientationchange', () => {
        setWidth(window.innerWidth)
        window.removeEventListener('orientationchange', null)
    })

    const nf = new Intl.NumberFormat('en-US')
    Number.prototype.toFixedDown = function (digits) {
        const re = new RegExp(`(\\d+\\.\\d{${digits}})(\\d)`);
        const m = this.toString().match(re);
        return m ? parseFloat(m[1]) : this.valueOf();
    };
    const options = {
        indexAxis: 'y',
        scales: {
            y: {
                ticks: {
                    display: width < 769 ? true : true,
                    font: {
                        size: width < 476 ? 6 : width < 601 ? 6 : width < 769 ? 7 : width < 1081 ? 8 : width < 1441 ? 10 : 12
                    },
                    // display: true
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 15
                    },
                    stepSize: 20

                    // display: true
                },
                min: -105,
                max: 105,
            }
        },
        elements: {
            bar: {
                borderWidth: 1.5,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: { // This code is used to display data values
                // anchor: "start",
                clamp: 'true',
                // align: 'center',
                formatter: (data) => { return nf.format(Math.round(data)) },
                font: {
                    // weight: 'bold',
                    // size: 16
                    size: width < 476 ? 6 : width < 601 ? 6 : width < 769 ? 7 : width < 1081 ? 8 : width < 1441 ? 12 : 14
                }
            },
            legend: {
                // position: 'right',
                display: false
            },
            title: {
                display: true,
                text: projectId + ' - TASK (' + (dataTaskNameWithNameAD.length - 1) + '/' + (lengthTaskName) + ') - GAP PERCENTAGE (A-D) CHART',
                color: (dataTaskNameWithNameAD.length !== lengthTaskName + 1 || dataTaskNameWithNameAD.length === 0 || lengthTaskName === 0) ? 'red' : 'black'
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.x !== null) {
                            label += nf.format(parseFloat(context.parsed.x).toFixedDown(2));
                        }
                        return label;
                    }
                }
            },
        }
    };
    const data = {
        labels: dataTaskNameWithNameAD,
        datasets: [
            {
                label: "%",
                data: dataTaskNameWithGapAD,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                // barThickness: 20,
                // minBarLength: 40,
            }
        ],
    };
    useEffect(() => {
        if (width <= 800) {
            const element = document.getElementById('taskname-barAD');
            element.style.height = lengthTaskName <= 3 ? ('120px') : (lengthTaskName + 1) * 30 + 'px';
        } else {
            const element = document.getElementById('taskname-barAD');
            element.style.height = lengthTaskName <= 3 ? ('200px') : (lengthTaskName + 1) * 50 + 'px';
        }
    }, [width, lengthTaskName]);
    return (
        // <div className='container-xl'>
        < div className='bar-horizontal' >
            <Bar id="taskname-barAD" className='bar' options={options} data={data} />
        </div >
        // </div>
    );
}

export default ChartTaskNameAD;