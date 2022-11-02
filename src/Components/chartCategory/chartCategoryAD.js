import React, { useEffect, useState } from 'react';
import './chartCategory.css';
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
const ChartCategoryAD = (props) => {
    const { dataCategoryWithGapAllTaskAD } = props;
    const { dataCategoryWithNameAllTaskAD } = props;
    const { dataCategoryWithGapOptionTaskAD } = props;
    const { dataCategoryWithNameOptionTaskAD } = props;
    const { taskNameFromMenu } = props;
    const { lengthCategory, lengthCategoryOption, queryOptionDone } = props;
    const { projectId } = props;
    var { select } = props;
    const backgroundColor = new Array();
    const borderColor = new Array();
    const { GetPositionAD } = props;
    const length = dataCategoryWithGapAllTaskAD.length;
    const { avgAD } = props;
    const [width, setWidth] = useState(window.innerWidth);
    if (avgAD) {
        if (select === 'ALL TASK') {
            var indexTotal = dataCategoryWithNameAllTaskAD.indexOf('GRAND TOTAL OF PROJECT (A-D)');
            dataCategoryWithGapAllTaskAD[indexTotal] = avgAD;
        }
        else {
            var indexTotal = dataCategoryWithNameOptionTaskAD.indexOf('GRAND TOTAL OF PROJECT (A-D)');
            dataCategoryWithGapOptionTaskAD[indexTotal] = avgAD;
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
        const element = document.getElementById('category-barAD');
        const rect = element.getBoundingClientRect();
        GetPositionAD(rect);
    }, [])
    useEffect(() => {
        const element = document.getElementById('category-barAD');
        const rect = element.getBoundingClientRect();
        GetPositionAD(rect);
        // console.log(rect.y);
    }, [lengthCategory]);
    useEffect(() => {
        const indexAll = dataCategoryWithNameAllTaskAD.indexOf('GRAND TOTAL OF PROJECT (A-D)');
        const indexOption = dataCategoryWithNameOptionTaskAD.indexOf('GRAND TOTAL OF PROJECT (A-D)');
        if (select === 'ALL TASK') {
            if (indexAll === -1) {
                dataCategoryWithNameAllTaskAD.push("GRAND TOTAL OF PROJECT (A-D)");
                dataCategoryWithGapAllTaskAD.push(avgAD);
            }
        } else {
            dataCategoryWithNameOptionTaskAD.push("GRAND TOTAL OF PROJECT (A-D)");
            dataCategoryWithGapOptionTaskAD.push(avgAD);
        }
    }, [select]);

    for (let index = 0; index < length; index++) {
        if (select === 'ALL TASK') {
            if (dataCategoryWithGapAllTaskAD[index] > 0) {
                if (dataCategoryWithGapAllTaskAD[index] > 100) {
                    borderColor[index] = 'red';
                    backgroundColor[index] = '#ff9090';
                } else {
                    borderColor[index] = '#ff9090';
                    backgroundColor[index] = '#ff9090';
                }
            } else {
                if (dataCategoryWithGapAllTaskAD[index] >= -100) {
                    borderColor[index] = '#a9ff86';
                    backgroundColor[index] = '#a9ff86';
                } else {
                    borderColor[index] = 'red';
                    backgroundColor[index] = '#a9ff86';
                }
            }
        }
        else {
            if (dataCategoryWithGapOptionTaskAD[index] > 0) {
                if (dataCategoryWithGapOptionTaskAD[index] > 100) {
                    borderColor[index] = 'red';
                    backgroundColor[index] = '#ff9090';

                } else {
                    borderColor[index] = '#ff9090';
                    backgroundColor[index] = '#ff9090';
                }
            } else {
                if (dataCategoryWithGapOptionTaskAD[index] >= -100) {
                    borderColor[index] = '#a9ff86';
                    backgroundColor[index] = '#a9ff86';
                } else {
                    borderColor[index] = 'red';
                    backgroundColor[index] = '#a9ff86';
                }
            }
        }
    }
    window.addEventListener('resize', () => {
        setWidth(window.innerWidth);
        window.removeEventListener('resize', null)
    })
    window.addEventListener('orientationchange', () => {
        setWidth(window.innerWidth)
        window.removeEventListener('orientationchange', null)
    })
    Number.prototype.toFixedDown = function (digits) {
        const re = new RegExp(`(\\d+\\.\\d{${digits}})(\\d)`);
        const m = this.toString().match(re);
        return m ? parseFloat(m[1]) : this.valueOf();
    };
    const nf = new Intl.NumberFormat('en-US')
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
                borderWidth: 3,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
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
                // text: projectId + ' - ' + taskNameFromMenu + ' - GAP PERCENTAGE (A-Q) CHART  ',

                text: select === 'ALL TASK' ?
                    projectId + ' - ' + taskNameFromMenu + ' - CATEGORY (' + (dataCategoryWithNameAllTaskAD.length - 1) + '/' + (lengthCategory) + ') - GAP PERCENTAGE (A-D) CHART'
                    :
                    projectId + ' - ' + taskNameFromMenu + ' - CATEGORY (' + (dataCategoryWithNameOptionTaskAD.length - 1) + '/' + (lengthCategory) + ') - GAP PERCENTAGE (A-D) CHART'
                ,
                color: select === 'ALL TASK' ?
                    (dataCategoryWithNameAllTaskAD.length !== lengthCategory + 1 || dataCategoryWithNameAllTaskAD.length === 0 || lengthCategory === 0) ? 'red' : 'black'
                    :
                    (dataCategoryWithNameOptionTaskAD.length !== lengthCategory + 1 || dataCategoryWithNameOptionTaskAD.length === 0 || lengthCategory === 0) ? 'red' : 'black'
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.x !== null) {
                            label += nf.format(parseFloat(context.parsed.x || 0).toFixedDown(2));
                        }
                        return label;
                    }
                }
            },
        }
    };
    const data = {
        labels: select === 'ALL TASK' ? dataCategoryWithNameAllTaskAD : dataCategoryWithNameOptionTaskAD,
        datasets: [
            {
                label: "PERCENTAGE",
                data: select === 'ALL TASK' ? dataCategoryWithGapAllTaskAD : dataCategoryWithGapOptionTaskAD,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                // barThickness: 20,
                // minBarLength: 40,
            }
        ],
    };
    useEffect(() => {
        if (width <= 800) {
            if (lengthCategoryOption === 0) {
                const element = document.getElementById('category-barAD');
                element.style.height = lengthCategory <= 3 ? ('120px') : (lengthCategory + 1) * 30 + 'px';
            } else {
                const element = document.getElementById('category-barAD');
                element.style.height = lengthCategoryOption <= 3 ? ('120px') : (lengthCategoryOption + 1) * 30 + 'px';
            }
        } else {
            if (lengthCategoryOption === 0) {
                const element = document.getElementById('category-barAD');
                element.style.height = lengthCategory <= 3 ? ('200px') : (lengthCategory + 1) * 50 + 'px';
            } else {
                const element = document.getElementById('category-barAD');
                element.style.height = lengthCategoryOption <= 3 ? ('200px') : (lengthCategoryOption + 1) * 50 + 'px';
            }
        }
       
    }, [select, width, lengthCategory, queryOptionDone]);


    return (
        < div className='bar-horizontal' >
            <Bar id="category-barAD" className='bar' options={options} data={data} />
        </div >
    );
}

export default ChartCategoryAD;