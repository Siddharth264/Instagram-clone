import React, {useState} from 'react';
import { Button } from '@material-ui/core';
import {db, storage} from './firebase';
import firebase from "firebase";
import './ImageUpload.css';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState("");

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }

    };

    const handleUpload =() => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                .ref("images")
                .child(image.name) 
                .getDownloadURL()
                .then(url => {
                    //post image inside db
                    db.collection('posts').add({
                        timestamp : firebase.firestore.FieldValue.serverTimestamp(),
                        caption : caption,
                        imageUrl : url,
                        username : username
                    });
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                    
                })           
            }
        )
    }


    const useStyles = makeStyles((theme) => ({
        button: {
          margin: theme.spacing(1),
        },
      }));
      
    const classes = useStyles();
    
    return (
        <div className="imageupload">
            <div className="Upload">
                <h1>Create A Post</h1>
            </div>

            <progress className="imageupload__progressBar" value={progress} max="100" />
            <input className="imageupload__text" type="text" placeholder="Enter a caption..." value={caption} onChange={event => setCaption(event.target.value)}/>
            <input className="imageupload__file" type="file" onChange={handleChange}  />
            <Button
            onClick={handleUpload}
            disabled={!caption}
            variant="contained"
            color="default"
            className={classes.button}
            startIcon={<CloudUploadIcon />}
            >Upload</Button>
        </div>
    )
}

export default ImageUpload
