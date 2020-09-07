import React, {useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import Avatar from '@material-ui/core/Avatar';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 300,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const [posts, setPosts] = useState([]);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [user, setUser] = useState(null);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();

  // useEffect -> runs a piece of code based on some condition

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out
        setUser(null);
      }
    })
    return () => {
      //perform some cleanup acions
      unsubscribe();
    }
    
  }, [user, username]);

  useEffect(() => {   
      db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        setPosts(snapshot.docs.map (doc => ({ id:doc.id , post :doc.data()})));
      })  
  }, []);


  const signUp = (event) => {
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      authUser.user.updateProfile ({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));
  }

  const signIn =(event) => {
    event.preventDefault();
    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }


  const scrollToBottom = (event) => {
    event.preventDefault();
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth"
    });
  }

  return (
    <div className="app">
    <Modal
      open={open}
      onClose={() => setOpen(false)}
        
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signUp">   
          <center>
            <img 
            className="app__headerImage" 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
            alt="Insta-logo"
            width="150px" 
            height="50px" 
            /> 
          </center>


          <Input
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button variant="contained" color="primary" onClick={signUp}>Sign Up</Button>
        </form>
      </div>
    </Modal>

    <Modal
      open={openSignIn}
      onClose={() => setOpenSignIn(false)}        
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signUp">   
          <center>
            <img 
            className="app__headerImage" 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
            alt="Insta-logo"
            width="150px" 
            height="50px" 
            /> 
          </center>
  
          <Input
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button variant="contained" color="primary" onClick={signIn}>Sign In</Button>
        </form>
      </div>
    </Modal>


      <div className="app__header">
      <img 
      className="app__headerImage" 
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
      alt ="instagram-logo"
      width="100px" 
      height="40px" />


        {user ? (
          <div className="appelement">
            <Button color="primary" variant="contained" onClick={() => auth.signOut()}>Logout</Button>
          </div>
          
        ):(
          <div className="app__loginContainer">
          <Button className="signinButton" color="primary" variant="contained" onClick={() => setOpenSignIn(true)}>SignIn</Button>
          <Button color="primary" variant="contained" onClick={() => setOpen(true)}>Signup</Button>
          </div>

        )
      }
      </div>


      <div className="app__username">
        {user ? (
          <div className="userdetails">
            <div className="usernameandavatar">
            <Avatar className="user__Avatar"
            alt={user.displayName} 
            src="/static/images/avatar/1.jpg" 
            />
            <h2 className="user__Username">{user.displayName}</h2>
            </div>
            
            <div className="scrollToBottom">
            <Button color="primary" variant="contained" onClick={scrollToBottom}>Add a Post</Button>
            </div>
          

          </div>
          ) : (
            <div className="loginmessage">
              <h3>Login to continue</h3>
            </div>
          )
        }
      </div>

      

      <div className="app_posts">
      {
        posts.map(({id, post}) => (
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
      }
      </div>
      
      
      {
        user?.displayName ? (
         <ImageUpload username={user.displayName}/>
        ): (
          <div className="upload__message">
          <h3>Sorry, You must Sign In to Upload </h3>
          </div>
        )
      }

    </div>
  );
}

export default App;
