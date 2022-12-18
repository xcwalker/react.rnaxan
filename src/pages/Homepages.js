import { Link } from "react-router-dom"
import "../style/pages/homepage/default.css"
import "../style/pages/homepage/hero.css"
import { recipes } from "../temp/recipes"

export function DefaultHomepage() {
    return <>
        <Hero recipe={recipes[0]} />
    </>
}

function Hero(props) {
    return <section className="hero">
        <div className="container">
            <div className="top">
                <div className="container">
                    <h3 className="subTitle">{props.recipe.about.subTitle}</h3>
                    <span className="date">Dec. 16, 2020</span>
                </div>
            </div>
            <div className="bottom">
                <div className="container">
                    <h2>{props.recipe.about.title}</h2>
                    <Link to={"./"}>View Recipe</Link>
                </div>
            </div>
            <img src="https://rnaxan.xcwalker.dev/data/images/recipes/f71ea8d3-4f45-4c55-82f1-28759fe4b68c.webp" alt="" className="background" />
        </div>
    </section>
}

export function CustomHomepage() {
    return <>
        <h1>Rnaxan Home [CUSTOM]</h1>
    </>
} 