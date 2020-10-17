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
const getBusRouteById = async (req, res, next) => {
    const {rid}=req.params;
    let selectedRoute;
    try {
        selectedRoute =await busRoute.findById(rid);
      } catch (err) {
        const error = new HttpError(
          'Something went wrong on server side. Please try again later!!',
          500
        );
        return next(error);
      }
      if(!selectedRoute){
        const error = new HttpError(
            'No route found for the give id',
            500
          );
          return next(error);
      }
    
    res.status(201).json({ route:selectedRoute });
  };

  const getAllRoutes = async (req, res, next) => {
    let routes;
    try {
      routes = await busRoute.find();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong on server side. Please try again later!!',
        500
      );
      return next(error);
    }
    if (!routes) {
      const error = new HttpError('0 routes found', 500);
      return next(error);
    }
    res.status(201).json({
      routes: routes.map((r) => r.toObject({ getters: true })),
    });
  };

    
exports.addBusRoute=addBusRoute;
exports.getBusRouteById=getBusRouteById;
exports.getAllRoutes=getAllRoutes;