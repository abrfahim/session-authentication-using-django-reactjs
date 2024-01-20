import React from 'react'
import Cookies from 'universal-cookie'

const cookies = new Cookies();

class App extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        username: '',
        password: '',
        error: '',
        isAuthenticated: false,
      }
  }

  componentDidMount=()=>{
    this.getSession();
  }
  getSession=()=>{
    fetch('/api/session',{
      credentials:'same-origin',
    })
    .then((res)=>res.json())
    .then((data)=>{
      console.log(data);
      if(data.isAuthenticated){
        this.setState({isAuthenticated:true})
      }
      else{
        this.setState({isAuthenticated:false})
      }
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  whois=()=>{
    fetch('/api/whois/',{
      headers:{
        'Content-Type': 'application/json',
      },
      credentials:'same-origin',
    })
    .then((res)=>res.json())
    .then((data)=>{
      console.log('You are logged in as: ' + data.username);
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  handlePasswordChange=(event)=>{
    this.setState({password:event.target.value});
  }

  handleUserNameChange=(event)=>{
    this.setState({username:event.target.value});
  }

  isResponseOk(response){
    if(response.status >= 200 && response.status <= 299){
      return response.json();
    }
    else{
      throw Error(response.statusText);
    }
  }

  login=(event)=>{
    event.preventDefault();
    // make a post request
    fetch('/api/login',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies.get('csrftoken'),
      },
      credentials:'same-origin',
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then(this.isResponseOk)
    .then((data) => {
      console.log(data);
      this.setState({isAuthenticated:true, username:'', password:'', error:''})
    })
    .catch((err)=>{
      console.log(err);
      this.setState({error:'Wrong username or password!'})
    })
  }

  logout = ()=>{
    fetch('/api/logout',{
      credentials: 'same-origin',
    })
    .then(this.isResponseOk)
    .then((data)=>{
      console.log(data);
      this.setState({isAuthenticated:false});
    })
    .catch((err)=>{
      console.log(err);
    })
  }


  render(){
    if(!this.state.isAuthenticated){
      return(
        <div className='container mt-3'>
          <h1>React Cookie Auth</h1>
          <br />
          <h2>Login</h2>
          <form action="" onSubmit={this.login}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" className='form-control' id='username' />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className='form-control' id='password' 
              value={this.state.password}
              name='password'
              onChange={this.handlePasswordChange}
              />
              <div>
                {this.state.error && <small className='text-danger'>
                  {this.state.error}</small>}
              </div>
            </div>
            <button className='btn btn-primary btn-sm'>Login</button>
          </form>
        </div>
      );
    }
    return(
      <div className='container mt-3'>
        <h1>React Auth Cookie</h1>
        <p>You are logged in!</p>
        <button className='btn btn-primary btn-sm mr-2'>WhoAmI</button>
        <button className='btn btn-danger btn-sm mr-2'>Logout</button>
      </div>
    );
  }
}

export default App