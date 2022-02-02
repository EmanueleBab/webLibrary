import "./LoginPage.css"

import backgroundImage from "assets/images/RegisterPage/RegisterBackground.jpg"
import { useState } from "react";

import InputBox from "./InputBox.js"

import axios from 'axios';

function LoginPage() {



    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
 

    const [emailCorrect, setEmailCorrect] = useState("0");
    const [passwordCorrect, setPasswordCorrect] = useState("0");

    /* empty character = "‏‏‎ ‎"*/
 
    const [emailErrorText, setEmailErrorText] = useState("‏‏‎ ‎");
    const [passwordErrorText, setPasswordErrorText] = useState("‏‏‎ ‎");


    function checkForm() {
        let correct = true;

        if (email) {
            setEmailCorrect("1");
            setEmailErrorText("‏‏‎ ‎");
        }
        else {
            setEmailCorrect("-1");
            setEmailErrorText("per favore, inserisci una email");
            correct = false;
        }
        if (password) {
            setPasswordCorrect("1");
            setPasswordErrorText("‏‏‎ ‎");
        }
        else {
            setPasswordCorrect("-1");
            setPasswordErrorText("per favore, inserisci una password");
            correct = false;
        }
        return correct;

    }

    function handleChange(evt) {
        checkForm();
    }
    function handleSubmit(evt) {
        if (checkForm()) {
            handleLogin()
        }
        evt.preventDefault();
    }


    function handleLogin(){ 
        const dataToSend = { username: email,password:password};
        axios.post('http://82.49.91.197:8000/token-auth/', dataToSend)
            .then(response => {console.log(response.data);                localStorage.setItem('token',response.data.token); window.location.replace("/books")
        })
            .catch(error => {
                console.error('There was an error!', error);        
                setPasswordCorrect("-1");
                setEmailCorrect("-1");
                setPasswordErrorText("username o password non validi");

              if(error.response.status == 500) {
      
              }
            })
     
    }



    return (
        <div className="RegisterBody">
            <img className="LoginBooksBackground" src={backgroundImage} alt="browser not supported" />
            <div className="LoginBooksBackgroundOpacity" />

            <div className="LoginForm">
                <div className="dontHaveAccountSection">
                    <text className= "dontHaveAccountText" >non hai un account?</text>
                    <button className="dontHaveAccountButton" onClick={()=>{window.location.href ="/Register";
}}>Registrati</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <InputBox correct={emailCorrect} changeValue={setEmail} inputType="text" backgroundText="Email" />
                    <div className="errorTextContainer">
                        <text className="errorText" numberOfLines={2}>{emailErrorText}</text>
                    </div>
                    <InputBox correct={passwordCorrect} changeValue={setPassword} inputType="password" backgroundText="Password" />
                    <div className="errorTextContainer">
                        <text className="errorText" numberOfLines={2}>{passwordErrorText}</text>
                    </div>
                    <text className="forgotPasswordText"><a href="http://82.49.91.197:8000/reset_password/">password dimenticata?</a></text>

                    <input className="submitButton" type="submit" value="Login" />
                </form>
            </div>
        </div>
    )
}





export default LoginPage;