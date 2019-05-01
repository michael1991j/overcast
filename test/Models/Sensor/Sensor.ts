import {
  Edm,
  odata
} from "odata-v4-server";
import {
  SensorBox
} from "../SensorBox/SensorBox";
import {
  Measurement
} from "../Measurement/Measurement";


export class Sensor {

  @Edm.Key
  @Edm.Guid
  SensorUID: string;
  @Edm.Nullable
  @Edm.Guid
  SensorGroupUID: string;
  @Edm.Nullable
  @Edm.Guid
  SerialNum: string;
  @Edm.Nullable
  @Edm.String
  SensorName: string;
  @Edm.Collection(Edm.EntityType(Measurement))
  Measurements: Measurement[];

}