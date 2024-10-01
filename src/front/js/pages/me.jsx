import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Me() {
    const [data, setData] = useState(undefined);
    const navigate = useNavigate();

    function handleOnClick() {
        navigate("/login");
    }

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken === null) {
            navigate("/login");
            return;
        }
        const decodedAccessToken = jwtDecode(accessToken);
        if (Date.now() >= decodedAccessToken.exp * 1000) {
            navigate("/login");
            return;
        }
        setData(decodedAccessToken.sub);
    }, []);

    if (data === undefined) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center text-center">
            <div className="container">
                <h1 className="mb-3">{`${data.first_name} ${data.last_name}`}</h1>
                <button onClick={handleOnClick}><i class="fa-solid fa-right-from-bracket" /></button>
            </div>
        </div>
    );
}