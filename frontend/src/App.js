import './App.css'
import Homepage from "./components/homepage/homepage"
import Login from "./components/login/login"
import Register from "./components/register/register"
import { BrowserRouter as Router, Switch, Route,Redirect } from "react-router-dom";
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/modal';

import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/Protectedroute';

function App() {

  const [ user, setLoginUser] = useState({})
  const token = localStorage.getItem('myToken')
  console.log(user)
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            {
             token && token!==undefined ? <Redirect to='/dashboard' /> : <Login setLoginUser={setLoginUser}/>
            }
          </Route>
          {/* <Route exact path='/' render={() => authorized ?<Redirect to='/dashboard' />: <Login setLoginUser={setLoginUser}/>} /> */}
          <Route exact path="/login">
            <Login setLoginUser={setLoginUser}/>
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <ProtectedRoute path="/dashboard" component={Dashboard} auth={token ?true :false}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
