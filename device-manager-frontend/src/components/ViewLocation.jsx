import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faAdd,
} from "@fortawesome/free-solid-svg-icons";
import { Typography } from "@material-tailwind/react";
import "./note.css";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import note from "../assets/note.png";

const ViewLocation = () => {
  const [locations, setLocations] = useState([]);
  const [locationId, setLocationId] = useState([]);
  const [filterLocations, setfilterLocations] = useState([]);
  const [filterTerm, setFilterTerm] = useState("");
  const [isAddLocationVisible, setIsAddLocationVisible] = useState(false);
  const [isUpdateLocationVisible, setIsUpdateLocationVisible] = useState(false);
  const [isAddDevicesVisible, setIsAddDevicesVisible] = useState(false);
  const [formLocationData, setformLocationData] = useState({
    location_name: "",
    address: "",
    phone: "",
  });

  const [formDeviceData, setformDeviceData] = useState({
    serial_no: "",
    type: "",
    image: "",
    status: "active",
  });

  useEffect(() => {
    fetchData();
  }, [filterTerm]);

  const fetchData = () => {
    const apiUrl = filterTerm
      ? `http://localhost:5000/api/getSearchLocation?location_name=${filterTerm}`
      : "http://localhost:5000/api/getAll";

    axios
      .get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        if (filterTerm) {
          setfilterLocations(response.data.data);
        } else {
          setLocations(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const deleteLocation = (locationId) => {
    axios
      .delete(`http://localhost:5000/api/removeLocation/${locationId}`, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then(() => {
        fetchData();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Location deleted successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Add location
  const handleAddLocationClick = () => {
    formLocationData.location_name = "";
    formLocationData.address = "";
    formLocationData.phone = "";
    setIsAddLocationVisible(true);
  };
  const handleCloseAddLocationDialog = () => {
    setIsAddLocationVisible(false);
  };

  const handleChange = (e) => {
    setformLocationData({
      ...formLocationData,
      [e.target.name]: e.target.value,
    });
  };
  // create new location
  const handleSubmitLocation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/create",
        formLocationData,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      if (response.status === 200) {
        // Successfully stored on the backend
        fetchData();
        handleCloseAddLocationDialog();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Location added successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.error("Failed to add location!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //update location
  const handleUpdateLocationClick = (
    locationId,
    location_name,
    address,
    phone
  ) => {
    setLocationId(locationId);
    setformLocationData({
      location_name: location_name,
      address: address,
      phone: phone,
    });
    setIsUpdateLocationVisible(true);
  };

  const handleCloseUpdateLocationDialog = () => {
    setIsUpdateLocationVisible(false);
  };
  // update location
  const handleUpdateLocation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/updateLocation/${locationId}`,
        formLocationData,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      if (response.status === 200) {
        fetchData();
        handleCloseUpdateLocationDialog();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Location updated successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.error("Failed to update location");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Add device
  const handleAddDeviceClick = (id) => {
    setLocationId(id);
    formDeviceData.serial_no = "";
    formDeviceData.type = "";
    formDeviceData.image = "";
    formDeviceData.status = "active";
    setIsAddDevicesVisible(true);
  };
  const handleCloseAddDeviceDialog = () => {
    setIsAddDevicesVisible(false);
  };

  const handleDeviceDataChange = (e) => {
    if (e.target.name === "image") {
      const imageFile = e.target.files[0];
      setformDeviceData({
        ...formDeviceData,
        image: imageFile,
      });
    } else {
      setformDeviceData({
        ...formDeviceData,
        [e.target.name]: e.target.value,
      });
    }
  };

  // add new Device
  const handleSubmitDevice = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("serial_no", formDeviceData.serial_no);
      formData.append("type", formDeviceData.type);
      formData.append("status", formDeviceData.status);
      formData.append("image", formDeviceData.image);

      const response = await axios.post(
        `http://localhost:5000/api/addDevice/${locationId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      if (response.status === 200) {
        fetchData();
        handleCloseAddDeviceDialog();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Device added successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.error("Failed to add Device!");
      }
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Devices can not have same serial number!",
        showConfirmButton: false,
        timer: 1500,
      });
      console.error("Error:", error);
    }
  };

  const navigate = useNavigate();

  const handleShowDevicesClick = (locationDetails) => {
    navigate('/showDevices', { state: { locationDetails } });
  };


  const formatDate = (mongoDate) => {
    if (!mongoDate) return null;
    const jsDate = new Date(mongoDate);
    return jsDate.toLocaleDateString();
  };

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4" style={{width:"100%"}}>
          <a href="http://localhost:3000" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={note} className="h-8" alt="Device Manager Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Device Manager</span>
          </a>
          {/* Search button */}
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 lg:flex lg:w-auto lg:order-1" id="navbar-search">
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
                <span className="sr-only">Search icon</span>
              </div>
              <input type="text" id="filterTerm" name="filterTerm" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." value={filterTerm} onChange={(e) => setFilterTerm(e.target.value)} />
            </div>
          </div>
          {/* Add location button */}
          <div className="flex md:order-2 lg:order-2">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <button type="button" onClick={handleAddLocationClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"><FontAwesomeIcon icon={faPlus} className="me-2" /> ADD Location</button>
              </li>
            </ul>
          </div>

        </div>
      </nav>


      {/* Add Location Modal start */}
      {isAddLocationVisible && (
        <div id="id01" className="w3-modal" style={{ display: "block" }}>
          <div
            className="w3-modal-content w3-card-4 w3-animate-zoom"
            style={{ maxWidth: "600px" }}
          >
            <div className="w3-center">
              <br />
              <span
                onClick={handleCloseAddLocationDialog}
                className="w3-button w3-xlarge w3-hover-red w3-display-topright"
                title="Close Modal"
              >
                &times;
              </span>
            </div>

            <form className="w3-container" onSubmit={handleSubmitLocation}>
              <Typography variant="h4" color="blue-gray">
                Add New Location
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Nice to meet you!
              </Typography>
              <div className="w3-section">
                <label>
                  <b>Location Name</b>
                </label>
                <input
                  className="w3-input w3-border w3-margin-bottom"
                  type="text"
                  placeholder="Enter Location Name"
                  id="location_name"
                  name="location_name"
                  maxLength={100}
                  onChange={handleChange}
                  value={formLocationData.location_name}
                  required
                />
                <label>
                  <b>Address</b>
                </label>
                <input
                  className="w3-input w3-border w3-margin-bottom"
                  type="text"
                  placeholder="Enter address"
                  id="address"
                  name="address"
                  maxLength={100}
                  onChange={handleChange}
                  value={formLocationData.address}
                  required
                />
                <label>
                  <b>Phone number</b>
                </label>
                <input
                  className="w3-input w3-border w3-margin-bottom"
                  type="text"
                  placeholder="Enter phone number"
                  id="phone"
                  name="phone"
                  maxLength={100}
                  onChange={handleChange}
                  value={formLocationData.phone}
                  required
                />
                <button
                  className="w3-button w3-block w3-blue w3-section w3-padding"
                  type="submit"
                >
                  Add Location
                </button>
              </div>
            </form>

            <div className="w3-container w3-border-top w3-padding-16 w3-light-grey">
              <button
                onClick={handleCloseAddLocationDialog}
                type="button"
                className="w3-button w3-red"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add location modal end */}
      {/* Edit location Modal start */}
      {isUpdateLocationVisible && (
        <div id="id01" className="w3-modal" style={{ display: "block" }}>
          <div
            className="w3-modal-content w3-card-4 w3-animate-zoom"
            style={{ maxWidth: "600px" }}
          >
            <div className="w3-center">
              <br />
              <span
                onClick={handleCloseUpdateLocationDialog}
                className="w3-button w3-xlarge w3-hover-red w3-display-topright"
                title="Close Modal"
              >
                &times;
              </span>
            </div>

            <form className="w3-container" onSubmit={handleUpdateLocation}>
              <Typography variant="h4" color="blue-gray">
                Edit Location
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Nice to meet you! Enter Note details.
              </Typography>
              <div className="w3-section">
                <label>
                  <b>Location Name</b>
                </label>
                <input
                  className="w3-input w3-border w3-margin-bottom"
                  type="text"
                  placeholder="Enter Location Name"
                  id="location_name"
                  name="location_name"
                  maxLength={100}
                  onChange={handleChange}
                  value={formLocationData.location_name}
                  required
                />
                <label>
                  <b>Address</b>
                </label>
                <input
                  className="w3-input w3-border w3-margin-bottom"
                  type="text"
                  placeholder="Enter address"
                  id="address"
                  name="address"
                  maxLength={100}
                  onChange={handleChange}
                  value={formLocationData.address}
                  required
                />
                <label>
                  <b>Phone</b>
                </label>
                <input
                  className="w3-input w3-border w3-margin-bottom"
                  type="text"
                  placeholder="Enter phone number"
                  id="phone"
                  name="phone"
                  maxLength={100}
                  onChange={handleChange}
                  value={formLocationData.phone}
                  required
                />
                <button
                  className="w3-button w3-block w3-blue w3-section w3-padding"
                  type="submit"
                >
                  Update Location
                </button>
              </div>
            </form>

            <div className="w3-container w3-border-top w3-padding-16 w3-light-grey">
              <button
                onClick={handleCloseUpdateLocationDialog}
                type="button"
                className="w3-button w3-red"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit modal end */}
      {/* Add Location Modal start */}
      {isAddDevicesVisible && (
        <div id="id03" className="w3-modal" style={{ display: "block" }}>
          <div
            className="w3-modal-content w3-card-4 w3-animate-zoom"
            style={{ maxWidth: "600px" }}
          >
            <div className="w3-center">
              <br />
              <span
                onClick={handleCloseAddDeviceDialog}
                className="w3-button w3-xlarge w3-hover-red w3-display-topright"
                title="Close Modal"
              >
                &times;
              </span>
            </div>

            <form className="w3-container" onSubmit={handleSubmitDevice}>
              <Typography variant="h4" color="blue-gray">
                Add New Device
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Nice to meet you!
              </Typography>
              <div className="w3-section">
                <label>
                  <b>Serial No</b>
                </label>
                <input
                  className="w3-input w3-border w3-margin-bottom"
                  type="text"
                  placeholder="Enter Serial No"
                  id="serial_no"
                  name="serial_no"
                  maxLength={100}
                  onChange={handleDeviceDataChange}
                  value={formDeviceData.serial_no}
                  required
                />
                <label>
                  <b>Type</b>
                </label>
                <input
                  className="w3-input w3-border w3-margin-bottom"
                  type="text"
                  placeholder="Enter type of the device"
                  id="type"
                  name="type"
                  maxLength={100}
                  onChange={handleDeviceDataChange}
                  value={formDeviceData.type}
                  required
                />
                <label>
                  <b>Status</b>
                </label>
                <div>
                  <input
                    type="radio"
                    id="active"
                    name="status"
                    value="active"
                    checked={formDeviceData.status === "active"}
                    onChange={handleDeviceDataChange}
                  />
                  <label htmlFor="active">Active</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="inactive"
                    name="status"
                    value="inactive"
                    checked={formDeviceData.status === "inactive"}
                    onChange={handleDeviceDataChange}
                  />
                  <label htmlFor="inactive">Inactive</label>
                </div>
                <label>
                  <b>Image</b>
                </label>
                <input
                  className="w3-input w3-border w3-margin-bottom"
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleDeviceDataChange}
                  required
                />

                <button
                  className="w3-button w3-block w3-blue w3-section w3-padding"
                  type="submit"
                >
                  Add Device
                </button>
              </div>
            </form>

            <div className="w3-container w3-border-top w3-padding-16 w3-light-grey">
              <button
                onClick={handleCloseAddDeviceDialog}
                type="button"
                className="w3-button w3-red"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add device modal end */}

      {filterTerm ? (
        filterLocations.length === 0 ? (
          <div className="my-5" style={{ width: "100%" }}>
            <center>
              <h1>No notes found.</h1>
            </center>
          </div>
        ) : (
          <div style={{ width: "100%", marginTop: "70px" }} className="m-5">
            <div className="container mx-auto mt-8 grid grid-cols-3 gap-8">
              {filterLocations.map((location) => (
                <div key={location._id} className="mb-4">
                  <div className=" p-8 bg-white items-right rounded-lg shadow-sm">
                    <h1 className="text-xl font-bold">
                      Location Name: {location.location_name}
                    </h1>
                    <p>Address: {location.address}</p>
                    <p>Phone no: {location.phone}</p>
                    <div
                      className="mt-2"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h6 style={{ fontWeight: "700" }}>
                        Devices: {location.devices.length}
                      </h6>
                      <p
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={() => {
                          handleAddDeviceClick(location._id);
                        }}
                      >
                        ADD <FontAwesomeIcon icon={faAdd} />
                      </p>
                    </div>
                    {location.devices.length > 0 && (
                      <div style={{ color: "blue", cursor: "pointer" }} onClick={() => { handleShowDevicesClick(location) }}>Show all devices</div>
                    )}
                    <div
                      className="mt-2"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontSize: "11px", color: "#333333" }}>
                        Created on: {formatDate(location.created_at)}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            handleUpdateLocationClick(
                              location._id,
                              location.location_name,
                              location.address,
                              location.phone
                            );
                          }}
                          className="btn-rounded text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm  me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteLocation(location._id);
                          }}
                          className="btn-rounded focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm  me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        <div style={{ width: "100%", marginTop: "70px" }} className="m-5">
          <div className="container mx-auto mt-8 grid grid-cols-3 gap-8">
            {locations.map((location) => (
              <div key={location._id} className="mb-4">
                <div className=" p-8 bg-white items-right rounded-lg shadow-sm">
                  <h1 className="text-xl font-bold">
                    Location Name: {location.location_name}
                  </h1>
                  <p>Address: {location.address}</p>
                  <p>Phone no: {location.phone}</p>
                  <div
                    className="mt-2"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h6 style={{ fontWeight: "700" }}>
                      Devices: {location.devices.length}
                    </h6>
                    <p
                      style={{ color: "blue", cursor: "pointer" }}
                      onClick={() => {
                        handleAddDeviceClick(location._id);
                      }}
                    >
                      ADD <FontAwesomeIcon icon={faAdd} />
                    </p>
                  </div>
                  {location.devices.length > 0 && (
                    <div style={{ color: "blue", cursor: "pointer" }} onClick={() => { handleShowDevicesClick(location) }}>Show all devices</div>
                  )}
                  <div
                    className="mt-2"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontSize: "11px", color: "#333333" }}>
                      Created on: {formatDate(location.created_at)}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          handleUpdateLocationClick(
                            location._id,
                            location.location_name,
                            location.address,
                            location.phone
                          );
                        }}
                        className="btn-rounded text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm  me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteLocation(location._id);
                        }}
                        className="btn-rounded focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm  me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ViewLocation;
