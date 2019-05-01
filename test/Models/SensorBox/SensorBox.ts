import {
  Edm,
  odata
} from "odata-v4-server";
import {
  Sensor
} from "../Sensor/Sensor";
import {
  Measurement
} from "../Measurement/Measurement";


export class SensorBox {

  @Edm.Key
  @Edm.Guid
  SerialNum: string;
  @Edm.Nullable
  @Edm.Decimal
  long: number;
  @Edm.Nullable
  @Edm.Decimal
  lat: number;
  @Edm.Nullable
  @Edm.String
  location: string;
  @Edm.Collection(Edm.EntityType(Sensor))
  sensors: Sensor[];

}