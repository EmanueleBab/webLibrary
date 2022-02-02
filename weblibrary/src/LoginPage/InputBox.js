import { useState } from "react";
import "./LoginPage.css"

//props = inputType backgroundText
function InputBox(props) {

        const [data,changeData] = useState("");
    const [nameBoxHovered,setNameBoxHovered] = useState(0);
   // const [nameBoxCorrect,setNameBoxCorrect] = useState('0');


    function setValue(value) {
        changeData(value)
        props.changeValue(value);
    }


    function checkUnhover() {
        if(data ==""){
            setNameBoxHovered(0)
        }
    }
    return (
        <div className="FormElement" correct={props.correct}>
            <div className="FormBackground" hovered={nameBoxHovered}>{props.backgroundText}</div>
        <input
            className="InputBox"
            type={props.inputType}
            value={data}
            onChange={e => setValue(e.target.value)}
            maxLength="50"
            onFocus={()=>setNameBoxHovered(1)}
            onBlur={()=>checkUnhover()}      
            
        />
    </div>

    );
}



export default InputBox;