import { useEffect, useState } from "react"
import { getUserInfo, getUsersRecipesInfiniteScroller, useAuth } from "../firebase"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import remarkGfm from 'remark-gfm'
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import "../style/pages/user/view.css"
import "../style/pages/user/view-markdown.css"
import InfiniteScroll from "react-infinite-scroller";

export function UserIndex() {
    const currentUser = useAuth(null);
    const [redirect, setRedirect] = useState(false);
    const [loading, setLoading] = useState();
    const [user, setUser] = useState({});
    const [date, setDate] = useState({});

    const [lastKey, setLastKey] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [hasMoreToLoad, setHasMoreToLoad] = useState(true);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        if (currentUser === null) setRedirect(true)
    }, [currentUser])

    useEffect(() => {
        if (!currentUser) return
        setLoading(true)

        getUserInfo(currentUser.uid)
            .then(res => {
                setUser(res)
                setDate(new Date(Number(res.info.joined)))

                setLoading(false)
            })
    }, [currentUser])

    const fetchRecipes = () => {
        if (!currentUser) return
        if (fetching) return

        setFetching(true);

        getUsersRecipesInfiniteScroller(currentUser.uid, lastKey)
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

    return <>
        {!currentUser && redirect && <Navigate to="/account/login" />}
        {currentUser && <>
            {!loading && <>
                <Helmet>
                    <title>{user.about?.firstname + " " + user.about?.lastname + " | " + user.about?.displayname + " | Rnaxan User"}</title>
                </Helmet>
                <section className="user">
                    <div className="container">
                        <div className="side">
                            <div className="side-item" id="user">
                                <div className="info">
                                    <span>User</span>
                                </div>
                                <div className="about">
                                    <img src={user.images?.photoURL} alt="" />
                                    <div>
                                        <span className="name">{user.about?.firstname} {user.about?.lastname}</span>
                                        <span>{user.about?.displayname}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="side-item" id="information">
                                <div className="info">
                                    <span>Information</span>
                                </div>
                                <ul>
                                    {user.info?.gender && <li>
                                        <span className="title">Gender</span>
                                        <span className="subTitle">{user.info?.gender}</span>
                                    </li>}
                                    {user.info?.joined && <li>
                                        <span className="title">Joined</span>
                                        <span className="subTitle">{new Intl.DateTimeFormat("en-US", { month: "short" }).format(date)}. {date.getDate()}, {date.getFullYear()}</span>
                                    </li>}
                                    {user.info?.location && <li>
                                        <span className="title">Location</span>
                                        <span className="subTitle">{user.info?.location}</span>
                                    </li>}
                                    {user.info?.pronouns && <li>
                                        <span className="title">Pronouns</span>
                                        <span className="subTitle">{user.info?.pronouns}</span>
                                    </li>}
                                </ul>
                            </div>
                            {user.links && <div className="side-item" id="links">
                                <div className="info">
                                    <span>Links</span>
                                </div>
                                <ul>
                                    {user.links?.map((link, index) => {
                                        if (link.includes("https://") || link.includes("http://")) {
                                            return <li key={index}>
                                                <a href={link}>
                                                    <img src={"https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" + link + "/post&size=64"} alt="" />
                                                </a>
                                            </li>
                                        }
                                        if (!link.includes("https://") && !link.includes("http://")) {
                                            return <li key={index}>
                                                <a href={"https://" + link}>
                                                    <img src={"https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://" + link + "/post&size=64"} alt="" />
                                                </a>
                                            </li>
                                        }
                                        return <></>
                                    })}
                                </ul>
                            </div>}
                            {user.about?.statement && <div className="side-item" id="statement">
                                <div className="info">
                                    <span>Statement</span>
                                </div>
                                <div className="about">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} >
                                        {user.about?.statement}
                                    </ReactMarkdown>
                                </div>
                            </div>}
                            <a href={"https://acron.xcwalker.dev/user/" + currentUser?.uid + "/edit"} className="edit">Edit On Acron</a>
                            <Link to="/recipe/new" className="edit">New Recipe</Link>
                        </div>
                        <div className="main">
                            <header>
                                <img src={user.images?.headerURL} alt="" />
                                <div className="container">
                                    <div className="info">
                                        <span>{user.about?.displayname}</span>
                                        <span>User</span>
                                    </div>
                                </div>
                                <div className="alt-container">
                                    <div className="about">
                                        <span>{user.about?.firstname} {user.about?.lastname}</span>
                                    </div>
                                </div>
                            </header>
                            <main>
                                <div className="container">
                                    <div className="mobile">
                                        <div className="main-item" id="user">
                                            <div className="info">
                                                <span>User</span>
                                            </div>
                                            <div className="about">
                                                <img src={user.images?.photoURL} alt="" />
                                                <div>
                                                    <span className="name">{user.about?.firstname} {user.about?.lastname}</span>
                                                    <span>{user.about?.displayname}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="main-item" id="information">
                                            <div className="info">
                                                <span>Information</span>
                                            </div>
                                            <ul>
                                                {user.info?.gender && <li>
                                                    <span className="title">Gender</span>
                                                    <span className="subTitle">{user.info?.gender}</span>
                                                </li>}
                                                {user.info?.joined && <li>
                                                    <span className="title">Joined</span>
                                                    <span className="subTitle">{new Intl.DateTimeFormat("en-US", { month: "short" }).format(date)}. {date.getDate()}, {date.getFullYear()}</span>
                                                </li>}
                                                {user.info?.location && <li>
                                                    <span className="title">Location</span>
                                                    <span className="subTitle">{user.info?.location}</span>
                                                </li>}
                                                {user.info?.pronouns && <li>
                                                    <span className="title">Pronouns</span>
                                                    <span className="subTitle">{user.info?.pronouns}</span>
                                                </li>}
                                            </ul>
                                        </div>
                                        <div className="main-item" id="links">
                                            <div className="info">
                                                <span>Links</span>
                                            </div>
                                            <ul>
                                                {user.links?.map((link, index) => {
                                                    if (link.includes("https://") || link.includes("http://")) {
                                                        return <li key={index}>
                                                            <a href={link}>
                                                                <img src={"https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" + link + "/post&size=64"} alt="" />
                                                            </a>
                                                        </li>
                                                    }
                                                    if (!link.includes("https://") && !link.includes("http://")) {
                                                        return <li key={index}>
                                                            <a href={"https://" + link}>
                                                                <img src={"https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://" + link + "/post&size=64"} alt="" />
                                                            </a>
                                                        </li>
                                                    }
                                                    return <></>
                                                })}
                                            </ul>
                                        </div>
                                        {user.about?.statement && <div className="main-item" id="statement">
                                            <div className="info">
                                                <span>Statement</span>
                                            </div>
                                            <div className="about">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {user.about?.statement}
                                                </ReactMarkdown>
                                            </div>
                                        </div>}
                                        <a href={"https://acron.xcwalker.dev/user/" + currentUser?.uid + "/edit"} className="edit">Edit On Acron</a>
                                    </div>
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
                                        {recipes.length === 0 && <div className="no-results">
                                            <Link to="/recipe/new" className="edit">New Recipe</Link>
                                        </div>}
                                    </InfiniteScroll>
                                </div>
                            </main>
                            <footer></footer>
                        </div>
                    </div>
                </section>
            </>}
        </>}
    </>
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

    return <Link key={props.index} to={"/recipe/" + props.recipe.id}>
        <div className="info">
            <span>{props.recipe.data.about.subTitle}</span>
            <span>{new Intl.DateTimeFormat("en-US", { month: "short" }).format(date)}. {date.getDate()}, {date.getFullYear()}</span>
        </div>
        <div className="image">
            <img src={props.recipe.data.images.main} alt="" />
        </div>
        <div className="about">
            <span className="title" title={props.recipe.data.about.title}>{props.recipe.data.about.title}</span>
            {author && <span className="author">{author?.about.firstname} {author?.about.lastname}</span>}
        </div>
    </Link>
}

export function UserID() {
    return <>
        <h2>Recipes (UserID)</h2>
    </>
}

export function UserEdit() {
    const currentUser = useAuth();

    return <>
        {currentUser && <Navigate to={"https://acron.xcwalker.dev/user/" + currentUser?.uid + "/edit"} />}
    </>
}