import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import axiosWithAuth from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'
const token = localStorage.getItem('token')
export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState(null)
  const [spinnerOn, setSpinnerOn] = useState(false)
  
  console.log('currentArticleId',currentArticleId)
  console.log('article', articles)

  const token = localStorage.getItem('token')
  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { 
    /* ✨ implement */ 
    navigate('/')
  }
  const redirectToArticles = () => { 
    /* ✨ implement */ 
    navigate('articles')
  }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem('token')
    setMessage('Goodbye!')
    redirectToLogin();
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage('')
    setSpinnerOn(true)
    axios.post(loginUrl, {
      username: username,
      password:password,
    })
    .then(res => {
      localStorage.setItem('token', res.data.token)
      setMessage(res.data.message)
      redirectToArticles();
      setSpinnerOn(false)
    })
    .catch(err => {
      console.error(err)
    })

  
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage('')
    setSpinnerOn(true)

    axios.get('http://localhost:9000/api/articles', {
      headers: {
        authorization: token
      }
    })
    .then(res => {
      setArticles(res.data.articles)
      setMessage(res.data.message)
      setSpinnerOn(false)
    })
    .catch(err => {
      setSpinnerOn(false)
    })



  }
  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage('')
    setSpinnerOn(true)
    axios.post('http://localhost:9000/api/articles',{'title':article.title, 'text':article.text, 'topic':article.topic}, {
      headers: {
        authorization: token
      }
    })
    .then(res => {
      console.log(res.data.article)
      setMessage(res.data.message),
      setArticles([...articles, res.data.article])
      setSpinnerOn(false)
    })
    .catch(err => {
      console.error(err)
      setSpinnerOn(false)
    })
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setMessage('')
    setSpinnerOn(true)
    axios.put(`http://localhost:9000/api/articles/${article_id}`, article, {
      headers: {
        authorization: token
      }
    })
    .then(res => {
      // const del = articles.filter(article => (article.article_id !== article_id))
      const rep = articles.map(article => article.article_id === res.data.article.article_id ? res.data.article: article)
      console.log(res)
      setMessage(res.data.message),
      setArticles(rep)
      setSpinnerOn(false)
    })
    .catch(err => {
      console.err(err)
      setSpinnerOn(false)
    })
  }

  const deleteArticle = article_id => {
    setMessage('')
    setSpinnerOn(true)
    axios.delete(`http://localhost:9000/api/articles/${article_id}`,{
      headers: {
        authorization: token
      }
    })
    .then(res => {
      const del = articles.filter(article => (article.article_id !== article_id))
      console.log('res', res,'del', del, 'articles', articles)
      setMessage(res.data.message),
      setArticles(del),
      setSpinnerOn(false)
    })
    .catch(err => {
      console.error(err)
      setSpinnerOn(false)
    })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm postArticle={postArticle} setCurrentArticleId={setCurrentArticleId}  updateArticle={updateArticle} currentArticleId={currentArticleId} articles={articles}/>
              <Articles getArticles={getArticles} articles={articles} setCurrentArticleId={setCurrentArticleId} currentArticleId={currentArticleId} deleteArticle={deleteArticle}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
