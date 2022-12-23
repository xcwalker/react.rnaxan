import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { Helmet } from "react-helmet";
import { useAuth, getRecipe, getUserInfo, updateRecipe } from "../firebase";
import QRCode from "react-qr-code";
import { LogoFacebook, LogoTwitter } from "../components/logo";

import "../style/pages/recipe/view.css"
import "../style/pages/recipe/edit.css"

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
    const currentUser = useAuth();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState({});
    const [date, setDate] = useState();
    const [author, setAuthor] = useState({});

    useEffect(() => {
        setLoading(true)
        getRecipe(params.id).then(res => {
            setRecipe(res)
            console.log(res.info.createdAt)
            setDate(new Date(res.info.createdAt.toString()))
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
                        {recipe.info?.author === currentUser.uid && <Link className="share" to="./edit">Edit</Link>}
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
                                {recipe.info?.author === currentUser.uid && <Link className="share" to="./edit">Edit</Link>}
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
    const currentUser = useAuth();
    const params = useParams();
    const [loading, setLoading] = useState();
    const [error, setError] = useState();
    const [recipe, setRecipe] = useState();
    const [titles, setTitles] = useState({ title: "", subTitle: "" });
    const [info, setInfo] = useState([])
    const [ingredients, setIngredients] = useState([])
    const [prep, setPrep] = useState([])
    const [cook, setCook] = useState([])

    useEffect(() => {
        if (!currentUser) return

        setLoading(true)

        getRecipe(params.id)
            .then(res => {
                if (res === undefined) {
                    setError(404)
                    setLoading(false)
                    return
                }

                if (res.info.author !== currentUser.uid) {
                    setError(403)
                    setLoading(false)
                    return
                }

                setRecipe(res)
                setTitles({ title: res.about?.title, subTitle: res.about?.subTitle })
                setInfo(res.about?.information)
                setIngredients(res?.ingredients)
                setPrep(res.instructions?.prep)
                setCook(res.instructions?.cook)
                setLoading(false)
            })
    }, [params.id, currentUser])

    // Titles
    const handleTitlesTitleChange = (e) => {
        e.preventDefault();
        setTitles({ ...titles, title: e.target.value });
    };

    const handleTitlesSubTitleChange = (e) => {
        e.preventDefault();
        setTitles({ ...titles, subTitle: e.target.value });
    };

    // Information
    const handleInfoTitleChange = (e, index) => {
        e.preventDefault();
        const list = [...info];
        const obj = list[index]
        obj.title = e.target.value;
        list[index] = obj;
        setInfo(list);
    };

    const handleInfoSubTitleChange = (e, index) => {
        e.preventDefault();
        const list = [...info];
        const obj = list[index]
        obj.subTitle = e.target.value;
        list[index] = obj;
        setInfo(list);
    };

    const handleInfoRemove = (index) => {
        const list = [...info];
        list.splice(index, 1);
        setInfo(list);
    };

    const handleInfoAdd = (e) => {
        e.preventDefault();

        if (!info) { setInfo([""]) }
        if (info) { setInfo([...info, { title: "", url: "", imageURL: "" }]) };
    };

    // Ingredients
    const handleIngredientsChange = (e, index) => {
        e.preventDefault();
        const list = [...ingredients];
        list[index] = e.target.value;
        setIngredients(list);
    };

    const handleIngredientsRemove = (index) => {
        const list = [...ingredients];
        list.splice(index, 1);
        setIngredients(list);
    };

    const handleIngredientsAdd = (e) => {
        e.preventDefault();

        if (!ingredients) { setIngredients([""]) }
        if (ingredients) { setIngredients([...ingredients, ""]) };
    };

    // Prep
    const handlePrepChange = (e, index) => {
        e.preventDefault();
        const list = [...prep];
        list[index] = e.target.value;
        setPrep(list);
    };

    const handlePrepRemove = (index) => {
        const list = [...prep];
        list.splice(index, 1);
        setPrep(list);
    };

    const handlePrepAdd = (e) => {
        e.preventDefault();

        if (!prep) { setPrep([""]) }
        if (prep) { setPrep([...prep, ""]) };
    };

    // Cook
    const handleCookChange = (e, index) => {
        e.preventDefault();
        const list = [...cook];
        list[index] = e.target.value;
        setCook(list);
    };

    const handleCookRemove = (index) => {
        const list = [...cook];
        list.splice(index, 1);
        setCook(list);
    };

    const handleCookAdd = (e) => {
        e.preventDefault();

        if (!cook) { setCook([""]) }
        if (cook) { setCook([...cook, ""]) };
    };

    const saveAll = () => {
        updateRecipe({
            about: {
                title: titles.title,
                subTitle: titles.subTitle,
                information: info,
            },
            ingredients: ingredients,
            instructions: {
                prep: prep,
                cook: cook,
            },
            images: recipe.images,
            info: recipe.info,
        }, undefined, undefined, params.id, currentUser)
    }

    return <>
        {error === "403" && <div>Error 403</div>}
        {!loading && !error && <>
            <Helmet>
                <title>{"Edit " + titles.title + " | Rnaxan"}</title>
            </Helmet>
            <section className="recipe edit">
                <div className="container">
                    <div className="side">
                        <div className="side-item" id="about-edit">
                            <div className="info">
                                <span>About</span>
                            </div>
                            <ul>
                                <input type="text" name="item-title" id="item-title" placeholder="title" value={titles.title} onChange={(e) => handleTitlesTitleChange(e)} required autoComplete="off" />
                                <input type="text" name="item-title" id="item-title" placeholder="subtitle" value={titles.subTitle} onChange={(e) => handleTitlesSubTitleChange(e)} required autoComplete="off" />
                            </ul>
                        </div>
                        <div className="side-item" id="information-edit">
                            <div className="info">
                                <span>Information</span>
                            </div>
                            <ul>
                                {info && <>
                                    {info.map((item, index) => (
                                        <li key={index}>
                                            <div className="content-2">
                                                <input type="text" name={"item-title" + index} id={"item-title" + index} placeholder="title" value={item.title} onChange={(e) => handleInfoTitleChange(e, index)} required autoComplete="off" />
                                                <button onClick={() => handleInfoRemove(index)} type="remove"><span class="material-symbols-outlined">close</span></button>
                                            </div>
                                            <input type="text" name="link" id="link" placeholder="subtitle" value={item.subTitle} onChange={(e) => handleInfoSubTitleChange(e, index)} required autoComplete="off" />
                                        </li>
                                    ))}
                                </>}
                                <button onClick={handleInfoAdd} type="add">Add</button>
                            </ul>
                        </div>
                        <div className="side-item" id="ingredients-edit">
                            <div className="info">
                                <span>Ingredients</span>
                            </div>
                            <ul>
                                {ingredients && <>
                                    {ingredients.map((item, index) => (
                                        <li key={index}>
                                            <div className="content-2">
                                                <input type="text" name="item-title" id="item-title" placeholder="ingredient" value={item} onChange={(e) => handleIngredientsChange(e, index)} required autoComplete="off" />
                                                <button onClick={() => handleIngredientsRemove(index)} type="remove"><span class="material-symbols-outlined">close</span></button>
                                            </div>
                                        </li>
                                    ))}
                                </>}
                                <button onClick={handleIngredientsAdd} type="add">Add</button>
                            </ul>
                        </div>
                        <button className="share" onClick={() => { saveAll() }}>Save</button>
                    </div>
                    <div className="main">
                        <main>
                            <div className="mobile">
                                <div className="main-item" id="about-edit">
                                    <div className="info">
                                        <span>About</span>
                                    </div>
                                    <ul>
                                        <input type="text" name="item-title" id="item-title" placeholder="title" value={titles.title} onChange={(e) => handleTitlesTitleChange(e)} required autoComplete="off" />
                                        <input type="text" name="item-title" id="item-title" placeholder="subtitle" value={titles.subTitle} onChange={(e) => handleTitlesSubTitleChange(e)} required autoComplete="off" />
                                    </ul>
                                </div>
                                <div className="main-item" id="information-edit">
                                    <div className="info">
                                        <span>Information</span>
                                    </div>
                                    <ul>
                                        {info && <>
                                            {info.map((item, index) => (
                                                <li key={index}>
                                                    <div className="content-2">
                                                        <input type="text" name={"item-title" + index} id={"item-title" + index} placeholder="title" value={item.title} onChange={(e) => handleInfoTitleChange(e, index)} required autoComplete="off" />
                                                        <button onClick={() => handleInfoRemove(index)} type="remove"><span class="material-symbols-outlined">close</span></button>
                                                    </div>
                                                    <input type="text" name="link" id="link" placeholder="subtitle" value={item.subTitle} onChange={(e) => handleInfoSubTitleChange(e, index)} required autoComplete="off" />
                                                </li>
                                            ))}
                                        </>}
                                        <button onClick={handleInfoAdd} type="add">Add</button>
                                    </ul>
                                </div>
                                <div className="main-item" id="ingredients-edit">
                                    <div className="info">
                                        <span>Ingredients</span>
                                    </div>
                                    <ul>
                                        {ingredients && <>
                                            {ingredients.map((item, index) => (
                                                <li key={index}>
                                                    <div className="content-2">
                                                        <input type="text" name="item-title" id="item-title" placeholder="ingredient" value={item} onChange={(e) => handleIngredientsChange(e, index)} required autoComplete="off" />
                                                        <button onClick={() => handleIngredientsRemove(index)} type="remove"><span class="material-symbols-outlined">close</span></button>
                                                    </div>
                                                </li>
                                            ))}
                                        </>}
                                        <button onClick={handleIngredientsAdd} type="add">Add</button>
                                    </ul>
                                </div>
                            </div>
                            <div className="main-item" id="prep-edit">
                                <div className="info">
                                    <span>Prep</span>
                                </div>
                                <ul>
                                    {prep && <>
                                        {prep.map((item, index) => (
                                            <li key={index}>
                                                <div className="content-2">
                                                    <input type="text" name="item-title" id="item-title" placeholder={"step: " + index} value={item} onChange={(e) => handlePrepChange(e, index)} required autoComplete="off" />
                                                    <button onClick={() => handlePrepRemove(index)} type="remove"><span class="material-symbols-outlined">close</span></button>
                                                </div>
                                            </li>
                                        ))}
                                    </>}
                                    <button onClick={handlePrepAdd} type="add">Add</button>
                                </ul>
                            </div>
                            <div className="main-item" id="cook-edit">
                                <div className="info">
                                    <span>Cook</span>
                                </div>
                                <ul>
                                    {cook && <>
                                        {cook.map((item, index) => (
                                            <li key={index}>
                                                <div className="content-2">
                                                    <input type="text" name="item-title" id="item-title" placeholder={"step: " + index} value={item} onChange={(e) => handleCookChange(e, index)} required autoComplete="off" />
                                                    <button onClick={() => handleCookRemove(index)} type="remove"><span class="material-symbols-outlined">close</span></button>
                                                </div>
                                            </li>
                                        ))}
                                    </>}
                                    <button onClick={handleCookAdd} type="add">Add</button>
                                </ul>
                            </div>
                            <div className="mobile">
                                <button className="share" onClick={() => { saveAll() }}>Save</button>
                            </div>
                        </main>
                    </div>
                </div>
            </section>
        </>}
    </>
}