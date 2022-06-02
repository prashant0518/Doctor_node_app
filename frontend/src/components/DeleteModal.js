import React, { useState } from 'react'
import axios from 'axios'

export default function DeleteModal({ data }) {
console.log('data',data)
    const cancelApt =()=>{
        const token = localStorage.getItem('myToken')
        const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        };

        axios.delete(`http://localhost:3132/api/appointment?appointmentId=${data}`,{ headers })
            .then(res => {
                // console.log(res,"e")
            window.location.reload()
            })
    }
    return (
        <div>

            {/* <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
  Launch static backdrop modal
</button> */}

            <div class="modal fade" id="deleteModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel" >Delete Appointment</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                         Are You sure ?
                        </div>
                        <div class="modal-footer">
                             
                                 <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" onClick={cancelApt}>sure</button>
    
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
