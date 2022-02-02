import "./TextContainer.css";


/*props= text and imageSource */
function TextContainer(prop) {

    if (prop.align === "left") {
        return (
            <div className="textContainer">

                <div className="spacer" />
                <img className="textContainerImage Left" src={prop.imageSource} alt="browser not supported " />
                <text className="textContainerText Left">{prop.text}</text>


            </div>
        );
    }
    else
    {
        return (
            <div className="textContainer">

                <div className="spacer" />
                <img className="textContainerImage Right" src={prop.imageSource} alt="browser not supported " />
                <text className="textContainerText Right">{prop.text}</text>


            </div>
        );
    }
}

export default TextContainer;
