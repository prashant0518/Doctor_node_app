import React from 'react'

export default function Patient(props) {
    const {data,user,deleteApt,handleFunc,appointment,logOut} = props
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
                                <td>{item?.payment_status == "not paid" ? <button className="btn btn-primary">pay</button> : ""} </td>
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
