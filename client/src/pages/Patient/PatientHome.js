import React, { useEffect, useState } from 'react';
import axios from "axios";
import PatientHeader from "../../components/Payment/Patientheader";
import PatientSideBar from "../../components/PatientSideBar";
import AllChannels from '../../components/Appointment/AllChannels';


const PatientHome = () => {
    const dt = new Date().toISOString().split("T")[0]; 

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [channels, setChannels] = useState([]);
    const [doctor, setDoctor] = useState("");
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token == null) {
            window.location.href = "/";
        } else {
            getUser();
            getChannels();
        }
    }, []);

    const getChannels = async () => {
        try {
            const res = await axios.get(`http://localhost:8070/channel/`);
            setChannels(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getUser = async () => {
        try {
            const res = await axios.get("http://localhost:8070/patient/check/", {
                headers: { Authorization: `${localStorage.getItem("token")}` }
            });
            setEmail(res.data.patient.email);
            setPassword(res.data.patient.password);
        } catch (err) {
            localStorage.removeItem("token");
            window.location.href = "/";
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        alert("You have logged out");
        window.location.href = "/";
    };

    return (
        <div className="flex flex-col h-screen">
            <PatientHeader />

            <div className="flex flex-grow">
                <PatientSideBar />

                <div className="flex-grow p-8 bg-gray-100 ml-64 mt-8"> {/* Adjust padding and margin-left here */}
                    <div className='search-container mb-4 mt-10'> {/* Added mt-4 */}
                        <input 
                            className='search-inputs border border-gray-300 rounded p-2 w-full md:w-1/3' 
                            type="text" 
                            placeholder="Search Doctor" 
                            onChange={(e) => setDoctor(e.target.value)} 
                            required 
                        />
                        <input 
                            className='search-inputs border border-gray-300 rounded p-2 w-full md:w-1/3 ml-2' 
                            type="date"  
                            placeholder="Channeling Date" 
                            min={dt} 
                            onChange={(e) => setDate(new Date(e.target.value))} 
                            required 
                        />
                        <a href={`/searchChannels/${date}/${doctor}`}>
                            <button className='search-btn bg-blue-500 text-white rounded p-2 ml-2'>Search</button>
                        </a>
                    </div>

                    <AllChannels channels={channels} />
                </div>
            </div>
        </div>
    );
};

export default PatientHome;
