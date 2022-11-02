import React from 'react';

const ProjectDataDetail = (props) => {
    const {getDataOutdoor} =props
    const nf = new Intl.NumberFormat('en-US')
    return (
        <tr>
                                            <td>Outdoor</td>
                                            <td style={{borderLeft:"1px solid #ddd5d5"}}>{(nf.format(Math.round(getDataOutdoor.designs)).toString())}</td>
                                            <td style={{borderLeft:"1px solid #ddd5d5"}} className="text-muted">
                                            {(nf.format(Math.round(getDataOutdoor.quotations)).toString())}
                                            </td>
                                            <td style={{borderLeft:"1px solid #ddd5d5"}} className="text-muted">{(nf.format(Math.round(getDataOutdoor.actuals)).toString())}</td>
                                            <td style={{borderLeft:"1px solid #ddd5d5"}} className="text-muted">
                                            {(nf.format(Math.round(getDataOutdoor.gapAQ)).toString())}
                                            </td>
                                            <td style={{color: Math.round(getDataOutdoor.gapAQPercentage) <= -10 && "red" || Math.round(getDataOutdoor.gapAQPercentage) >= 10 && "red"}}>
                                            {(nf.format(Math.round(getDataOutdoor.gapAQPercentage)).toString())}%
                                            </td>
                                            <td style={{borderLeft:"1px solid #ddd5d5"}} className="text-muted">
                                            {(nf.format(Math.round(getDataOutdoor.gapAD)).toString())}
                                            </td>
                                            <td style={{color: Math.round(getDataOutdoor.gapADPercentage) <= -10 && "red" || Math.round(getDataOutdoor.gapADPercentage) >= 10 && "red"}}>
                                            {(nf.format(Math.round(getDataOutdoor.gapADPercentage)).toString())}%
                                            </td>
                                        </tr>
    );
}

export default ProjectDataDetail;