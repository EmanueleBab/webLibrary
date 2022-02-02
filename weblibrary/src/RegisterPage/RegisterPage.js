import "./RegisterPage.css"

import backgroundImage from "assets/images/RegisterPage/RegisterBackground.jpg"
import { useState } from "react";

import InputBox from "./InputBox.js"
import axios from 'axios';

function RegisterPage() {


    const [firstName, setName] = useState("");
    const [lastName, setlastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    const [eulaChecked, setEulaChecked] = useState(false);

    const [nameCorrect, setNameCorrect] = useState("0");
    const [lastNameCorrect, setlastNameCorrect] = useState("0");
    const [emailCorrect, setEmailCorrect] = useState("0");
    const [passwordCorrect, setPasswordCorrect] = useState("0");
    const [passwordCheckCorrect, setPasswordCheckCorrect] = useState("0");

    /* empty character = "‏‏‎ ‎"*/
    const [nameErrorText, setNameErrorText] = useState("‏‏‎ ‎");
    const [lastNameErrorText, setlastNameErrorText] = useState("‏‏‎ ‎");
    const [emailErrorText, setEmailErrorText] = useState("‏‏‎ ‎");
    const [passwordErrorText, setPasswordErrorText] = useState("‏‏‎ ‎");
    const [checkPasswordErrorText, setCheckPasswordErrorText] = useState("‏‏‎ ‎");
    const [eulaErrorText, setEulaErrorText] = useState("‏‏‎ ‎");

    /*regular expressions*/
    const reMail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const rePassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    function checkForm() {
        let correct = true;
        if (firstName) {
            setNameCorrect("1");
            setNameErrorText("‏‏‎ ‎");
        }
        else {
            setNameCorrect("-1");
            setNameErrorText("nome vuoto");
            correct = false;
        }
        if (lastName) {
            setlastNameCorrect("1");
            setlastNameErrorText("‏‏‎ ‎");
        }
        else {
            setlastNameCorrect("-1");
            setlastNameErrorText("cognome vuoto \n ");
            correct = false;


        }
        if (reMail.test(email)) {
            setEmailCorrect("1");
            setEmailErrorText("‏‏‎ ‎");
        }
        else {
            setEmailCorrect("-1");
            setEmailErrorText("formato email errato [esempio pizza@italy.it] \n ");
            correct = false;

        }
        if (rePassword.test(password)) {
            setPasswordCorrect("1");
            setPasswordErrorText("‏‏‎ ‎");
        }
        else {
            setPasswordCorrect("-1");
            setPasswordErrorText("formato password errato, deve contenere almeno 8 caratteri con 1 lettera 1 numero ed un carattere speciale [@$!%*#?&]");
            correct = false;

        }
        if (password == checkPassword && checkPassword) {
            setCheckPasswordErrorText("‏‏‎ ‎");
            setPasswordCheckCorrect("1");
        }
        else if (!checkPassword) {
            setPasswordCheckCorrect("-1");
            setCheckPasswordErrorText("per favore, conferma la tua password");
            correct = false;

        }
        else if (password != checkPassword) {
            setPasswordCheckCorrect("-1");
            setCheckPasswordErrorText("le password non corrispondono");
            correct = false;

        }
        if(!eulaChecked)
        {
            setEulaErrorText("per favore, leggi ed accetta i nostri termini di servizio ");
            
            correct = false;
        }
        else
        {
            setCheckPasswordErrorText("‏‏‎ ‎");

        }
        return correct;
    }


    function handleChange(evt)
     {
        checkForm();
    }
    function handleSubmit(evt) {
        if (checkForm()) {
            handleSignup({ firstName, lastName, email, password });
        }
        evt.preventDefault();
    }

    function handleEulaCheckBoxChange(evt) {
        setEulaChecked(evt.target.checked);
    }



    function handleSignup() {

        const dataToSend = { username: email,first_name:firstName,last_name:lastName,password:password};
        axios.post('http://82.49.91.197:8000/server/users/', dataToSend)
            .then(response => {console.log(response.data);                localStorage.setItem('token',response.data.token);  window.location.replace("/books");
        })
            .catch(error => {

              setEmailCorrect("-1");
              setEmailErrorText("this email is already taken\n ");
              
            })
     
    }


    return (
        <div className="RegisterBody">
            <img className="RegisterBooksBackground" src={backgroundImage} alt="browser not supported" />
            <div className="RegisterBooksBackgroundOpacity" />

            <div className="RegisterForm">
                <div className="hasAccountSection">
                    <text className="hasAccountText" >hai già un account?</text>
                    <button className="hasAccountButton" onClick={() => {
                        window.location.href = "/Login";;
                    }}>Login</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <InputBox correct={nameCorrect} changeValue={setName} inputType="text" backgroundText="first name" />
                    <div className="errorTextContainer">
                        <text className="errorText" numberOfLines={2}>{nameErrorText}</text>
                    </div>
                    <InputBox correct={lastNameCorrect} changeValue={setlastName} inputType="text" backgroundText="last name" />
                    <div className="errorTextContainer">
                        <text className="errorText" numberOfLines={2}>{lastNameErrorText}</text>
                    </div>
                    <InputBox correct={emailCorrect} changeValue={setEmail} inputType="text" backgroundText="Email" />
                    <div className="errorTextContainer">
                        <text className="errorText" numberOfLines={2}>{emailErrorText}</text>
                    </div>
                    <InputBox correct={passwordCorrect} changeValue={setPassword} inputType="password" backgroundText="Password" />
                    <div className="errorTextContainer">
                        <text className="errorText" numberOfLines={2}>{passwordErrorText}</text>
                    </div>
                    <InputBox correct={passwordCheckCorrect} changeValue={setCheckPassword} inputType="password" backgroundText="Repeat Password" />
                    <div className="errorTextContainer">
                        <text className="errorText" numberOfLines={2}>{checkPasswordErrorText}</text>
                    </div>
                    <input className="eulaCheckbox" type="checkbox" checked={eulaChecked} onChange={handleEulaCheckBoxChange} />
                    <text className="eulaText">accetto i <a href="">termini di servizio</a> e le <a href="">condizioni d'uso</a></text>
                    <div className="errorTextContainer">
                        <text className="errorText" numberOfLines={2}>{eulaErrorText}</text>
                    </div>
                    <input className="submitButton" type="submit" value="Register now" />
                </form>
            </div>
        </div>
    )
}





export default RegisterPage;