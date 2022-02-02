import './BooksPage.css'
import { useState,useEffect } from "react";

function BookDisplayElement(prop) {
  
    return (
        <div className="bookDisplayElement" onClick={()=>window.location.href = `/bookPreview/${prop.pk}`  }>
        <text className="bookDisplayTitle">{prop.title}</text>    
        <img className="bookDisplayImage" src={'http://82.49.91.197:8000/media/' + prop.imageFile} />
        <text className="bookDisplayRating">{ "stelle: " + prop.ratings}</text>

        </div>



    )
}



export default BookDisplayElement;