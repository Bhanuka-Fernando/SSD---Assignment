import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api";
import PatientSideBar from "../PatientSideBar";
import AllChannels from "./AllChannels";
import Patientheader from "../Payment/Patientheader";

const SearchChannels = () => {
  const { date, doctor } = useParams();
  const [channels, setChannels] = useState([]);
  const [doctor1, setDoctor] = useState(doctor || "");
  const [date1, setDate] = useState(date || "");

  useEffect(() => {
    const load = async () => {
      try {
        const isoDate = date ? new Date(date).toISOString() : "";
        const { data } = await api.get(`/channel/search/${isoDate}/${doctor || ""}`);
        setChannels(data.channels || []);
      } catch (error) {
        console.log(error);
      }
    };
    load();
  }, [date, doctor]);

  return (
    <div className="flex flex-col h-screen">
      <Patientheader />
      <div className="flex flex-grow">
        <PatientSideBar />
        <div className="flex-grow p-4 ml-64 mt-10 bg-gray-100">
          <div className="search-container mb-4 mt-10">
            <input
              className="search-inputs border border-gray-300 p-2 rounded w-full md:w-1/3"
              type="text"
              placeholder="Search Doctor"
              value={doctor1}
              onChange={(e) => setDoctor(e.target.value)}
            />
            <input
              className="search-inputs border border-gray-300 p-2 rounded w-full md:w-1/3 ml-2"
              type="date"
              value={date1}
              onChange={(e) => setDate(e.target.value)}
            />

            <Link to={`/searchChannels/${date1 || ""}/${doctor1 || ""}`}>
              <button className="search-btn bg-blue-500 text-white p-2 rounded ml-2">
                Search
              </button>
            </Link>

            <h4 className="mt-4">
              Search Results for “{doctor || "-"}” and {date ? new Date(date).toLocaleDateString() : "-"}
            </h4>
          </div>

          <AllChannels channels={channels} />
        </div>
      </div>
    </div>
  );
};

export default SearchChannels;