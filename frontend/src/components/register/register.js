import React, { useState } from "react"
import "./register.css"
import axios from "axios"
import { useHistory } from "react-router-dom"

const Register = () => {

    const history = useHistory()

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        reEnterPassword: "",
        type:'',
        fee:''
    })
    
    const handleChange = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const register = () => {
        const { name, email, password, reEnterPassword,type } = user
        if (name && email && password && (password === reEnterPassword)&&type) {
            axios.post("http://localhost:3132/auth/register", user)
                .then(res => {
                    console.log(res)
                    alert(res.data.message)
                    history.push("/login")
                })
        } else {
            alert("invlid input")
        }

    }

    return (
        <div className="register">
            {/* {console.log("User", user)} */}
            <h1>Register</h1>
            <input type="text" name="name" value={user.name} placeholder="Your Name" onChange={handleChange}></input>
            <input type="text" name="email" value={user.email} placeholder="Your Email" onChange={handleChange}></input>
            <input type="password" name="password" value={user.password} placeholder="Your Password" onChange={handleChange}></input>
            <input type="password" name="reEnterPassword" value={user.reEnterPassword} placeholder="Re-enter Password" onChange={handleChange}></input>
            <h4 className="m-2">Are you Doctor or Patient</h4>
            <div className="d-flex justify-content-around p-2">
            <div className="form-check ">
                <input className="form-check-input" type="radio" name="type" value="doctor" onChange={handleChange} />
                <label className="form-check-label" for="flexRadioDefault1">
                    Doctor
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="type" value='patient'  onChange={handleChange} />
                <label className="form-check-label" for="flexRadioDefault2">
                   Patient
                </label>
            </div>
            </div>
           {user.type=='doctor' ? <input type="text" name="fee" value={user.fee} placeholder="Consultation fee" onChange={handleChange}></input>:""}

            <div className="button" onClick={register} >Register</div>
            <div>or</div>
            <div className="button" onClick={() => history.push("/login")}>Login</div>
        </div>
    )
}

export default Register