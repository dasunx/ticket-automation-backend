const busRoute = require("../models/bus-route");
const HttpError = require("../models/http-error");

const addBusRoute = async (req, res, next) => {
    const {name,route}=req.body;
    const newRoute=busRoute({name,route});
    try {
        newRoute.save();
    } catch (err) {
        const error = new HttpError(
            "Bus route has not been created",
            500
        );
        return next(error);
    }   
    
    res.status(201).json({ msg:"bus route has been created" });
  };

    
exports.addBusRoute=addBusRoute;