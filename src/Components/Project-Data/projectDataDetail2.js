import React from 'react';

const ProjectDataDetail = (props) => {
    const {getDataIndoor} =props
    const nf = new Intl.NumberFormat('en-US')
    return (
        <tr>
                                            <td>Indoor</td>
                                            <td style={{borderLeft:"1px solid #ddd5d5"}}>{(nf.format(Math.round(getDataIndoor.designs)).toString())}</td>
                                            <td style={{borderLeft:"1px solid #ddd5d5"}} className="text-muted">
                                            {(nf.format(Math.round(getDataIndoor.quotations)).toString())}
                                            </td>
                                            <td style={{borderLeft:"1px solid #ddd5d5"}} className="text-muted">{(nf.format(Math.round(getDataIndoor.actuals))).toString()}</td>
                                            <td style={{borderLeft:"1px solid #ddd5d5"}} className="text-muted">
                                            {(nf.format(Math.round(getDataIndoor.gapAQ)).toString())}
                                            </td>
                                            <td style={{color: Math.round(getDataIndoor.gapAQPercentage) <= -10 && "red" || Math.round(getDataIndoor.gapAQPercentage) >= 10 && "red"}}>
                                            {(nf.format(Math.round(getDataIndoor.gapAQPercentage)).toString())}%
                                            </td>
                                            <td style={{borderLeft:"1px solid #ddd5d5"}} className="text-muted">
                                            {(nf.format(Math.round(getDataIndoor.gapAD)).toString())}
                                            </td>
                                            <td style={{color: Math.round(getDataIndoor.gapADPercentage) <= -10 && "red" || Math.round(getDataIndoor.gapADPercentage) >= 10 && "red"}}>
                                            {(nf.format(Math.round(getDataIndoor.gapADPercentage)).toString())}%
                                            </td>
                                        </tr>
    );
}

export default ProjectDataDetail;