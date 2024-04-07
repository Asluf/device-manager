const { Location } = require("../models/LocationModel");
const { Device } = require("../models/DeviceModel");

exports.create = async (req, res) => {
    console.log("working");

    const { location_name, address, phone} = req.body;

    try {
        const location = new Location({
            location_name,
            address,
            phone
        });

        const savedLocation = await location.save();

        if (savedLocation) {
            return res.status(200).json({ message: "Location saved successfully.", data: savedLocation });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

exports.addDevice = async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: "No file uploaded." });
    }
    const { id } = req.params;
    const { serial_no, type, status } = req.body;

    try {
        const location = await Location.findById(id);
        if (!location) {
            return res.status(404).json({ error: "Location not found." });
        }

        const newDevice = new Device({
            serial_no,
            type,
            image: file.path,
            status
        });

        const savedDevice = await newDevice.save();

        location.devices.push(savedDevice._id);

        await location.save();

        return res.status(200).json({ message: "Device added to location successfully.", data: location });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

exports.removeLocation = async (req, res) => {
    const { locationId } = req.params; 

    try {
        const deletedLocation = await Location.findByIdAndDelete(locationId);
        if (!deletedLocation) {
            return res.status(404).json({ error: "Location not found." });
        }

        return res.status(200).json({ message: "Location removed successfully.", data: deletedLocation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

exports.removeDevice = async (req, res) => {
    const { deviceId } = req.params; 

    try {
        const deletedDevice = await Device.findByIdAndDelete(deviceId);
        if (!deletedDevice) {
            return res.status(404).json({ error: "Device not found." });
        }

        const location = await Location.findOneAndUpdate(
            { devices: deviceId },
            { $pull: { devices: deviceId } },
            { new: true }
        );

        if (!location) {
            return res.status(200).json({ message: "Device removed successfully." });
        }

        await location.save();

        return res.status(200).json({ message: "Device removed successfully.", data: location });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

exports.getAllLocationsWithDevices = async (req, res) => {
    try {
        const locations = await Location.find().populate('devices').exec();

        res.status(200).json({ message: "Got all the location with devices successfully.", data: locations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getSearchLocation = async (req, res) => {
    const { location_name } = req.query; 
    try {
        const locations = await Location.find({ location_name: { $regex: new RegExp(location_name, 'i') } }).populate('devices').exec();

        res.status(200).json({ message: "Found matching locations with devices successfully.", data: locations });
    } catch (error) {
        console.error('Error searching locations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getOneLocationWithDevices = async (req, res) => {
    try {
        const { locationId } = req.params;

        const location = await Location.findById(locationId).populate('devices').exec();

        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }

        res.status(200).json({ message: "Got the location with devices successfully.", data: location });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateLocation = async (req, res) => {
    const { locationId } = req.params; 
    const { location_name, address, phone } = req.body; 

    try {
        // Find the location by ID and update its details
        const updatedLocation = await Location.findByIdAndUpdate(locationId, {
        location_name,
        address,
        phone
        }, { new: true });

        if (!updatedLocation) {
        return res.status(404).json({ error: 'Location not found' });
        }

        res.status(200).json({ message: "Location updated successfully.", data: updatedLocation });
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


