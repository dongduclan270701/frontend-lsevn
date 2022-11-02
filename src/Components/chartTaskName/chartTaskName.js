// import React, { useEffect, useState } from 'react';
// import './chartTaskName.css';
// import axios from 'axios';
// import { Auth } from 'Action';
// import ChartDataLabels from 'chartjs-plugin-datalabels';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';
// import { Bar, Line } from 'react-chartjs-2';
// ChartJS.register(
//     ChartDataLabels,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend
// );
// const ChartTaskName = (props) => {
//     let { dataTaskNameWithGap } = props;
//     let { dataTaskNameWithName } = props;
//     var { lengthTaskName } = props;
//     var { avg } = props;
//     var { GetPosition } = props;
//     useEffect(() => {
//         var element = document.getElementById('taskname-bar');
//         var rect = element.getBoundingClientRect();
//         GetPosition(rect);
//         // console.log(rect.y);
//     }, [lengthTaskName]);

//     const GetPositionWhenScroll = () => {
//         var element = document.getElementById('taskname-bar');
//         var rect = element.getBoundingClientRect();
//         GetPosition(rect);
//         // console.log(rect.y);
//     }
//     window.addEventListener("scroll", GetPositionWhenScroll);

//     let backgroundColor = new Array();
//     let borderColor = new Array();
//     var length = dataTaskNameWithGap.length;

//     if (avg) {
//         var indexTotal = dataTaskNameWithName.indexOf('GRAND TOTAL OF PROJECT');
//         dataTaskNameWithGap[indexTotal] = avg;
//         if (avg > 0) {
//             if (avg > 100) {
//                 borderColor[indexTotal] = ('red');
//                 backgroundColor[indexTotal] = ('rgba(53, 162, 235, 0.5)');
//             } else {
//                 borderColor[indexTotal] = ('rgba(53, 162, 235, 0.5)');
//                 backgroundColor[indexTotal] = ('rgba(53, 162, 235, 0.5)');
//             }
//         } else {
//             if (avg) {
//                 borderColor[indexTotal] = ('rgba(255, 99, 132, 0.5)');
//                 backgroundColor[indexTotal] = ('rgba(255, 99, 132, 0.5)');
//             } else {
//                 borderColor[indexTotal] = ('rgb(255, 0, 0)');
//                 backgroundColor[indexTotal] = ('rgba(255, 99, 132, 0.5)');
//             }
//         }
//     }
//     useEffect(() => {
//         dataTaskNameWithName.push("GRAND TOTAL OF PROJECT");
//         dataTaskNameWithGap.push(avg);
//     }, []);

//     for (let index = 0; index < length; index++) {
//         if (dataTaskNameWithGap[index] > 0) {
//             if (dataTaskNameWithGap[index] > 100) {
//                 borderColor[index] = 'red';
//                 backgroundColor[index] = 'rgba(53, 162, 235, 0.5)';
//             } else {
//                 borderColor[index] = 'rgba(53, 162, 235, 0.5)';
//                 backgroundColor[index] = 'rgba(53, 162, 235, 0.5)';
//             }
//         } else {
//             if (dataTaskNameWithGap[index] >= -100) {
//                 borderColor[index] = 'rgba(255, 99, 132, 0.5)';
//                 backgroundColor[index] = 'rgba(255, 99, 132, 0.5)';
//             } else {
//                 borderColor[index] = 'rgb(255, 0, 0)';
//                 backgroundColor[index] = 'rgba(255, 99, 132, 0.5)';
//             }
//         }
//     }
//     let width = window.screen.width;
//     const options = {
//         indexAxis: 'y',
//         scales: {
//             y: {
//                 ticks: {
//                     display: width < 769 ? true : true,
//                     font: {
//                         size: width < 476 ? 6 : width < 601 ? 6 : width < 769 ? 7 : width < 1081 ? 8 : width < 1441 ? 10 : 12
//                     },
//                     // display: true
//                 }
//             },
//             x: {
//                 ticks: {
//                     font: {
//                         size: 15
//                     },
//                     stepSize: 20

//                     // display: true
//                 },
//                 min: -105,
//                 max: 105,
//             }
//         },
//         elements: {
//             bar: {
//                 borderWidth: 1.5,
//             },
//         },
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             datalabels: { // This code is used to display data values
//                 // anchor: "start",
//                 clamp: 'true',
//                 // align: 'center',
//                 formatter: Math.round,
//                 font: {
//                     // weight: 'bold',
//                     // size: 16
//                     size: width < 476 ? 6 : width < 601 ? 6 : width < 769 ? 7 : width < 1081 ? 8 : width < 1441 ? 12 : 14
//                 }
//             },
//             legend: {
//                 // position: 'right',
//                 display: false
//             },
//             title: {
//                 display: true,
//                 text: 'GAP PERCENTAGE CHART',
//             },
//             tooltip: {
//                 enabled: true
//             }
//         }
//     };
//     const data = {
//         labels: dataTaskNameWithName,
//         datasets: [
//             {
//                 label: "PERCENTAGE",
//                 data: dataTaskNameWithGap,
//                 borderColor: borderColor,
//                 backgroundColor: backgroundColor,
//                 // barThickness: 20,
//                 // minBarLength: 40,
//             }
//         ],
//     };
//     // setTimeout(() => {
//     //     var element = document.getElementById('taskname-bar');
//     //     element.style.height = lengthTaskName <= 3 ? ('200px') : (lengthTaskName + 1) * 50 + 'px';
//     // }, 500);

//     return (
//         // <div className='container-xl'>
//             < div className='bar-horizontal' >
//                 <Bar id="taskname-bar" className='bar' options={options} data={data} />
//             </div >
//         // </div>
//     );
// }

// export default ChartTaskName;