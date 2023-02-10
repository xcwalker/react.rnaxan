import { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Footer } from "./components/footer";
import { Loading } from "./components/loading";
import { Header } from "./components/header";
import { AboutIndex, AboutFaq } from "./pages/AboutPages";
import { AccountForgot, AccountIndex, AccountInfo, AccountLogin, AccountManage, AccountRegister } from "./pages/AccountPages";
import { DefaultHomepage } from "./pages/Homepages";
import { RecipeIndex, RecipeEdit, RecipeNew, RecipeView } from "./pages/RecipePages";
import { UserID, UserIndex } from "./pages/UserPages";
import { Search } from "./pages/Search";
import { Archive } from "./pages/Archive";

import "./style/defaults/variables.css"
import "./style/defaults/page-setup.css"
import "./style/defaults/transitions.css"

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <main>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<DefaultHomepage />} />

            {/* View / Create / Edit (Single Recipe) */}
            <Route path="recipe">
              <Route index element={<RecipeIndex />} />
              <Route path="new" element={<RecipeNew />} />
              <Route path=":id">
                <Route index element={<RecipeView />} />
                <Route path="edit" element={<RecipeEdit />} />
              </Route>
            </Route>

            {/* View (Multiple Recipes) */}
            <Route path="user">
              <Route index element={<UserIndex />} />
              <Route path=":uid" element={<UserID />} />
            </Route>

            {/* Handle Users */}
            <Route path="account">
              <Route index element={<AccountIndex />} />
              <Route path="login" element={<AccountLogin />} />
              <Route path="register" element={<AccountRegister />} />
              <Route path="forgot" element={<AccountForgot />} />
              <Route path="info" element={<AccountInfo />} />
              <Route path="manage" element={<AccountManage />} />
            </Route>

            {/* About */}
            <Route path="about">
              <Route index element={<AboutIndex />} />
              <Route path="faq" element={<AboutFaq />} />
              <Route path="contact" element={<AboutFaq />} />
            </Route>

            {/* Other */}
            <Route path="search" element={<Search />} />
            <Route path="archive" element={<Archive />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default App;