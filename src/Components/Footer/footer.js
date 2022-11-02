import React from 'react';
// import "Assets/scss/footer.scss"

const Footer = () => {
    return (
        <footer className="footer footer-transparent d-print-none">
            <div className="container-xl">
                <div className="row text-center align-items-center flex-row-reverse">
                    <div className="col-lg-auto ms-lg-auto">
                        <ul className="list-inline mb-0" style={{listStyleType:'none'}}>
                            <li className="list-inline-item"></li>
                            <li className="list-inline-item"></li>
                            <li className="list-inline-item"></li>
                            <li className="list-inline-item">
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="icon text-pink icon-filled icon-inline" width={20} height={20} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg> */}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;