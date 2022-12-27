import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"

import "../style/pages/error.css"

export function Error(props) {
    return <>
        {props.helmet && <Helmet>
            <title>{props.helmet?.title}</title>
            <meta name="description" content={props.helmet?.description} />
        </Helmet>}
        <section className="error">
            <div className="container">
                <div className="content">
                    <div className="info">
                        <span>Error</span>
                        <span>{props.error?.code}</span>
                    </div>
                    <div className="about">
                        <h1>{props.error?.message}</h1>
                    </div>
                    {props.routes && <ul className="routes">
                        {props.routes.map((route, index) => {
                            return <Link to={route.shortURL} key={index}>{route.text}</Link>
                        })}
                    </ul>}
                </div>
            </div>
        </section>
    </>
}