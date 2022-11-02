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
const ChartCategory = (props) => {
    const { dataCategoryWithGapAllTask } = props;
    const { dataCategoryWithNameAllTask } = props;
    const { dataCategoryWithGapOptionTask } = props;
    const { dataCategoryWithNameOptionTask } = props;
    const { taskNameFromMenu } = props;
    const { lengthCategory, lengthCategoryOption, queryOptionDone } = props;
    const { projectId } = props;
    const { select } = props;
    const backgroundColor = new Array();
    const borderColor = new Array();
    const { GetPosition } = props;
    const length = dataCategoryWithGapAllTask.length;
    const { avg } = props;
    const [width, setWidth] = useState(window.innerWidth);
    if (avg) {
        if (select === 'ALL TASK') {
            var indexTotal = dataCategoryWithNameAllTask.indexOf('GRAND TOTAL OF PROJECT (A-Q)');
            dataCategoryWithGapAllTask[indexTotal] = avg;
        }
        else {
            var indexTotal = dataCategoryWithNameOptionTask.indexOf('GRAND TOTAL OF PROJECT (A-Q)');
            dataCategoryWithGapOptionTask[indexTotal] = avg;

        }
        if (avg > 0) {
            if (avg > 100) {
                borderColor[indexTotal] = ('red');
                backgroundColor[indexTotal] = ('rgba(53, 162, 235, 0.5)');
            } else {
                borderColor[indexTotal] = ('rgba(53, 162, 235, 0.5)');
                backgroundColor[indexTotal] = ('rgba(53, 162, 235, 0.5)');
            }
        } else {
            if (avg) {
                borderColor[indexTotal] = ('rgba(255, 99, 132, 0.5)');
                backgroundColor[indexTotal] = ('rgba(255, 99, 132, 0.5)');
            } else {
                borderColor[indexTotal] = ('rgb(255, 0, 0)');
                backgroundColor[indexTotal] = ('rgba(255, 99, 132, 0.5)');
            }
        }
    }
    useEffect(() => {
        try {
            const element = document.getElementById('category-bar');
            const rect = element.getBoundingClientRect();
            GetPosition(rect);
        } catch (error) {

        }

    }, [])
    useEffect(() => {
        try {
            const element = document.getElementById('category-bar');
            const rect = element.getBoundingClientRect();
            GetPosition(rect);
        } catch (error) {
        }
        // console.log(rect.y);
    }, [lengthCategory]);
    window.addEventListener('resize', () => {
        setWidth(window.innerWidth)
        window.removeEventListener('resize', null)
    })
    window.addEventListener('orientationchange', () => {
        setWidth(window.innerWidth)
        window.removeEventListener('orientationchange', null)
    })
    useEffect(() => {
        const indexAll = dataCategoryWithNameAllTask.indexOf('GRAND TOTAL OF PROJECT (A-Q)');
        const indexOption = dataCategoryWithNameOptionTask.indexOf('GRAND TOTAL OF PROJECT (A-Q)');
        if (select === 'ALL TASK') {
            if (indexAll === -1) {
                dataCategoryWithNameAllTask.push("GRAND TOTAL OF PROJECT (A-Q)");
                dataCategoryWithGapAllTask.push(avg);
            } else { }
        } else {
            dataCategoryWithNameOptionTask.push("GRAND TOTAL OF PROJECT (A-Q)");
            dataCategoryWithGapOptionTask.push(avg);
        }
    }, [select]);

    for (let index = 0; index < length; index++) {
        if (select === 'ALL TASK') {
            if (dataCategoryWithGapAllTask[index] > 0) {
                if (dataCategoryWithGapAllTask[index] > 100) {
                    borderColor[index] = 'red';
                    backgroundColor[index] = '#ff9090';
                } else {
                    borderColor[index] = '#ff9090';
                    backgroundColor[index] = '#ff9090';
                }
            } else {
                if (dataCategoryWithGapAllTask[index] >= -100) {
                    borderColor[index] = '#a9ff86';
                    backgroundColor[index] = '#a9ff86';
                } else {
                    borderColor[index] = 'red';
                    backgroundColor[index] = '#a9ff86';
                }
            }
        }
        else {
            if (dataCategoryWithGapOptionTask[index] > 0) {
                if (dataCategoryWithGapOptionTask[index] > 100) {
                    borderColor[index] = 'red';
                    backgroundColor[index] = '#ff9090';

                } else {
                    borderColor[index] = '#ff9090';
                    backgroundColor[index] = '#ff9090';
                }
            } else {
                if (dataCategoryWithGapOptionTask[index] >= -100) {
                    borderColor[index] = '#a9ff86';
                    backgroundColor[index] = '#a9ff86';
                } else {
                    borderColor[index] = 'red';
                    backgroundColor[index] = '#a9ff86';
                }
            }
        }
    }
    const nf = new Intl.NumberFormat('en-US')
    function roundToTwo(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }
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
                formatter: (data) => { return nf.format(Math.round(roundToTwo(data))) },
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
                    projectId + ' - ' + taskNameFromMenu + ' - CATEGORY (' + (dataCategoryWithNameAllTask.length - 1) + '/' + (lengthCategory) + ') - GAP PERCENTAGE (A-Q) CHART'
                    :
                    projectId + ' - ' + taskNameFromMenu + ' - CATEGORY (' + (dataCategoryWithNameOptionTask.length - 1) + '/' + (lengthCategory) + ') - GAP PERCENTAGE (A-Q) CHART'
                ,
                color: select === 'ALL TASK' ?
                    (dataCategoryWithNameAllTask.length !== lengthCategory + 1 || dataCategoryWithNameAllTask.length === 0 || lengthCategory === 0) ? 'red' : 'black'
                    :
                    (dataCategoryWithNameOptionTask.length !== lengthCategory + 1 || dataCategoryWithNameOptionTask.length === 0 || lengthCategory === 0) ? 'red' : 'black'
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
        labels: select === 'ALL TASK' ? dataCategoryWithNameAllTask : dataCategoryWithNameOptionTask,
        datasets: [
            {
                label: "PERCENTAGE",
                data: select === 'ALL TASK' ? dataCategoryWithGapAllTask : dataCategoryWithGapOptionTask,
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
                const element = document.getElementById('category-bar');
                element.style.height = lengthCategory <= 3 ? ('120px') : (lengthCategory + 1) * 30 + 'px';
            } else {
                const element = document.getElementById('category-bar');
                element.style.height = lengthCategoryOption <= 3 ? ('120px') : (lengthCategoryOption + 1) * 30 + 'px';
            }
        } else {
            if (lengthCategoryOption === 0) {
                const element = document.getElementById('category-bar');
                element.style.height = lengthCategory <= 3 ? ('200px') : (lengthCategory + 1) * 50 + 'px';
            } else {
                const element = document.getElementById('category-bar')
                element.style.height = lengthCategoryOption <= 3 ? ('200px') : (lengthCategoryOption + 1) * 50 + 'px';

            }
        }
        
       
    }, [select, width, lengthCategory, queryOptionDone]);


    return (
        < div className='bar-horizontal' >
            <Bar id="category-bar" className='bar' options={options} data={data} />
        </div >
    );
}

export default ChartCategory;