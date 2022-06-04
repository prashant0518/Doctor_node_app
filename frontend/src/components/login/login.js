import React, { useState } from "react"
import "./login.css"
import axios from "axios"
import { useHistory } from "react-router-dom"

const Login = ({ setLoginUser }) => {

    const history = useHistory()
    const [loading, setLoading] = useState(false)

    const [user, setUser] = useState({
        email: "",
        password: "",
        type: ''
    })

    const handleChange = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const login = () => {
        setLoading(true)
        axios.post("http://localhost:3132/auth/login", user)
            .then(res => {

                if (res.data.status == 1) {
                    alert(res.data.message)
                    setLoading(false)
                    setLoginUser(res.data.data)
                    localStorage.setItem('myToken', res.data.authToken);
                    history.push("/")
                    window.location.reload()
                } else {
                    alert(res.data.message)
                    setLoading(false)
                }
            }).catch(err => alert("something went wrong"))
    }

    return (
        <div className="login">
            <h1>Login</h1>
            <input type="text" name="email" value={user.email} onChange={handleChange} placeholder="Enter your Email"></input>
            <input type="password" name="password" value={user.password} onChange={handleChange} placeholder="Enter your Password" ></input>
            <h4 className="m-2">Are you Doctor or Patient</h4>
            <div className="d-flex justify-content-around p-2">
                <div className="form-check ">
                    <input className="form-check-input" type="radio" name="type" value="doctor" onChange={handleChange} />
                    <label className="form-check-label" for="flexRadioDefault1">
                        Doctor
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="type" value='patient' onChange={handleChange} />
                    <label className="form-check-label" for="flexRadioDefault2">
                        Patient
                    </label>
                </div>
            </div>

            <div className="button" onClick={login}>{loading ? <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div> : 'Login'}</div>
            <div>or</div>
            <div className="button" onClick={() => history.push("/register")}>Register</div>
        </div>
    )
}

export default Login