import React from 'react';

const CreateNewData = (props) => {
    const { chooseQ, chooseA, chooseD } = props
    return (
        <div className="page-body">
            <div className="container-xl">
                <div className="row row-cards">
                    <div className="col-12">
                        <form action="https://httpbin.org/post" method="post" className="card">
                            <div className="card-header">
                                {chooseQ === true && <h4 className="card-title">Form create new data : Quotation</h4>}
                                {chooseA === true && <h4 className="card-title">Form create new data : Actual</h4>}
                                {chooseD === true && <h4 className="card-title">Form create new data : Design</h4>}
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-xl-6">
                                        <div className="row">
                                            <div className="col-md-6 col-xl-12">
                                                <div className="mb-3">
                                                    <div className="form-label">Choose file data Quotation</div>
                                                    <div className="row"><input type="file" className="form-control" style={{ marginBottom: '9px', width: '82%', marginLeft: '1%' }} /><div className="col-2 col-sm-2 col-md-2 col-xl-2" style={{}}>
                                                        <a href="#" className="btn btn-outline-secondary w-100" style={{ padding: '5px -2px 5px 10px' }}>Check</a>
                                                    </div></div>
                                                </div>
                                                <div className="mb-3">
                                                    <div className="form-label">Choose file data Quotation</div>
                                                    <div className="row"><input type="file" className="form-control is-valid mb-2" style={{ marginBottom: '9px', width: '82%', marginLeft: '1%' }} /><div className="col-2 col-sm-2 col-md-2 col-xl-2" style={{}}>
                                                        <a href="#" className="btn btn-outline-secondary w-100" style={{ padding: '5px -2px 5px 10px' }}>Check</a>
                                                    </div></div>
                                                </div><div className="mb-3">
                                                    <div className="form-label">Choose file data Quotation</div>
                                                    <div className="row"><input type="file" className="form-control is-invalid" style={{ marginBottom: '9px', width: '82%', marginLeft: '1%' }} /><div className="col-2 col-sm-2 col-md-2 col-xl-2" style={{}}>
                                                        <a href="#" className="btn btn-outline-secondary w-100" style={{ padding: '5px -2px 5px 10px' }}>Check</a>
                                                    </div><div className="invalid-feedback">Project đã tồn tại, vui lòng kiểm tra lại</div></div>
                                                </div></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer text-end">
                                <div className="d-flex">
                                    <a href="#" className="btn btn-link">Cancel</a>
                                    <button type="submit" className="btn btn-primary ms-auto">Send data</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateNewData;
