export let serverTemplate :string = 
`import {  ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
 import {OvercastServer}  from "overcast";
{{#dependencies}}
import { {{dependency}}Controller } from "./Controllers/{{dependency}}/{{dependency}}Controller";
{{/dependencies}}

{{#dependencies}}
@odata.controller({{dependency}}Controller,true)
{{/dependencies}}
@odata.namespace("inipop")
export class Server extends OvercastServer {

}`;