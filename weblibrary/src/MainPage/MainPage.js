
import "./MainPage.css";

import logoImage from "assets/images/logo.png"
import backgroundImage from "assets/images/bookBackground.jpg"
import arrowImage from "assets/images/arrow.png"

import TextContainer from "./TextContainer/TextContainer.js";
import { useRef } from 'react';


function MainPage() {
    const myRef = useRef(null)

    const executeScroll = () => myRef.current.scrollIntoView({ behavior: "smooth" })

    return (
        <div className="MainPage">

            <opacity className={"screenOpacity"} />


            <header className="App-header">

                <img className="logo" src={logoImage} alt="browser not supported" />
                <button className="mainHasAccountButton" onClick={()=>{window.location.href ="/Login";}}>Login</button>
                <button className="mainDontHaveAccountButton" onClick={()=>{window.location.href ="/Register";}}>Register</button>

            </header>
            <img className="BooksBackground" src={backgroundImage} alt="browser not supported" />
            <text className="mainText">{"Spazio alla conoscenza senza spazio in libreria {temporaneo}"}</text>


            <downArrow className="downArrowBackground">
                <img className="downArrowArrow" src={arrowImage} alt={"><"} onClick={executeScroll} />
            </downArrow>
            <div ref={myRef} className="infoSection">
                <div className="mainPageSpacer " />


                <TextContainer text={"Leggi dove e quando vuoi! con webLibrary il tuo unico limite è il tempo, puoi accedere al nostro servizio ovunque sia disponibile una connessione ad internet."} imageSource={"https://motionarray.imgix.net/preview-129635-MvLy9QIQxx-high_0005.jpg"} />
                <div className="mainPageSpacer " />
                <TextContainer align={"left"} text={"Con webLibrary puoi reperire qualsiasi tipologia di libro dai best seller del momento ad una serie di libri esclusivi scritti dagli utenti, il tutto a meno del costo di un taglio di capelli."} imageSource={"https://i.pinimg.com/originals/97/d7/10/97d7108ff4492b2fc480b9b040ea5b6f.jpg "} />
                <div className="mainPageSpacer " />


            </div>
            <text className="mainPageBottomText"> convinto? allora unisciti a noi! </text>
                <div className="mainPageSpacer " />
            <button className="mainHasAccountButtonBottom" onClick={()=>{window.location.href ="/Login";}}>Login</button>
                <button className="mainDontHaveAccountButtonBottom" onClick={()=>{window.location.href ="/Register";}}>Register</button>

            <div className="mainPageFooter" />
        </div>
    );
}


export default MainPage;
