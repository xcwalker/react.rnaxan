import { useEffect, useRef, useState } from "react"
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { forgot, getUserInfo, login, logout, useAuth } from "../firebase";

import "../style/pages/account/default.css"
import "../style/pages/account/info.css"

export function AccountIndex() {
    const currentUser = useAuth(null);
    return <>
        {currentUser === null && <Navigate to="./login" />}
        {currentUser && <Navigate to="/user" />}
    </>
}

export function AccountManage() {
    const currentUser = useAuth(null);
    const [redirect, setRedirect] = useState(false);

    function handleLogout() {
        logout();
    }

    useEffect(() => {
        if (currentUser === null) setRedirect(true)
    }, [currentUser])

    return <>
        {!currentUser && redirect && <Navigate to="../login" />}
        {currentUser && <>
            <Helmet>
                <title>Manage Account | Rnaxan</title>
                <meta name="description" content="Manage your Rnaxan/Acron account" />
            </Helmet>
            <section className="account">
                <div className="container">
                    <button onClick={() => handleLogout()}>Logout</button>
                </div>
            </section>
        </>}
    </>
}

export function AccountRegister() {
    const currentUser = useAuth();

    return <>
        <Helmet>
            <title>Account Register | Rnaxan</title>
            <meta name="description" content="Create an account for Rnaxan" />
        </Helmet>
        <section className="account-info">
            <div className="container">
                <div className="info">
                    <span>Register</span>
                </div>
                {currentUser === null && <>
                    <p>Rnaxan use Acron accounts.</p>
                    <a href="https://acron.xcwalker.dev/account/register">Register</a>
                </>}
                {currentUser && <>
                    <Navigate to="/user" />
                </>}
            </div>
        </section>
    </>
}

export function AccountInfo() {
    const currentUser = useAuth();
    const [user, setUser] = useState();

    useEffect(() => {
        if (currentUser === undefined) return

        getUserInfo(currentUser.uid)
            .then(res => {
                setUser(res)
            })
    }, [currentUser])

    return <>
        <Helmet>
            <title>Account Info | Rnaxan</title>
            <meta name="description" content="Rnaxan Account Info" />
        </Helmet>
        <section className="account-info">
            <div className="container">
                <div className="info">
                    <span>Account Info</span>
                </div>
                {!currentUser && <>
                    <p>Acron accounts are used for the simplicity of the user, as this allows you to only make one account for all <a href="xcwalker.dev">xcwalker.dev</a> sites.</p>
                    <Link to="../login">Login</Link>
                </>}
                {currentUser && <>
                    <div className="about">
                        <img src={currentUser.photoURL} alt="" />
                        {user && <div className="text">
                            <span className="title">{user.about.firstname} {user.about.lastname}</span>
                            <span className="subTitle">{user.about.displayname}</span>
                        </div>}
                    </div>
                    <Link to="../manage">Manage</Link>
                </>}
            </div>
        </section>
    </>
}

export function AccountLogin() {
    const [error, setError] = useState("");
    const currentUser = useAuth();

    const emailRef = useRef();
    const passwordRef = useRef();

    async function handleSubmit(e) {
        e.preventDefault();

        login(emailRef.current.value, passwordRef.current.value)
            .then(res => {
                if (res.error) {
                    setError(res.error)
                }
            })
    }

    return <>
        {currentUser && <Navigate to='/user/' />}
        <Helmet>
            <title>Login | Rnaxan</title>
            <meta name="description" content="Login into Rnaxan using your Acron account" />
        </Helmet>
        <section className="account">
            <div className="container">
                <form action="" onSubmit={(Event) => { handleSubmit(Event) }}>
                    <div className="info">
                        <span>Login</span>
                    </div>
                    {error !== "" && <span className="error">Error: {error}</span>}
                    <input type="email" name="email" id="email" ref={emailRef} placeholder="email" pattern="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?" required />
                    <input type="password" name="password" id="password" ref={passwordRef} placeholder='password' pattern="^(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$" required />
                    <button type="submit">Login</button>
                    <div className="other">
                        <Link to="../register">Need an account?</Link>
                        <Link to="../info">Info</Link>
                        <Link to="../forgot">Forgot Password?</Link>
                    </div>
                </form>
            </div>
            <Background />
        </section>
    </>
}

export function AccountForgot() {
    const [error, setError] = useState("");

    const emailRef = useRef();

    async function handleSubmit(e) {
        e.preventDefault();

        forgot(emailRef.current.value)
            .then(res => {
                if (res.error) {
                    setError(res.error)
                }
            })
    }

    return <>
        <Helmet>
            <title>Forgot Password | Rnaxan</title>
            <meta name="description" content="Reset your Acron account password" />
        </Helmet>
        <section className="account">
            <div className="container">
                <form action="" onSubmit={(Event) => { handleSubmit(Event) }}>
                    <div className="info">
                        <span>Forgot Password</span>
                    </div>
                    {error !== "" && <span className="error">Error: {error}</span>}
                    <input type="email" name="email" id="email" ref={emailRef} placeholder="email" pattern="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?" required />
                    <button type="submit">Reset Password</button>
                    <div className="other">
                        <Link to="../login">Login</Link>
                    </div>
                </form>
            </div>
            <Background />
        </section>
    </>
}

function Background() {
    return <div className="background">

    </div>
}