import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues)
  // ✨ where are my props? Destructure them here
  const { postArticle, currentArticleId, setCurrentArticleId, updateArticle, articles } = props

  useEffect(() => {
    const currentArticle = articles.find(article => article.article_id === currentArticleId)
    console.log('currentArticle',currentArticle)
    // console.log('topic',currentArticle.topic)
    // ✨ implement
    // Every time the `currentArticle` prop changes, we should check it for truthiness:
    // if it's truthy, we should set its title, text and topic into the corresponding
    // values of the form. If it's not, we should reset the form back to initial values.
    currentArticleId === null ? setValues(initialFormValues): setValues({title: currentArticle.title, text: currentArticle.text, topic: currentArticle.topic})
  },[currentArticleId])
  // setValues({title: articles[currentArticle].title, text: articles[currentArticle].text, topic: articles[currentArticle].topic}
  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value})
  }
  const onSubmit = evt => {
    evt.preventDefault()
    // ✨ implement
    // We must submit a new post or update an existing one,
    // depending on the truthyness of the `currentArticle` prop.
    currentArticleId === null ? postArticle({'title':values.title, 'text':values.text, 'topic':values.topic}) :
    updateArticle({article_id:currentArticleId, article: {'title':values.title, 'text':values.text, 'topic':values.topic}}),
    setValues(initialFormValues),
    setCurrentArticleId(null)
  }
  const isDisabled = () => {
    let titleTest = values.title.length >=1 ? true : false
    let textTest = values.text.length >=1 ? true : false
    let topicTest = values.topic === '' ? false : true
    // ✨ implement
    // Make sure the inputs have some values
    if(titleTest && textTest && topicTest === true){
      return false
    }
    return true
  }

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create"
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>Create Article</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        {currentArticleId === null ? <button disabled={isDisabled()} id="submitArticle">Submit</button>: <> <button disabled={isDisabled()} id="submitArticle">Submit</button> <button onClick={(e)=>{e.preventDefault(), setCurrentArticleId(null)}}>Cancel edit</button></>}
        {/* <button disabled={isDisabled()} id="submitArticle">Submit</button>
        <button onClick={(e)=>{e.preventDefault(), setCurrentArticleId(0)}}>Cancel edit</button> */}
      </div>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
