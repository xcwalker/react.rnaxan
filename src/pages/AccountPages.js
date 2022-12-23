import { useEffect, useRef, useState } from "react"
import { Link, Navigate } from "react-router-dom";
import { forgot, login, logout, useAuth } from "../firebase";

import "../style/pages/account/default.css"

export function AccountIndex() {
    return <>
        <h1>Account (Index)</h1>
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
        {currentUser && <section className="account">
            <div className="container">
                <button onClick={() => handleLogout()}>Logout</button>
            </div>
        </section>}
    </>
}

export function AccountRegister() {
    return <>
        <h1>Account (Register)</h1>
    </>
}

export function AccountInfo() {
    return <>
        <h1>Account (Info)</h1>
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