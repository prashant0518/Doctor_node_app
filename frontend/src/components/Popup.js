import React, { useState } from 'react'
import axios from 'axios'

export default function Popup({ data }) {
    const [apt, setApt] = useState({
        time: '',
        date: '',
        memberId: data.id
    })
    const [isBook,setIsBook] = useState(false)
    console.log(data.id)
    const handleChange = (e) => {
        const { value, name } = e.target
        setApt({
            ...apt,
            [name]: value,
            doctorId:data.id
        })
    }
    console.log(apt, "apt")

    const bookApt =()=>{
        const token = localStorage.getItem('myToken')
        const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        };
        axios.post('http://localhost:3132/api/appointment', apt,{ headers })
            .then(res => {
              setIsBook(true)
            })
    }
    return (
        <div>

            {/* <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
  Launch static backdrop modal
</button> */}

            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel" >Book Appointment</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=>window.location.reload()}></button>
                        </div>
                        <div class="modal-body">
                            <form >
                                <div className='d-flex flex-column p-2'>
                                    <div className="m-2">
                                        <label for="date">Appointment Date:</label>
                                        <input type="date" id="appointment_date" name="date" value={apt.date} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label for="time">Appointment Time:</label>
                                        <input type="time" id="appointment_date" name="time" min="09:00" max="18:00" step='15' value={apt.time} onChange={handleChange} />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            {
                                !isBook
                                ?<>
                                 <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" onClick={bookApt}>Book</button>
                                </>:<>
                                <h5 className="me-5 text-success">Appointment Booked</h5>
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={()=>window.location.reload()}>Close</button>
                                </>

                            }
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
