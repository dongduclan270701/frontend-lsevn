import React from 'react';

const TitleCategoryAnalysis = (props) => {
    const {projectId} = props
    return (
        <div className="container-xl">
            {/* Page title */}
            <div className="page-header d-print-none">
                <div className="row g-2 align-items-center">
                    <div className="col">
                        <h2 className="page-title">Project number: {projectId}</h2>
                    </div><div className="col">
                        <h2 className="page-title">Project name: {projectId}</h2>
                    </div>
                </div>
            </div></div>
    );
}

export default TitleCategoryAnalysis;
