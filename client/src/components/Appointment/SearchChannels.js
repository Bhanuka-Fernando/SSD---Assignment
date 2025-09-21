import React, { useEffect, useState } from "react";
import axios from "axios";

import PatientSideBar from '../PatientSideBar';
import AllChannels from "./AllChannels";
import { useParams } from "react-router-dom";
import Patientheader from "../Payment/Patientheader";

const SearchChannels = () => {
  let { date, doctor } = useParams();

  const [channels, setChannels] = useState([]);
  const [doctor1, setDoctor] = useState(doctor);
  const [date1, setDate] = useState(date);

  useEffect(() => {
    console.log(date1);
    console.log(doctor1);
    getSearchChannels();
  }, [date1, doctor1]); // Add dependencies to useEffect

  const getSearchChannels = async () => {
    console.log(date);
    date = new Date(date).toISOString().substring(0);

    console.log(date);

    axios
      .get(`http://localhost:8070/channel/search/${date}/${doctor}`)
      .then((res) => {
        console.log(res.data.channels);
        setChannels(res.data.channels);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col h-screen">
      <Patientheader />

      <div className="flex flex-grow">
        <PatientSideBar /> {/* Add the sidebar here */}

        <div className="flex-grow p-4 ml-64 mt-10 bg-gray-100"> {/* Adjust margin-left and padding */}
          <div className="search-container mb-4 mt-10"> {/* Added margin-top for spacing */}
            <input
              className="search-inputs border border-gray-300 p-2 rounded w-full md:w-1/3"
              type="text"
              placeholder="Search Doctor"
              onChange={(e) => {
                setDoctor(e.target.value);
              }}
              required
            />
            <input
              className="search-inputs border border-gray-300 p-2 rounded w-full md:w-1/3 ml-2"
              type="date"
              placeholder="Channeling Date"
              onChange={(e) => {
                setDate(e.target.value);
              }}
              required
            />

            <a href={`/searchChannels/${date1}/${doctor1}`}>
              <button className="search-btn bg-blue-500 text-white p-2 rounded ml-2">
                Search
              </button>
            </a>

            <h4 className="mt-4">
              Search Results for "{doctor}" and{" "}
              {new Date(date).toLocaleDateString()}
            </h4>
          </div>

          <AllChannels channels={channels} />
        </div>
      </div>
    </div>
  );
};

export default SearchChannels;
