import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AboutFaq, AboutIndex } from "./pages/AboutPages";
import { AccountForgot, AccountIndex, AccountLogin, AccountRegister } from "./pages/AccountPages";
import { DefaultHomepage } from "./pages/Homepages";
import { RecipeEdit, RecipeIndex, RecipeNew, RecipeView } from "./pages/RecipePages";
import { RecipesIndex, RecipesSearch, RecipesUser, RecipesUserID } from "./pages/RecipesPages";

function App() {
  return (
    <BrowserRouter>
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
        <Route path="recipes">
          <Route index element={<RecipesIndex />} />
          <Route path="search" element={<RecipesSearch />} />
          <Route path="user">
            <Route index element={<RecipesUser />} />
            <Route path=":uid" element={<RecipesUserID />} />
          </Route>
        </Route>

        {/* Handle Users */}
        <Route path="account">
          <Route index element={<AccountIndex />} />
          <Route path="login" element={<AccountLogin />} />
          <Route path="register" element={<AccountRegister />} />
          <Route path="forgot" element={<AccountForgot />} />
        </Route>

        {/* About */}
        <Route path="about">
          <Route index element={<AboutIndex />} />
          <Route path="faq" element={<AboutFaq />} />
          <Route path="contact" element={<AboutFaq />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
