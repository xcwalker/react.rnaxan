import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogoRnaxan } from "./logo";
import { useAuth } from "../firebase";

import "../style/components/header.css"
import "../style/components/navigation.css"
import "../style/components/keyboard-navigation.css"

export function Header() {
    const currentUser = useAuth();
    const [eventListener, setEventListener] = useState(false);

    useEffect(() => {
        if (eventListener === true) return

        document.addEventListener("scroll", e => {
            if (document.querySelector("#root>main>section.hero") === null) {
                document.querySelector("#root>header").classList.remove("hero-color")
            }

            if (document.querySelector("#root>main>section.hero") !== null) {
                document.querySelector("#root>header").classList.add("hero-color")
                if (document.querySelector("#root>main>section.hero").getBoundingClientRect().bottom < 52) {
                    document.querySelector("#root>header").classList.remove("hero-color")
                } else if (document.querySelector("#root>main>section.hero").getBoundingClientRect().bottom >= 52) {
                    document.querySelector("#root>header").classList.add("hero-color")
                }
            }
        })
        setEventListener(true)
    }, [eventListener])


    return <>
        <header id="navbar">
            <div className="container">
                <Link to="/">
                    <LogoRnaxan />
                </Link>
                <button onClick={() => OpenNav()} tabIndex="-1">
                    <div />
                    <div />
                    <div />
                </button>
            </div>
        </header>

        <Navigation currentUser={currentUser} />
        <KeyboardNavigation currentUser={currentUser} />
    </>
}

function Navigation(props) {
    const ExpandNav = (e) => {
        if (e.target.parentElement.dataset.navSubLinks === "expanded") {
            e.target.parentElement.dataset.navSubLinks = "collapsed"
        } else {
            e.target.parentElement.dataset.navSubLinks = "expanded"
        }
    }

    return <section className="nav" aria-hidden="true" tabIndex={-1}>
        <div className="container" tabIndex={-1}>
            <div className="top" tabIndex={-1}>
                <Link to="/" tabIndex={-1}>
                    <LogoRnaxan />
                </Link>
                <button onClick={() => OpenNav()} tabIndex={-1}>
                    <div />
                    <div />
                    <div />
                </button>
            </div>
            <ul className="middle">
                {NavLinks !== null && NavLinks.map((link, index) => {
                    function Content() {
                        return <li key={index}>
                            <Link to={link.shortLink} onClick={() => OpenNav()} className="directLink" tabIndex={-1}>{link.text}</Link>
                            {!link.subLinks && <Link to={link.shortLink} onClick={() => OpenNav()} className="directLinkMobile" tabIndex={-1}>{link.text}</Link>}
                            {link.subLinks && <>
                                <button onClick={(Event) => { ExpandNav(Event) }} tabIndex={-1}>
                                    <span>{link.text}</span>
                                    <span>+</span>
                                </button>
                                <ul>
                                    {link.subLinks.map((subLink, index) => {
                                        if (subLink.user === "notLoggedIn") {
                                            return <Fragment key={index}>
                                                {!props.currentUser && <Link to={subLink.shortLink} onClick={() => OpenNav()} key={index} tabIndex={-1} aria-label={subLink.text}>{subLink.text}</Link>}
                                            </Fragment>
                                        }
                                        if (subLink.user === "loggedIn") {
                                            return <Fragment key={index}>
                                                {props.currentUser && <Link to={subLink.shortLink} onClick={() => OpenNav()} key={index} tabIndex={-1} aria-label={subLink.text}>{subLink.text}</Link>}
                                            </Fragment>
                                        }

                                        return <Link to={subLink.shortLink} onClick={() => OpenNav()} key={index} tabIndex={-1} aria-label={subLink.text}>{subLink.text}</Link>
                                    })}
                                    <Link to={link.shortLink} onClick={() => OpenNav()} className="SeeAll" tabIndex={-1}>See All</Link>
                                </ul>
                            </>}
                        </li>
                    }

                    if (link.user === "notLoggedIn") {
                        return <Fragment key={index}>
                            {!props.currentUser && <Content />}
                        </Fragment>
                    }

                    if (link.user === "loggedIn") {
                        return <Fragment key={index}>
                            {props.currentUser && <Content />}
                        </Fragment>
                    }

                    return <Content key={index} />
                })}
            </ul>
        </div>
    </section>
}

function KeyboardNavigation(props) {
    return <section className="keyboard-nav" aria-hidden="false">
        <div className="container">
            <div className="top">
                <LogoRnaxan />
            </div>
            <ul className="middle">
                {NavLinks !== null && NavLinks.map((link, index) => {
                    function Content() {
                        return <li key={index}>
                            <Link to={link.shortLink} className="directLink">{link.text}</Link>
                            {link.subLinks && <ul>
                                {link.subLinks.map((subLink, index) => {
                                    if (subLink.user === "notLoggedIn") {
                                        return <Fragment key={index}>
                                            {!props.currentUser && <Link to={subLink.shortLink} key={index} aria-label={subLink.text}>{subLink.text}</Link>}
                                        </Fragment>
                                    }

                                    if (subLink.user === "loggedIn") {
                                        return <Fragment key={index}>
                                            {props.currentUser && <Link to={subLink.shortLink} onClick={() => OpenNav()} key={index} aria-label={subLink.text}>{subLink.text}</Link>}
                                        </Fragment>
                                    }

                                    return <Link to={subLink.shortLink} key={index} aria-label={subLink.text}>{subLink.text}</Link>
                                })}
                            </ul>}
                        </li>
                    }

                    if (link.user === "notLoggedIn") {
                        return <Fragment key={index}>
                            {!props.currentUser && <Content />}
                        </Fragment>
                    }

                    if (link.user === "loggedIn") {
                        return <Fragment key={index}>
                            {props.currentUser && <Content />}
                        </Fragment>
                    }

                    return <Content key={index} />
                })}
            </ul>
        </div>
    </section>
}

const NavLinks = [
    {
        text: "About",
        shortLink: "/about",
        subLinks: [
            {
                text: "FAQ",
                shortLink: "/about/faq",
            },
            {
                text: "Contact",
                shortLink: "/about/contact",
            }
        ]
    },
    {
        text: "Account",
        shortLink: "/account",
        subLinks: [
            {
                text: "Manage",
                shortLink: "/account/manage",
                user: "loggedIn",
            },
            {
                text: "Login",
                shortLink: "/account/login",
                user: "notLoggedIn",
            },
            {
                text: "Register",
                shortLink: "/account/register",
                user: "notLoggedIn",
            },
            {
                text: "Forgot Password",
                shortLink: "/account/forgot",
                user: "notLoggedIn",
            },
            {
                text: "Info",
                shortLink: "/account/info",
            },
        ]
    },
    {
        text: "User",
        shortLink: "/user",
        user: "loggedIn",
        subLinks: [
            {
                text: "Edit",
                shortLink: "/user/edit",
                user: "loggedIn",
            },
        ]
    },
    {
        text: "Search",
        shortLink: "/search",
    },
    {
        text: "Archive",
        shortLink: "/archive",
    },
]

const OpenNav = () => {
    if (document.documentElement.dataset.navState === "open") {
        document.documentElement.dataset.navState = "closed"
    } else {
        document.documentElement.dataset.navState = "open"
    }
}