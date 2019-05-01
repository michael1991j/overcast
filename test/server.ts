import {  ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
 import {OvercastServer}  from "overcast";
import { SensorBoxController } from "./Controllers/SensorBox/SensorBoxController";
import { SensorController } from "./Controllers/Sensor/SensorController";
import { MeasurementController } from "./Controllers/Measurement/MeasurementController";

@odata.controller(SensorBoxController,true)
@odata.controller(SensorController,true)
@odata.controller(MeasurementController,true)
@odata.namespace("inipop")
export class Server extends OvercastServer {

}