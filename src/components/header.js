import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogoRnaxan } from "./logo";

import "../style/components/header.css"
import "../style/components/navigation.css"
import "../style/components/keyboard-navigation.css"

export function Header() {
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

        <Navigation />
        <KeyboardNavigation />
    </>
}

function Navigation() {
    const ExpandNav = (e) => {
        if (e.target.parentElement.dataset.navSubLinks === "expanded") {
            e.target.parentElement.dataset.navSubLinks = "collapsed"
        } else {
            e.target.parentElement.dataset.navSubLinks = "expanded"
        }
    }

    return <section className="nav" aria-hidden="true">
        <div className="container">
            <div className="top">
                <Link to="/" tabIndex={-1}>
                    <LogoRnaxan />
                </Link>
                <button onClick={() => OpenNav()}>
                    <div />
                    <div />
                    <div />
                </button>
            </div>
            <ul className="middle">
                {NavLinks !== null && NavLinks.map((link, index) => {
                    return <li key={index}>
                        <Link to={link.shortLink} className="directLink" tabIndex={-1}>{link.text}</Link>
                        {link.subLinks && <>
                            <button onClick={(Event) => { ExpandNav(Event) }}>
                                <span>{link.text}</span>
                                <span>+</span>
                            </button>
                            <ul>
                                {link.subLinks.map((subLink, index) => {
                                    return <Link to={subLink.shortLink} key={index} tabIndex={-1}>{subLink.text}</Link>
                                })}
                                <Link to={link.shortLink} className="SeeAll">See All</Link>
                            </ul>
                        </>}
                    </li>
                })}
            </ul>
        </div>
    </section>
}

function KeyboardNavigation() {
    return <section className="keyboard-nav" aria-hidden="false">
        <div className="container">
            <div className="top">
                <LogoRnaxan />
            </div>
            <ul className="middle">
                {NavLinks !== null && NavLinks.map((link, index) => {
                    return <li key={index}>
                        <Link to={link.shortLink} className="directLink">{link.text}</Link>
                        {link.subLinks && <ul>
                            {link.subLinks.map((subLink, index) => {
                                return <Link to={subLink.shortLink} key={index} aria-label={subLink.text}>{subLink.text}</Link>
                            })}
                        </ul>}
                    </li>
                })}
            </ul>
        </div>
    </section>
}

const NavLinks = [
    {
        text: "Recipes",
        shortLink: "/recipes",
        subLinks: [
            {
                text: "Search",
                shortLink: "/recipes/search",
            },
            {
                text: "Your Recipes",
                shortLink: "/recipes/user",
            },
            {
                text: "Archive",
                shortLink: "/recipes/archive",
            }
        ]
    },
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
                text: "Login",
                shortLink: "/account/login",
            },
            {
                text: "Register",
                shortLink: "/account/register",
            },
            {
                text: "Forgot Password",
                shortLink: "/account/forgot",
            },
            {
                text: "Info",
                shortLink: "/account/info",
            }
        ]
    }
]

const OpenNav = () => {
    if (document.documentElement.dataset.navState === "open") {
        document.documentElement.dataset.navState = "closed"
    } else {
        document.documentElement.dataset.navState = "open"
    }
}