import React from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      newBlog:'',
      username: '',
      password: '',
      user: null

    }
  }


  componentDidMount() {
    blogService.getAll().then(blogs =>
      this.setState({ blogs })

    )
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user })
      blogService.setToken(user.token)
    }
  }

  login = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      this.setState({ username: '', password: '', user })
    } catch (exception) {
      this.setState({
        error: 'käyttäjätunnus tai salasana virheellinen',
      })
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    }
  }



  handleLoginFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  
  handleBlogChange = (event) => {
    this.setState({ newBlog: event.target.value })
  }

  addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      content: this.state.newBlog,
      date: new Date(),
      important: Math.random() > 0.5
    }

    blogService
      .create(blogObject)
      .then(newBlog => {
        this.setState({
          blogs: this.state.blogs.concat(newBlog),
          newBlog: ''
        })
      })
  }



  render() {

    const loginForm = () => (
      <div>
        <h2>Kirjaudu</h2>

        <form onSubmit={this.login}>
          <div>
            username:
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleLoginFieldChange}
            />
          </div>
          <div>
            password:
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleLoginFieldChange}
            />
          </div>
          <button>kirjaudu</button>
        </form>
      </div>
    )

    const blogForm = () => (

      <div>
        <h3>create new</h3>

        <form onSubmit={this.addBlog}>
          <input
            value={this.state.newBlog}
            onChange={this.handleBlogChange}
          />
          <button>tallenna</button>
        </form>
      </div>
    )


    if (this.state.user === null) {
      return (
        loginForm()

      )
    }
    return (
      <div>

        <h2>blogs</h2>
        <p>{this.state.username} is logged in</p><button>logout</button>
        {this.state.blogs.map(blog =>
          <Blog key={blog._id} blog={blog} />
        )}
        {blogForm()}


      </div>


    )
  }
}

export default App;
