import React from 'react';
// import "Assets/scss/projectList.scss"

const TitleProjectList = () => {
    return (
        <div className="container-xl">
            {/* Page title */}
            <div className="page-header d-print-none">
                <div className="row g-2 align-items-center">
                    <div className="col">
                        <h2 className="page-title">Please choose project number:</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TitleProjectList;
