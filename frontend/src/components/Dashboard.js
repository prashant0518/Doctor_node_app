import React, { useState, useEffect } from 'react'
import axios from "axios"
import Popup from './Popup'
import DeleteModal from './DeleteModal'
import Patient from './Patient'
import Doctor from './Doctor'

export default function Dashboard() {
    const [data, setData] = useState([])
    const [user, setUser] = useState('')
    const [loading, setLoading] = useState(true)
    const [modalData, setModalData] = useState(0)
    const [deleteModal, setDeleteModal] = useState('')
 
    const logOut = () => {
        localStorage.removeItem('myToken')
        window.location.reload()
    }

    useEffect(() => {
        const token = localStorage.getItem('myToken')
        const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        };
        axios.get("http://localhost:3132/patient/get_data", { headers })
            .then(res => {
                console.log(res.data, "dash")
                setData(res.data.doctors)
                setUser(res.data.user)
                setLoading(false)
            })
        

    }, [])

    const handleFunc = (data) => {
        setModalData(data)

    }
    const deleteApt = (data) => {
        setDeleteModal(data)
    }
    return (
        <>

            {!loading ?(
                user.userType == "patient" ?
                    <>

                        <Patient data={data} user={user} handleFunc={handleFunc} deleteApt={deleteApt}  logOut={logOut} />
                        <Popup data={modalData} />
                        <DeleteModal data={deleteModal} />
                    </>

                    :
                    <Doctor data={data} user={user}  logOut={logOut} />)
                :
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>}
        </>
    )




}
