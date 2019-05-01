export let ControllerUserTemplate :string = `
// OVERCAST engine created by Michael Roberts
// THIS IS GENERATED CODE, BUT USER CODE CAN BE ADDED HERE
// FUNCTIONS IN THE  GENERATED CODE CAN BE OVERIDED HERE. :)

import * as mssql from "mssql";
import { ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import {Overcast  } from "overcast";
{{#dependencies}}
import { {{dependency}} } from "../../Models/{{dependency}}/{{dependency}}";
import { {{dependency}}ControllerAutoGen } from "../{{dependency}}/{{dependency}}ControllerAutoGen";

{{/dependencies}} 
@odata.type({{entityName}})
export class {{entityName}}Controller extends  {{entityName}}ControllerAutoGen {
    constructor() { super(); }

}`;