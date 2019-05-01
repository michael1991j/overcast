
export let ModelTemplate :string = `import { Edm, odata } from "odata-v4-server";
{{#dependencies}}
import { {{dependency}} } from "../{{dependency}}/{{dependency}}";
{{/dependencies}}


export class {{entityName}}{
   
   {{#properties}}
      {{#decorators}}
      {{decorator}}
    {{/decorators}}
    {{fieldName}} : {{type}};
    {{/properties}}

} `;
