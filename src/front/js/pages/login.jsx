import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    function handleOnClick() {
        navigate("/signup");
    }

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center">
            <form>
                <img
                    className="img-fluid mb-4"
                    src="https://static-00.iconduck.com/assets.00/bitwarden-v2-icon-512x512-cstnj11p.png"
                    alt="Bitwarden logo"
                    style={{ height: '57px' }}
                />
                <h1 className="mb-3">Log in</h1>
                <div className="form-floating">
                    <input
                        id="floating-email"
                        className="form-control"
                        type="email"
                        placeholder="name@example.com"
                        required
                    />
                    <label for="floating-email">
                        Email address
                    </label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        id="floating-password"
                        className="form-control"
                        type="password"
                        placeholder="Password"
                        required
                    />
                    <label for="floating-email">
                        Password
                    </label>
                </div>
                <button
                    className="btn btn-primary w-100 mb-3"
                    type="submit"
                >
                    Continue
                </button>
                <p>
                    New around here?&nbsp;
                    <a className="link-opacity-100" onClick={handleOnClick}>Create account</a>
                </p>
            </form>
        </div>
    );
}
