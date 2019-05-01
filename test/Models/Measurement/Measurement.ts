import {
  Edm,
  odata
} from "odata-v4-server";
import {
  SensorBox
} from "../SensorBox/SensorBox";
import {
  Sensor
} from "../Sensor/Sensor";


export class Measurement {

  @Edm.Key
  @Edm.Int64
  Id: number;
  @Edm.Nullable
  @Edm.Guid
  SensorUID: string;
  @Edm.Nullable
  @Edm.DateTimeOffset
  EntryDate: Date;
  @Edm.Nullable
  @Edm.Double
  EntryValue: number;

}