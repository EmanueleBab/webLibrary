import { useState, useEffect } from "react";
import InputBox from "./InputBox.js";

import axios from 'axios'
import './ProfilePage.css'

import BookDisplayElement from './BookDisplayElement.js'

function ProfilePage() {

    const [books, setBooks] = useState()

    const [editing, setEditing] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [checkPassword, setCheckPassword] = useState("")
    const [currentUser, setCurrentUser] = useState({})


    const [emailCorrect, setEmailCorrect] = useState("")
    const [passwordCorrect, setPasswordCorrect] = useState("")
    const [checkPasswordCorrect, setCheckPasswordCorrect] = useState("")


    const [emailErrorText, setEmailErrorText] = useState("‏‏‎ ‎");
    const [passwordErrorText, setPasswordErrorText] = useState("‏‏‎ ‎");
    const [passwordCheckErrorText, setPasswordCheckErrorText] = useState("‏‏‎ ‎");

    const [pageLoaded,setPageLoaded] = useState(false);

    const reMail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const rePassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    function handleSubmit(evt) {
        evt.preventDefault();
        let correct = true
        if (password && rePassword.test(password) && password == checkPassword) {
            setPasswordCorrect("1");
            setPasswordErrorText("‏‏‎ ‎");

        }
        else if (password && password != checkPassword) {
            setCheckPasswordCorrect("-1");
            setPasswordCheckErrorText("please, confirm your password");
            correct = false;
        }
        else if (password) {
            setPasswordCorrect("-1");
            setPasswordErrorText("wrong password format it must contain  eight characters, 1 letter 1 number and 1 special character [@$!%*#?&]");
        }
        if (password && !checkPassword) {
            setCheckPasswordCorrect("-1")
            correct = false;
        }
        if (email && reMail.test(email)) {
            setEmailCorrect("1")
            setEmailErrorText("‏‏‎ ‎")

        }
        else if (email) {
            setEmailCorrect("-1")
            setEmailErrorText("wrong email format [example pizza@italy.it] \n ");
            correct = false;


        }
        if (correct) {
            let data = { email: email, firstName: firstName, lastName: lastName, password, password }
            axios.patch('http://82.49.91.197:8000/server/users/', data, { headers: { authorization: `JWT ${localStorage.getItem('token')}` } })
                .then(response => {
                    setEditing(false);
                    console.log(response.data);
                    window.location.href = "/login"
                })

                .catch(error => {
                    console.log(error.response);
                    if (error.response == "password") {
                        setPasswordErrorText("invalid password")
                    }
                    else {
                        setEmailErrorText("invalid email")

                    }

                }
                )

        }
    }

    useEffect(() => {
        axios.get('http://82.49.91.197:8000/server/current_user/', { headers: { authorization: `JWT ${localStorage.getItem('token')}` } })
            .then(response => {
                setCurrentUser(response.data);
                console.log(response.data);
                setPageLoaded(true)
            })

            .catch(error => { console.log(error.data); window.location.href = "/login" })

    }, []);
    useEffect(() => {
        if(pageLoaded)
        {
       FetchBooks()
        }
    });
    function BookList(prop) {
        let render = []
        let key = 0;
        for (let p in prop.books) {
            render.push(<BookDisplayElement pk={prop.books[key]["pk"]} author={prop.books[key]["author"]} title={prop.books[key]["title"]} ratings={prop.books[key]["ratings"]} imageFile={prop.books[key]["imageFile"]} key={key} />);
            key++;
        }
        return render;

    }

    function FetchBooks() {
        setPageLoaded(false)

        axios.get('http://82.49.91.197:8000/server/books/', { headers: { authorization: `JWT ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }, params: {    authorPk: currentUser.pk  } })
            .then(response => {
                let data = []
                let counter = 0;
                for (let d in response.data) {
                    console.log(response.data[`${counter}`])
                    data.push(response.data[`${counter}`]);
                    counter++
                }
                setBooks(data);

            })
            .catch(error => { console.log(error.data); })
    }


    return (
        <div className="profilePageBody">
            <div className="profilePageHeader">
                <button className="profilePageHomeButton" onClick={() => { window.location.href = "/books" }}>home </button>
            </div>
            <div show={editing ? "1" : "0"} className="editForm" >
                <form onSubmit={handleSubmit}>
                    <InputBox changeValue={setFirstName} inputType="text" backgroundText="nome"></InputBox>
                    <InputBox changeValue={setLastName} inputType="text" backgroundText="cognome"></InputBox>
                    <InputBox correct={emailCorrect} changeValue={setEmail} inputType="text" backgroundText="email"></InputBox>
                    <div className="errorTextContainer">
                        <text className="errorText" numberOfLines={2}>{emailErrorText}</text>
                    </div>
                    <InputBox correct={passwordCorrect} changeValue={setPassword} backgroundText="nuova password" inputType="password" />
                    <div className="errorTextContainer">
                        <text className="errorText" numberOfLines={2}>{passwordErrorText}</text>
                    </div>
                    <InputBox correct={checkPasswordCorrect} changeValue={setCheckPassword} backgroundText="conferma nuova password" inputType="password" />
                    <div className="errorTextContainer">
                        <text className="errorText" numberOfLines={2}>{passwordCheckErrorText}</text>
                    </div>

                    <input type="submit" className="profilePageSaveButton" value="Salva"></input>

                </form>
                <button className="ProfilePageChangeUndo" onClick={() => { setEditing(!editing); }}>Annulla</button>
            </div>
            <div show={editing ? "0" : "1"} className="dataForm">
                <text className="profilePageText">Nome {currentUser.first_name} </text>
                <text className="profilePageText">Cognome {currentUser.last_name} </text>
                <text className="profilePageText">email {currentUser.username}</text>
                <button show={editing ? "1" : "0"} className="profilePageChangePasswordButton" onClick={() => { setEditing(!editing); }}>Modifica profilo</button>
                <button className="profilePageNewBook" onClick={() => { window.location.href = 'newBook' }}>Nuovo libro</button>

                <text className="profilePageBooksText">i tuoi libri</text>
                <div className="profilePageBooksContainer">
                    <BookList books={books} />
                </div>
            </div>
        </div>
    )
}




export default ProfilePage;