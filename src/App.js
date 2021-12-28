import React, { useState, useEffect } from 'react'
import './App.scss'
import Post from './components/Post'
import { db, auth } from '../src/firebase'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { Button, Input } from '@mui/material'
import ImageUpload from './components/ImageUpload'

import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

const App = () => {
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [opetSingIn, setOpenSingIn] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser)
      } else {
        setUser(null)
      }
    })
  }, [])

  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        )
      })
  }, [])

  const singUp = (e) => {
    e.preventDefault()
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        })
      })
      .catch((err) => alert(err.message))
    setOpen(false)
  }

  const singIn = (e) => {
    e.preventDefault()
    auth
      .signInWithEmailAndPassword(email, password)

      .catch((err) => alert(err.message))
    setOpenSingIn(false)
  }

  const logOut = (e) => {
    e.preventDefault()
    confirmAlert({
      title: 'Logout',
      message: 'Are you sure you want to Logout',
      buttons: [
        {
          label: 'Yes',
          onClick: () => (auth.signOut(), setEmail(''), setPassword('')),
        },
        {
          label: 'No',
          onClick: () => console.log('NO'),
        },
      ],
    })
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  return (
    <div className='app'>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <form style={{ display: 'flex', flexDirection: 'column' }}>
            <center>
              <img
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt='instagram-logo'
              />
            </center>

            <Input
              type='text'
              placeholder='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type='email'
              placeholder='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type='password'
              placeholder='passwprd'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={singUp}>
              Sing Up
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal open={opetSingIn} onClose={() => setOpenSingIn(false)}>
        <Box sx={style}>
          <form style={{ display: 'flex', flexDirection: 'column' }}>
            <center>
              <img
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt='instagram-logo'
              />
            </center>
            <Input
              type='email'
              placeholder='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type='password'
              placeholder='passwprd'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={singIn}>
              Login
            </Button>
          </form>
        </Box>
      </Modal>

      <div className='app-header'>
        <img
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          alt='instagram-logo'
        />
        <h4>{user?.displayName}</h4>
        {user ? (
          <Button onClick={logOut}>Logout</Button>
        ) : (
          <div>
            <Button onClick={() => setOpen(true)}>Sing Up</Button>
            <Button onClick={() => setOpenSingIn(true)}>Login</Button>
          </div>
        )}
      </div>
      <div className='app-center'>
        <div className='app-posts'>
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              imageUrl={post.imageUrl}
              username={post.username}
              caption={post.caption}
            />
          ))}
          {user?.displayName ? (
            <ImageUpload username={user.displayName} />
          ) : (
            <h3>Login to upload</h3>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
