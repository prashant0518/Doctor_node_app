import React ,{useState,useEffect} from 'react'
import axios from 'axios'

export default function Doctor(props) {
    const {data,user,deleteApt,handleFunc,logOut} = props
    const [appointment, setAppointment] = useState([])

    useEffect(() => {
        const token = localStorage.getItem('myToken')
        const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        };
        axios.get('http://localhost:3132/api/appointment', { headers })
            .then(res => {
                setAppointment(res.data?.data?.appointment)
            })
       
    }, [])
    const updateStatus=(id)=>{
        const token = localStorage.getItem('myToken')
        const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        };
        axios.patch("http://localhost:3132/api/appointment",{appointmentId:id} ,{ headers })
        .then(res => {
            console.log(res.data, "dash")
           
            // setData(res.data.allAppointments)
            // setUser(res.data.user)
            window.location.reload()
        })
    }
    return (
        <div className="container">
              <div className='row'>
            {/* <h2 className="p-3 text-center ">{user.userType == "patient" ? 'Your Appointments' : ''}</h2> */}
            {user.userType == 'doctor' ? <h2 className="p-3 text-center ">Your Appointments</h2> : ''}
            {appointment.length ? <div>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Appointment Time (15 min)</th>
                            <th scope="col">Appointment date</th>                        
                            <th scope="col">Payment Status</th>
                            <th scope="col">Appointment Status</th>
                            <th scope="col">Patient Name</th>

                            {/* <th scope="col">Cancel </th> */}






                        </tr>
                    </thead>
                    <tbody>
                        {appointment.map((item, index) => {

                            return <tr>
                                <th scope="row">{index + 1}</th>
                                <td>{item?.appointment_time}</td>
                                <td>{item?.appointment_date}</td>
                                <td>{item?.payment_status} </td>
                                <td>{item?.approval_status}</td>
                                <td>{item?.patient?.name}</td>
                                <td>{item?.approval_status=="waiting"?<button type="button" className="btn-primary btn" onClick={()=>updateStatus(item?.id)}>confirm status</button>:""}</td>
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
