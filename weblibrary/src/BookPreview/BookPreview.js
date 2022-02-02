import { useState, useEffect } from "react";
import axios from "axios";

import './BookPreview.css'
import { useParams } from "react-router";


function BookPreview() {

    const { id } = useParams()

    const [bookData, setBookData] = useState("");
    const [currentUser, setCurrentUser] = useState({})
    const [voteButtonText, setVoteButtonText] = useState("vota")
    const [pageLoaded, setPageLoaded] = useState(false)
    useEffect(() => {
        axios.get('http://82.49.91.197:8000/server/current_user/', { headers: { authorization: `JWT ${localStorage.getItem('token')}` } })
            .then(response => {
                setCurrentUser(response.data);
                console.log(response.data);
            })

            .catch(error => { console.log(error.data); window.location.href = "/login" })

        GetBook();

    }, []);

    useEffect(() => {
        if (pageLoaded) {
            GetVote()
        }
    });
    function DeleteBook() {
        axios.delete('http://82.49.91.197:8000/server/books/', { headers: { authorization: `JWT ${localStorage.getItem('token')}` }, params: { bookId: bookData.pk } }).then(response => {
            console.log(response.data);
            window.location.href = "/userProfile"
        })

            .catch(error => { console.log(error.data); window.location.href = "/login" })

    }

    function Vote() {
        if (voteButtonText != "votato") {
            axios.post('http://82.49.91.197:8000/server/rate/', null, { headers: { authorization: `JWT ${localStorage.getItem('token')}` }, params: { bookId: bookData.pk } })
                .then(response => {
                    console.log(response.data);
                    GetVote();
                    GetBook();
                })

                .catch(error => { console.log(error.data); })
        }
    }
    function GetVote() {
        setPageLoaded(false)
        axios.get('http://82.49.91.197:8000/server/rate/', { headers: { authorization: `JWT ${localStorage.getItem('token')}` }, params: { bookId: bookData.pk } })
            .then(response => {
                console.log(response.data);
                if (response.data == "0") {
                    setVoteButtonText("vota")
                }
                else {
                    setVoteButtonText("votato")

                }
            })

            .catch(error => { console.log(error.data); window.location.href = "/login" })

    }
    return (
        <div className="bookPreviewBody">

            <div className="bookPreviewHeader">
                <button className="bookPreviewHomeButton" onClick={() => { window.location.href = "/books/"; }}>Home</button>

            </div>
            <text className="bookPreviewtTitle">{bookData.title}</text>
            <text className="bookPreviewRatings">Stelle: {bookData.ratings}</text>
            <button className="bookPreviewVoteButton" onClick={() => { Vote() }}>{voteButtonText}</button>
            <text className="bookPreviewAuthor">Autore: <a href={`/books/${bookData.authorPk}`}>{bookData.author} </a></text>
            <text className="bookPreviewDescription">{bookData.description}</text>
            <img className="bookPreviewImage" src={'http://82.49.91.197:8000/media/' + bookData.imageFile} />
            <button className="bookPreviewReadButton" onClick={() => { window.location.href = `http://82.49.91.197:8000/media/${bookData.bookFile}`; }}>leggi</button>
            <button show={bookData.authorPk == currentUser.pk ? "1" : "0"} className="deleteBookButton" onClick={() => { DeleteBook() }}>cancella libro</button>

        </div>
    )


    function GetBook() {
        axios.get('http://82.49.91.197:8000/server/books/', { headers: { authorization: `JWT ${localStorage.getItem('token')}` }, params: { bookId: id } })
            .then(response => {
                response.data = response.data["0"]
                console.log(response.data)
                setBookData(response.data)
                setPageLoaded(true)
            })
            .catch(error => { console.log(error.data); window.location.href = "/login" })
    }


}



export default BookPreview;