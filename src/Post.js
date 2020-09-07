import React, { useState, useEffect} from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from "firebase";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';




function Post({ postId, user,  username, caption, imageUrl}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe=db
            .collection('posts')
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }
        
        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text : comment,
            username : user.displayName,
            timestamp : firebase.firestore.FieldValue.serverTimestamp()
        })

        setComment("");
    }

    const deletePost = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).delete();
       }

    

    const useStyles = makeStyles((theme) => ({
        paper: {
          position: 'absolute',
          width: 400,
          backgroundColor: theme.palette.background.paper,
          border: '2px solid #000',
          boxShadow: theme.shadows[5],
          padding: theme.spacing(2, 4, 3),
          marginLeft: '200px',
          marginTop : '200px',
        },
      }));
    
      const classes = useStyles();
    
    return (
        <div className="post">
            <div className="post__header">
                <div className="avatarUsername">
                    <Avatar className="post__Avatar"
                            alt={username} 
                            src="/static/images/avatar/1.jpg" 
                    />

                    <h3 className="username_text">{username}</h3>

            {/* header -> avatar + username*/}
                </div>
                    <div className="deletebutton">
                        <Button disabled={user.displayName!==username} variant="contained" color="secondary" className={classes.button} onClick={deletePost} startIcon={<DeleteIcon />}>Delete</Button>
                    </div>
                </div>

            <img className="post__Image" src={imageUrl} alt="Jst-a-random-pic" />
            {/* image  */}
            <h4 className="post__Text"><strong> {username} : </strong> {caption} </h4>
            {/* username + caption*/}
            <div className="post__comments">
                {comments.map((comment) => (
                    <div className="commentStyle">
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                    </div>              
                ))}
            </div>

            {user && (
                <form className="post__commentBox">
                <input 
                type="text" 
                className="post__input"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                />
                <Button 
                disabled={!comment} 
                className="post__button"
                type="submit"
                onClick={postComment}
                variant="contained"
                color="primary"
                
                >Post</Button>
            </form>

            )}
           
        </div>
    )
}

export default Post




