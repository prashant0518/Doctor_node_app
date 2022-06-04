import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Redirect, useHistory } from 'react-router-dom'
export default function Patient(props) {
    const { data, user, deleteApt, handleFunc, logOut } = props
    const [loading, setLoading] = useState([])
    const history = useHistory();

    const [appointment, setAppointment] = useState([])

    useEffect(() => {
        const token = localStorage.getItem('myToken')
        const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        };
        let arr = []
        axios.get('http://localhost:3132/api/appointment', { headers })
            .then(res => {
                setAppointment(res.data?.data?.appointment)
                const apt = res.data?.data?.appointment

                for (let i = 0; i < apt.length; i++) {
                    arr.push({ key: i + 1, value: false })
                }
                setLoading(arr)
            })

    }, [])

    const payAmount = (id, index) => {

        setLoading([...loading.slice(0,index),{key:index+1,value:true},...loading.slice(index+1)])
        const token = localStorage.getItem('myToken')
        const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        };
        const payload = {
            "success_url": "http://localhost:3000/dashboard",
            "cancel_url": "http://localhost:3000",
            "appointmentId": id
        }
        axios.post('http://localhost:3132/patient/payment', payload, { headers })
            .then(res => {
                console.log(res?.data?.data?.url, "oat")
                window.location.href = res?.data?.data?.url
        setLoading([...loading.slice(0,index),{key:index+1,value:false},...loading.slice(index+1)])

            })
    }
    return (
        <div className="container">
            <div className='row'>
                <h1 className="p-3 text-center ">{user.userType == "patient" ? 'Doctors list' : 'Appointment list'}</h1>
                <div>
                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Fees</th>
                                <th scope="col">Book Appointment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => {

                                return <tr>
                                    <th scope="row">{index + 1}</th>
                                    <td> {`${user.userType == "patient" ? "Dr." : ""} ${item?.name}`}</td>
                                    <td> {`${user.userType == "patient" ? "$" : ""} ${item?.fee}`}</td>
                                    <td><button className='btn btn-success' data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => handleFunc(item)}>Book appointment</button></td>
                                </tr>
                            })}


                        </tbody>
                    </table>




                </div>
            </div>
            <div className='row'>
                {/* <h2 className="p-3 text-center ">{user.userType == "patient" ? 'Your Appointments' : ''}</h2> */}
                {user.userType == 'patient' ? <h2 className="p-3 text-center ">Your Appointments</h2> : ''}
                {appointment.length ? <div>
                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Appointment Time (15 min)</th>
                                <th scope="col">Appointment date</th>
                                <th scope="col">Doctor</th>
                                <th scope="col">Payment Status</th>
                                <th scope="col">Appointment Status</th>
                                <th scope="col">Cancel </th>
                                {/* <th scope="col">Cancel </th> */}






                            </tr>
                        </thead>
                        <tbody>
                            {appointment.map((item, index) => {
                     
                                return <tr>
                                    <th scope="row">{index + 1}</th>
                                    <td>{item?.appointment_time}</td>
                                    <td>{item?.appointment_date}</td>
                                    <td>{`${user.userType == "patient" ? "Dr." : ""} ${item?.doctor?.name}`}</td>
                                    <td>{item?.payment_status} </td>
                                    <td>{item?.approval_status}</td>
                                    <td><button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => deleteApt(item.id)}>cancel</button></td>
                                    <td>{item?.payment_status == "not paid" ? <button className="btn btn-primary" onClick={() => payAmount(item?.id, index)}>{loading.length && loading?.find(el => el.key == index + 1)?.value ? <div class="spinner-border" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div> : 'pay'}</button> : ""} </td>
                                </tr>
                            })}


                        </tbody>
                    </table>




                </div> : <h6 className='text-center text-danger'>No appointments</h6>}
            </div>
            <div className="row">

                <button className='btn btn-primary mx-auto' onClick={logOut}>log out</button>
            </div>

        </div>
    )
}
