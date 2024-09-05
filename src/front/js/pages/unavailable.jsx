import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Unavailable() {
    const navigate = useNavigate();

    function handleOnClick() {
        navigate("/login");
    }

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center">
            <div className="container text-center">
                <div className="row">
                    <div className="col">
                        <h1>The page isn't available</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h5>The link you followed may be broken, or the page may have been removed.</h5>
                    </div>
                </div>
                <div className="row my-3">
                    <div className="col">
                        <img
                            className="img-fluid"
                            src="https://avatars.githubusercontent.com/u/12384490?v=4"
                            alt="Link unavailable"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <p>
                            <a className="link-opacity-100" onClick={handleOnClick}>
                                Go back to login page
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
