import React, { useEffect, useState } from 'react'
import '../styles/Post.scss'
import { Avatar, Button } from '@mui/material'
import { db } from '../firebase'
import firebase from 'firebase/compat/app'
import DeleteIcon from '@mui/icons-material/Delete'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

const Post = ({ imageUrl, username, caption, postId, user }) => {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')

  useEffect(() => {
    db.collection('posts')
      .doc(postId)
      .collection('comments')
      .orderBy('timestamp', 'asc')
      .onSnapshot((snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()))
      })
  }, [postId])

  const postComment = (e) => {
    e.preventDefault()

    db.collection('posts').doc(postId).collection('comments').add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    setComment('')
  }

  const deletePost = (e) => {
    e.preventDefault()
    confirmAlert({
      title: 'This will permanently delete your post',
      message: 'Are you sure you wont to delete post',
      buttons: [
        {
          label: 'Yes',
          onClick: () => db.collection('posts').doc(postId).delete(postId),
        },
        {
          label: 'No',
          onClick: () => console.log('NO'),
        },
      ],
    })
  }

  return (
    <div className='post'>
      <div className='post-header'>
        <div>
          <Avatar
            className='post-header-avatar'
            src='/static/images/avatar/1.jpg'
            alt='Fuad'
          />
          <h3>{username}</h3>
        </div>
        {username === user?.displayName ? (
          <DeleteIcon style={{ cursor: 'pointer' }} onClick={deletePost} />
        ) : (
          console.log('zabranjeno brisanje')
        )}
      </div>

      {/*header -> avatar and username */}

      <img src={imageUrl} alt='' />
      {/*body - > image*/}

      <h4>
        <strong>{username} </strong>
        {caption}
      </h4>
      {/*footer -> username and describle*/}
      <div className='post-comments'>
        {comments.map((comment, index) => (
          <p key={index}>
            <strong>{comment.username} </strong> {comment.text}
          </p>
        ))}
      </div>
      <form>
        <input
          type='text'
          placeholder='Add a comment..'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button type='submit' disabled={!comment} onClick={postComment}>
          Post
        </Button>
      </form>
    </div>
  )
}

export default Post
