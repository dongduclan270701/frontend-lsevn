import React from 'react';
const ProjectDataDetail = (props) => {
    const nf = new Intl.NumberFormat('en-US')
    const {item} = props;
    return (
        <tr>
                                            <td>{item.value.panelQty}</td>
                                            <td style={{borderLeft:"1px solid #ddd5d5"}}>{item.state}</td>
                                            <td  style={{borderLeft:"1px solid #ddd5d5"}} className="text-muted">
                                            {nf.format(Math.round(item.value.designs))}
                                            </td>
                                            <td  style={{borderLeft:"1px solid #ddd5d5"}} className="text-muted">{nf.format(Math.round(item.value.quotations))}</td>
                                            <td  style={{borderLeft:"1px solid #ddd5d5"}} className="text-muted">
                                            {nf.format(Math.round(item.value.actuals))}
                                            </td>
                                            <td style={{borderLeft:"1px solid #ddd5d5"}}>
                                            {nf.format(Math.round(item.value.gapAQ))} </td>
                                            <td style={{color: Math.round(item.value.gapAQPercentage) <= -10 && "red" || Math.round(item.value.gapAQPercentage) >= 10 && "red"}}>{nf.format(Math.round(item.value.gapAQPercentage))}%</td>
                                            <td style={{borderLeft:"1px solid #ddd5d5"}}>
                                            {nf.format(Math.round(item.value.gapAD))} </td>
                                            <td style={{color: Math.round(item.value.gapADPercentage) <= -10 && "red" || Math.round(item.value.gapADPercentage) >= 10 && "red"}}>{nf.format(Math.round(item.value.gapADPercentage))}%</td>
                                        </tr>
    );
}

export default ProjectDataDetail;
