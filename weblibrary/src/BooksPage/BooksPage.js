import axios from "axios";
import { useState, useEffect } from "react";

import './BooksPage.css'

import BookDisplayElement from './BookDisplayElement.js'
import { useParams } from "react-router";
import { useLocation, useHistory } from 'react-router-dom';

function BooksPage() {

    const { id = "" } = useParams()
    const [querySearched, setQuerySearched] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [books, setBooks] = useState([]);

    const [categories, setCategories] = useState([]);
    const [selectorValue, setSelectorValue] = useState("");

    const [searchTypeValue, setSearchTypeValue] = useState("")
    const [searchBarTile, setSearchBarTitle] = useState("");

    const [MainPageTextValue, setMainPageTextValue] = useState("top 10 best sellers");



    useEffect(() => {
        if (id != "") {
            setSearchTypeValue("1");
        }
        
        if (searchBarTile == "" && selectorValue == "") {
            setMainPageTextValue("top 10 best sellers");
        }
        else if (searchBarTile != "" && selectorValue != "") {
            setMainPageTextValue(`risultati di ricerca per "${searchBarTile}" nella categoria "${selectorValue}"`);
            
        }
        else if (searchBarTile == "") {
            setMainPageTextValue(`risultati di ricerca nella categoria "${selectorValue}"`);
            
        }
        else {
            setMainPageTextValue(`risultati di ricerca per "${searchBarTile}"`);
            
        }
        if (id != "" && searchBarTile == ""&& selectorValue=="1") {
            setMainPageTextValue(`pagina autore`);
        }
        FetchCategories();
        FetchBooks();
        axios.get('http://82.49.91.197:8000/server/current_user/', { headers: { authorization: `JWT ${localStorage.getItem('token')}` } })
            .then(response => {
                setLoggedIn(true); console.log(response.data); setFirstName(response.data.first_name); setLastName(response.data.last_name); console.log(localStorage.getItem('token')); FetchBooks();
            })
            .catch(error => { console.log(error.data); window.location.href = "/login" })
    }, []);

    function HandleSubmit(evt) {
        evt.preventDefault();
        FetchBooks();
    }

    function FetchBooks() {

        console.log(querySearched)
        axios.get('http://82.49.91.197:8000/server/books/', { headers: { authorization: `JWT ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }, params: { title: (id != null && !querySearched) ? id : searchBarTile, category: selectorValue, authorPk: (id != null && !querySearched) ? id : "", authorId: searchTypeValue } })
            .then(response => {
                setQuerySearched(true)
                console.log(response.data["0"])
                let data = []
                let counter = 0;
                for (let d in response.data) {
                    data.push(response.data[`${counter}`]);
                    counter++
                }
                setBooks(data);

                if (searchBarTile == "" && selectorValue == "") {
                    setMainPageTextValue("top 10 best sellers");
                }
                else if (searchBarTile != "" && selectorValue != "") {
                    setMainPageTextValue(`risultati di ricerca per "${searchBarTile}" nella categoria "${selectorValue}"`);

                }
                else if (searchBarTile == "") {
                    setMainPageTextValue(`risultati di ricerca nella categoria "${selectorValue}"`);

                }
                else {
                    setMainPageTextValue(`risultati di ricerca per "${searchBarTile}"`);

                }
                if (id != "" && searchBarTile == ""&& selectorValue=="1") {
                    setMainPageTextValue(`pagina autore`);
                }
            })
            .catch(error => { console.log(error.data); })
    }

    function FetchCategories() {




        axios.get('http://82.49.91.197:8000/server/categories/', { headers: { authorization: `JWT ${localStorage.getItem('token')}` } })
            .then(response => {

                console.log(response.data["0"])
                let data = []
                let counter = 0;
                for (let d in response.data) {
                    data.push(response.data[`${counter}`]);
                    counter++
                }
                setCategories(data);

            })
            .catch(error => { console.log(error.data); })
    }

    function BookList(prop) {
        let render = []
        let key = 0;
        for (let p in prop.books) {
            render.push(<BookDisplayElement pk={prop.books[key]["pk"]} author={prop.books[key]["author"]} title={prop.books[key]["title"]} ratings={prop.books[key]["ratings"]} imageFile={prop.books[key]["imageFile"]} key={key} />);
            key++;
        }
        return render;

    }

    function CategoriesList(prop) {
        let render = []
        let key = 0;
        console.log(prop.categories)
        for (let p in prop.categories) {
            render.push(<option key={key} value={prop.categories[key]["categoryName"]}  > {prop.categories[key]["categoryName"]} </option>);
            key++;
        }

        return render;
    }



    return (
        <div className="booksPageBody">
            <header className="booksPageHeader">
                <form onSubmit={HandleSubmit}>
                    <input className="searchBar" onChange={e => setSearchBarTitle(e.target.value)} inputType="text" placeholder="search..." />
                    <select className="selector" onClick={FetchBooks} value={selectorValue} onChange={e => { e.preventDefault(); setSelectorValue(e.target.value); }}>
                        <option value=""  > Tutto</option>
                        <CategoriesList categories={categories} />
                    </select>
                    <select className="searchTypeSelector" onClick={FetchBooks} value={searchTypeValue} onChange={e => { e.preventDefault(); setSearchTypeValue(e.target.value); }}>
                        <option value=""  >book</option>
                        <option value="1"  >author</option>
                    </select>
                </form>
                <div className="accountButton" onClick={() => window.location.href = "/userProfile"}>
                    <text className="accountName">{firstName.substring(0, 17) + (firstName.length > 17 ? "..." : "")}</text>
                </div>
            </header>
            <text className="booksPageText">{MainPageTextValue}</text>
            <div className="booksContainer">
                <BookList books={books} />

            </div>

        </div>




    )
}



export default BooksPage;