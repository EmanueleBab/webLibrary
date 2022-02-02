import React from "react";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

//home page
import MainPage from "./MainPage/MainPage.js"
//register page
import RegisterPage from "./RegisterPage/RegisterPage.js"
import LoginPage from "./LoginPage/LoginPage.js";
import BooksPage from "./BooksPage/BooksPage.js"
import BookPreview from "./BookPreview/BookPreview.js"

import NewBookPage from "./NewBookPage/NewBookPage.js"

import ProfilePage from "./ProfilePage/ProfilePage.js"
function App() {
    return (
        <Router>

        <Switch>
        <Route path="/" component={MainPage} exact/>
        <Route path="/Register" component={RegisterPage} exact/>
        <Route path="/Login" component={LoginPage} exact/>
        <Route path="/books/" component={BooksPage} exact/>
        <Route path="/books/:id" component={BooksPage} exact/>
        <Route path="/bookPreview/:id" component={BookPreview} exact/>
        <Route path="/newBook/" component={NewBookPage} exact/>
        <Route path="/userProfile" component={ProfilePage} exact/>
        <Route component={MainPage} exact/>
        </Switch>
        </Router>

    )
}




export default App;