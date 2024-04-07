import axios from "axios";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";


const ViewDevices = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const deleteDevice = (deviceId) => {
    axios
      .delete(`http://localhost:5000/api/removeDevice/${deviceId}`, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Device deleted successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/');
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  try {
    const locationDetails = location.state.locationDetails;

    return (
      <div className="p-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <caption class="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
              Location: {locationDetails.location_name} <span className="ml-5">Phone: {locationDetails.phone}</span>
              <p class="mt-1 text-md font-normal text-gray-500 dark:text-gray-400">Address: {locationDetails.address}</p>
            </caption>
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-16 py-3">
                  Image
                </th>
                <th scope="col" className="px-6 py-3">
                  Serial No
                </th>
                <th scope="col" className="px-6 py-3">
                  Device type
                </th>
                <th scope="col" className="px-6 py-3">
                  Device Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {locationDetails.devices.map((device) => (
                <tr key={device._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="p-4 justify-center">
                    <img src={`http://localhost:5000/${device.image}`} className="w-40 h-40 rounded-full" alt={device.serial_no} />
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {device.serial_no}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {device.type}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {device.status === 'active' ?
                      <div class="flex items-center">
                        <div class="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div> Active
                      </div>
                      : <div class="flex items-center">
                        <div class="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div> Inactive
                      </div>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-white bg-red hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" onClick={()=>deleteDevice(device._id)}> <FontAwesomeIcon icon={faTrash} className="me-2" /> Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    );
  } catch (e) {
    return (
      <div>
        <h2>Devices</h2>
        <table>No devices found</table>
      </div>
    );
  }
};

export default ViewDevices;
