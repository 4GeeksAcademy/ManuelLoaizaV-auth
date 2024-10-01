import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Context } from '../store/appContext.js';

export default function SignUp() {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleOnClick() {
        navigate("/login");
    }

    async function handleOnSubmit(event) {
        event.preventDefault();
        const { createdUser, error } = await actions.signup({
            email,
            password,
            first_name: firstName,
            last_name: lastName
        });
        if (error !== undefined) {
            Swal.fire({
                title: 'Signup failed',
                text: error,
                icon: 'error'
            });
            return;
        }
        navigate("/login");
    }

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center">
            <div className="container">
                <form onSubmit={handleOnSubmit}>
                    <img
                        className="img-fluid mb-4"
                        src="https://static-00.iconduck.com/assets.00/bitwarden-v2-icon-512x512-cstnj11p.png"
                        alt="Bitwarden logo"
                        style={{ height: '57px' }}
                    />
                    <h1 className="mb-3">Sign up</h1>
                    <div className="row g-3">
                        <div className="col-sm-6">
                            <label
                                htmlFor="first-name"
                                className="form-label"
                            >
                                First name
                            </label>
                            <input
                                id="first-name"
                                type="text"
                                className="form-control"
                                onChange={e => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-sm-6">
                            <label
                                htmlFor="last-name"
                                className="form-label"
                            >
                                Last name
                            </label>
                            <input
                                id="last-name"
                                type="text"
                                className="form-control"
                                onChange={e => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-12">
                            <label
                                htmlFor="email"
                                className="form-label"
                            >
                                Email&nbsp;
                                <span className="text-secondary">(Required)</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                placeholder="example@4geeks.xyz"
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-12">
                            <label
                                htmlFor="password"
                                className="form-label"
                            >
                                Password&nbsp;
                                <span className="text-secondary">(Required)</span>
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                onChange={e => setPassword(e.target.value)}
                                required
                            ></input>
                        </div>
                        <button
                            className="btn btn-primary w-100 mb-3"
                            type="submit"
                        >
                            Create account
                        </button>
                    </div>
                    <p>
                        Already have an account?&nbsp;
                        <a className="link-opacity-100" onClick={handleOnClick}>Log in</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
