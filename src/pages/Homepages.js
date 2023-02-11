import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import InfiniteScroll from 'react-infinite-scroller';
import { getHeroRecipe, getRecipesInfiniteScroller, getUserInfo } from "../firebase";

import "../style/pages/homepage/default.css"
import "../style/pages/homepage/hero.css"
import "../style/pages/homepage/recipes.css"
import { Helmet } from "react-helmet";

export function DefaultHomepage() {
    const [heroRecipe, setHeroRecipe] = useState({});
    const [heroRecipeID, setHeroRecipeID] = useState("");

    useEffect(() => {
        getHeroRecipe()
            .then(res => {
                if (res.data === undefined || res.id === undefined) return
                setHeroRecipe(res.data)
                setHeroRecipeID(res.id)
            })
    }, [])

    return <>
        <Helmet>
            <title>Rnaxan</title>
            <meta name="description" content="Rnaxan | Public Recipes" />
        </Helmet>
        <Hero recipe={heroRecipe} id={heroRecipeID} />
        <InfiniteScroller />
    </>
}

function Hero(props) {
    const [date, setDate] = useState(undefined);

    useEffect(() => {
        if (!props.recipe.info?.createdAt) return
        setDate(new Date(props.recipe.info.createdAt))
    }, [props.recipe])

    return <>
        {props.recipe && <section className="hero">
            <div className="container">
                <div className="top">
                    <div className="container">
                        <h3 className="subTitle">{props.recipe.about?.subTitle}</h3>
                        {date && <span className="date">{new Intl.DateTimeFormat("en-US", { month: "short" }).format(date)}. {date.getDate()}, {date.getFullYear()}</span>}
                    </div>
                </div>
                <div className="bottom">
                    <div className="container">
                        <h2>{props.recipe.about?.title}</h2>
                        <Link to={"recipe/" + props?.id}>View Recipe</Link>
                    </div>
                </div>
                <img src={props.recipe.images?.main} alt="" className="background" />
            </div>
        </section>}
    </>
}

// function CustomHomepage() {
//     return <>
//         <h1>Rnaxan Home [CUSTOM]</h1>
//     </>
// }

// function Featured() { }
function InfiniteScroller() {
    const [lastKey, setLastKey] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [hasMoreToLoad, setHasMoreToLoad] = useState(true);
    const [fetching, setFetching] = useState(false);

    const fetchRecipes = () => {
        if (fetching) return

        setFetching(true);

        getRecipesInfiniteScroller(lastKey)
            .then(res => {
                var arr = recipes;

                res.recipes.forEach(recipe => {
                    if (arr.some(x => x.id === recipe.id)) return

                    arr.push(recipe)
                })

                setLastKey(res.lastKey)
                setRecipes(arr)

                if (res.recipes.length < 5) {
                    setHasMoreToLoad(false)
                }
            }).then(() => {
                setFetching(false);
            })
    }

    return <section className="home-recipes" id="content">
        <div className="container">
            <InfiniteScroll
                loadMore={fetchRecipes}
                hasMore={hasMoreToLoad}
                loader={<div className="loading">
                    <span>Loading...</span>
                </div>}
            >
                <ul>
                    {recipes && <>
                        {recipes.map((recipe, index) => {
                            return <ScrollerItem index={index} recipe={recipe} />
                        })}
                    </>}
                </ul>
            </InfiniteScroll>
        </div>
    </section>
}

function ScrollerItem(props) {
    var date = new Date(props.recipe.data.info.createdAt);
    const [author, setAuthor] = useState();

    useEffect(() => {
        getUserInfo(props.recipe.data.info.author)
            .then(res => {
                setAuthor(res);
            })
    }, [props.recipe])

    return <Link key={props.index} to={"recipe/" + props.recipe.id}>
        <div className="info">
            <span>{props.recipe.data.about.subTitle}</span>
            <span>{new Intl.DateTimeFormat("en-US", { month: "short" }).format(date)}. {date.getDate()}, {date.getFullYear()}</span>
        </div>
        <div className="image">
            <img src={props.recipe.data.images.main} alt="" />
        </div>
        <div className="about">
            <span className="title" title={props.recipe.data.about.title}>{props.recipe.data.about.title}</span>
            {author && <Link className="author">{author?.about.firstname} {author?.about.lastname}</Link>}
        </div>
    </Link>
}