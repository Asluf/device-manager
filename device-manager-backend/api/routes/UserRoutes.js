module.exports = function(app) {

    const UserController = require("../controllers/UserController");
    const upload = require('../middleware/upload');

    app.get('/getSearchLocation',UserController.getSearchLocation);

    app.post("/create", UserController.create);
    app.post("/addDevice/:id", upload.uploadDevice.single('image'), UserController.addDevice);
    app.delete("/removeLocation/:locationId", UserController.removeLocation);
    app.delete("/removeDevice/:deviceId", UserController.removeDevice);
    app.get('/getAll',UserController.getAllLocationsWithDevices);
    app.get('/getOne/:locationId', UserController.getOneLocationWithDevices)
    app.put('/updateLocation/:locationId', UserController.updateLocation)
    
};