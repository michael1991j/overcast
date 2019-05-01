// OVERCAST engine created by Michael Roberts
// THIS IS GENERATED CODE, BUT USER CODE CAN BE ADDED HERE
// FUNCTIONS IN THE  GENERATED CODE CAN BE OVERIDED HERE. :)

import * as mssql from "mssql";
import {
    ODataController,
    Edm,
    odata,
    ODataQuery
} from "odata-v4-server";
import {
    Overcast
} from "overcast";
import {
    SensorBox
} from "../../Models/SensorBox/SensorBox";
import {
    SensorBoxControllerAutoGen
} from "../SensorBox/SensorBoxControllerAutoGen";

import {
    Sensor
} from "../../Models/Sensor/Sensor";
import {
    SensorControllerAutoGen
} from "../Sensor/SensorControllerAutoGen";

import {
    Measurement
} from "../../Models/Measurement/Measurement";
import {
    MeasurementControllerAutoGen
} from "../Measurement/MeasurementControllerAutoGen";

@odata.type(Sensor)
export class SensorController extends SensorControllerAutoGen {
    constructor() {
        super();
    }

}