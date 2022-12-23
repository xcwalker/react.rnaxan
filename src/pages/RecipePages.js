import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Helmet } from "react-helmet";
import { getRecipe, getUserInfo } from "../firebase";
import QRCode from "react-qr-code";
import { LogoFacebook, LogoTwitter } from "../components/logo";

import "../style/pages/recipe/view.css"

export function RecipeIndex() {
    return <>
        <h2>Recipe (Index)</h2>
    </>
}

export function RecipeNew() {
    return <>
        <h2>Recipe (New)</h2>
    </>
}

export function RecipeView() {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState({});
    const [date, setDate] = useState();
    const [author, setAuthor] = useState({});

    useEffect(() => {
        setLoading(true)
        getRecipe(params.id).then(res => {
            setRecipe(res)
            setDate(new Date(res.info.createdAt))
            getUserInfo(res.info.author).then(res => {
                console.log(res)
                setAuthor(res)
                setLoading(false)
            })
        })
    }, [params.id])

    const DateOptions = { month: "short" };

    const shareModalOpen = () => {
        document.getElementById("share-modal").showModal();
    }
    const shareModalClose = () => {
        document.getElementById("share-modal").close();
    }
    function dialogClickHandler(e) {
        if (e.target.tagName !== 'DIALOG') //This prevents issues with forms
            return;

        const rect = e.target.getBoundingClientRect();

        const clickedInDialog = (
            rect.top <= e.clientY &&
            e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX &&
            e.clientX <= rect.left + rect.width
        );

        if (clickedInDialog === false)
            e.target.close();
    }

    return <>
        {!loading && <>
            <Helmet>
                <title>{recipe?.about.title + ' by ' + author?.about.displayname + ' | Rnaxan'}</title>
                <meta property="og:title" name="title" content={recipe?.about.title + ' by ' + author?.about.displayname + ' | Rnaxan'} />
                <meta name="description" content={recipe?.about.title + " (" + recipe?.about.subTitle + ") by " + author?.about.firstname + " " + author?.about.lastname + " | Only On Rnaxan"} />

                <meta property="og:image" content={recipe.images?.main} />

                <meta property="og:type" content="article.recipe" />
            </Helmet>
            <section className="recipe">
                <div className="container">
                    <div className="side">
                        <div className="side-item" id="author">
                            <div className="info">
                                <span>Author</span>
                            </div>
                            {author && <div className="about">
                                <img src={author?.images.photoURL} alt="" />
                                <div>
                                    <span className="name">{author?.about.firstname} {author?.about.lastname}</span>
                                    <span>{author?.about.displayname}</span>
                                </div>
                            </div>}
                        </div>
                        {recipe.about?.information && <div className="side-item" id="information">
                            <div className="info">
                                <span>Information</span>
                            </div>
                            <ul>
                                {recipe.about?.information.map((info, index) => {
                                    return <li key={index}>
                                        <span className="title">{info.title}</span>
                                        <span className="subTitle">{info.subTitle}</span>
                                    </li>
                                })}
                            </ul>
                        </div>}
                        <div className="side-item" id="quick-links">
                            <div className="info">
                                <span>Quick Links</span>
                            </div>
                            <ul>
                                <a href="#ingredients">Ingredients</a>
                                <a href="#prep">Prep</a>
                                <a href="#instructions">Instructions</a>
                            </ul>
                        </div>
                        <button className="share" onClick={() => { shareModalOpen() }}>Share</button>
                        {recipe?.ingredients && <div className="side-item" id="ingredients">
                            <div className="info">
                                <span>Ingredients</span>
                            </div>
                            <ul>
                                {recipe?.ingredients.map((ingredient, index) => {
                                    return <li key={index}>
                                        {ingredient}
                                    </li>
                                })}
                            </ul>
                        </div>}
                    </div>
                    <div className="main">
                        <header>
                            <img src={recipe.images?.main} alt="" />
                            <div className="container">
                                <div className="info">
                                    <span className="subTitle">{recipe?.about.subTitle}</span>
                                    <span className="date">{new Intl.DateTimeFormat("en-US", DateOptions).format(date)}. {date.getDate()}, {date.getFullYear()}</span>
                                </div>
                            </div>
                            <div className="alt-container">
                                <div className="about">
                                    <span>{recipe?.about.title}</span>
                                </div>
                            </div>
                        </header>
                        <main>
                            <div className="mobile">
                                {author && <div className="main-item" id="author">
                                    <div className="info">
                                        <span>Author</span>
                                    </div>
                                    <div className="about">
                                        <img src={author?.images.photoURL} alt="" />
                                        <div>
                                            <span className="name">{author?.about.firstname} {author?.about.lastname}</span>
                                            <span>{author?.about.displayname}</span>
                                        </div>
                                    </div>
                                </div>}
                                {recipe.about?.information && <div className="main-item" id="information">
                                    <div className="info">
                                        <span>Information</span>
                                    </div>
                                    <ul>
                                        {recipe.about?.information.map((info, index) => {
                                            return <li key={index}>
                                                <span className="title">{info.title}</span>
                                                <span className="time">{info.subTitle}</span>
                                            </li>
                                        })}
                                    </ul>
                                </div>}
                                <div className="main-item" id="quick-links">
                                    <div className="info">
                                        <span>Quick Links</span>
                                    </div>
                                    <ul>
                                        <a href="#ingredients">Ingredients</a>
                                        <a href="#prep">Prep</a>
                                        <a href="#instructions">Instructions</a>
                                    </ul>
                                </div>
                                <button className="share" onClick={() => { shareModalOpen() }}>Share</button>
                                {recipe?.ingredients && <div className="main-item" id="ingredients">
                                    <div className="info">
                                        <span>Ingredients</span>
                                    </div>
                                    <ul>
                                        {recipe?.ingredients.map((ingredient, index) => {
                                            return <li key={index}>
                                                {ingredient}
                                            </li>
                                        })}
                                    </ul>
                                </div>}
                            </div>
                            {recipe?.instructions.prep && <div className="main-item" id="prep">
                                <div className="info">
                                    <span>Prep</span>
                                </div>
                                <ol>
                                    {recipe?.instructions.prep.map((step, index) => {
                                        return <li key={index}>
                                            {step}
                                        </li>
                                    })}
                                </ol>
                            </div>}
                            {recipe?.instructions.cook && <div className="main-item" id="instructions">
                                <div className="info">
                                    <span>Instructions</span>
                                </div>
                                <ol>
                                    {recipe?.instructions.cook.map((step, index) => {
                                        return <li key={index}>
                                            {step}
                                        </li>
                                    })}
                                </ol>
                            </div>}
                        </main>
                        <footer></footer>
                    </div>
                </div>
            </section>
        </>}
        <dialog className="recipe-share" id="share-modal" onClick={(Event) => { dialogClickHandler(Event) }}>
            <header>
                <span>Share</span>
                <button onClick={() => { shareModalClose() }}>
                    <span className="material-symbols-outlined">close</span>
                </button>
            </header>
            <main>
                <div className="other">
                    <p>
                        <span>Share this recipe with those</span>
                        <span>nearby using this QR code,</span>
                    </p>
                    <span>Or Share With...</span>
                    <ul>
                        <a className="share-btn" href={"mailto:?subject=Check out this recipe;body=Hi there, check out this recipe on Rnaxan, https://rnaxan.xcwalker.dev/recipe/" + params.id} title="Share By Email" id="email">
                            <span className="material-symbols-outlined">mail</span>
                        </a>
                        <button className="share-btn" onClick={() => { navigator.clipboard.writeText("https://rnaxan.xcwalker.dev/recipe/" + params.id) }} title="Copy to clipboard" id="copy">
                            <span className="material-symbols-outlined">content_copy</span>
                        </button>
                        <a href={"http://twitter.com/share?text=Check out this recipe on Rnaxan&url=http://rnaxan.xcwalker.dev/recipe/" + params.id + "&hashtags=Rnaxan,Recipe"} className="share-btn">
                            <LogoTwitter />
                        </a>
                        <a href={"https://www.facebook.com/sharer/sharer.php?u=http://rnaxan.xcwalker.dev/recipe/" + params.id} className="share-btn">
                            <LogoFacebook />
                        </a>


                    </ul>
                </div>
                <div className="qr">
                    <QRCode value={"https://rnaxan.xcwalker.dev/recipe/" + params.id} />
                </div>
            </main>
            <footer></footer>
        </dialog>
    </>
}

export function RecipeEdit() {
    return <>
        <h2>Recipe (Edit)</h2>
    </>
}