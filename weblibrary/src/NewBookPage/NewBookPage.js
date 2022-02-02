import { useState, useEffect } from "react";

import axios from 'axios';
import './NewBookPage.css'

import InputBox from './InputBox.js'
function NewBookPage() {

    const [currentUser,setCurrentUser] = useState()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [selectorValue, setSelectorValue] = useState("")

    const [categories, setCategories] = useState()
    const [titleCorrect, setTitleCorrect] = useState("0")
    const [file, setFile] = useState()
    const [imageFile, setImageFile] = useState()

    const [fileCorrect, setFileCorrect] = useState()
    const [imageCorrect, setImageCorrect] = useState()
    
    useEffect(() => {
        axios.get('http://82.49.91.197:8000/server/current_user/', { headers: { authorization: `JWT ${localStorage.getItem('token')}` } })
        .then(response => {
            setCurrentUser(response.data)
            })
            
            .catch(error => { console.log(error.data); window.location.href = "/login" })
            FetchCategories();
            
        }, []);
        
        function FetchCategories() {
            axios.get('http://82.49.91.197:8000/server/categories/', { headers: { authorization: `JWT ${localStorage.getItem('token')}` } })
            .then(response => {

                let data = []
                let counter = 0;
                for (let d in response.data) {
                    data.push(response.data[`${counter}`]);
                    counter++
                }
                setCategories(data);

            })
            .catch(error => { console.log(error.data); window.location.href = "/login" })
    }

    function CategoriesList(prop) {
        let render = []
        let key = 0;
        for (let p in prop.categories) {
            render.push(<option key={key} value={prop.categories[key]["categoryName"]}  > {prop.categories[key]["categoryName"]} </option>);
            key++;
        }

        return render;
    }

    const changeHandler = (event) => {
        setFile(event.target.files[0]);
    };
    const changeHandlerImage = (event) => {
        setImageFile(event.target.files[0]);
    };
    function handleSubmit(evt) {
        let wrong = false;
        let data = { title: title, description: description, category: selectorValue, bookFile: file, imageFile: imageFile }
        var form_data = new FormData();
        for (var key in data) {
            form_data.append(key, data[key]);
        }
        if (file == null) {
            setFileCorrect("-1");
            wrong = true;

        }
        else {
            setFileCorrect("1");

        }
        
        if (imageFile == null) {
            setImageCorrect("-1");
            wrong = true;
        }
        else {
            setImageCorrect("1");

        }
        if (title == "") {
            setTitleCorrect("-1")
            wrong = true;
       
        }
        else {
            setTitleCorrect("1")

        }
        if(!wrong) {
        axios.post('http://82.49.91.197:8000/server/books/', form_data, { headers: { authorization: `JWT ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' } })
            .then(response => {

                console.log(response.data)
                window.location.href = `/userProfile` 
            })
            .catch(error => { console.log(error); })
        }
        evt.preventDefault();
    }



    return (
        <div className="newBookPageBody">
            <div className="newBookPageHeader">
                <button className="newBookHomeButton" onClick={() => { window.location.href = "/books" }}>home </button>
                <text className="newBookHeaderText">pubblica un nuovo libro</text>
            </div>
            <form onSubmit={handleSubmit} className="newBookPageForm" encType="multipart/form-data">
                <InputBox correct={titleCorrect} changeValue={setTitle} type="text" backgroundText="titolo"></InputBox>
                <text className="newBookCategoryText">seleziona categoria</text>
                <select className="newBookPageSelector" value={selectorValue} onChange={e => { e.preventDefault(); setSelectorValue(e.target.value); }}>
                    <CategoriesList categories={categories} />
                </select>
                <text className="newBookDescriptionText">descrizione</text>
                <textarea className="newBookPageDescriptionBox" onChange={e => { setDescription(e.target.value) }} type="textarea" maxLength={2000} ></textarea>
                <input className="newBookFileUploader" type="file" name="file" onChange={changeHandler} accept=".pdf" />
                <text correct={fileCorrect} className="NBuploadFileText">seleziona un documento in formato pdf da caricare</text>
                <input className="newBookFileUploaderImage" name="newBookFileUploaderImage" type="file" name="file" onChange={changeHandlerImage} accept="image/*" />
                <text correct={imageCorrect} className="NBuploadFileImage">seleziona un immagine copertina da caricare</text>
                <input className="newBookSubmitButton" type="submit" value="publish" />

            </form>
        </div>
    )

}



export default NewBookPage;