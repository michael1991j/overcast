import * as fs from 'fs';
import * as mustache from 'mustache';

import { Edm, } from 'odata-v4-metadata'
import { ModelTemplate } from './ModelTemplate'
import { ServiceMetadata } from "odata-v4-service-metadata";
import { type } from 'os';

export class Fields {
    fieldname: string;
    isOdatakey: boolean = false;
    odatatype: string;
    nullable: boolean = false;

}
export interface HashTable<T> {
    [key: string]: T;
}
export class Entity {
    EntityName: string;
    fields: HashTable<Fields> = {};
    navigation: HashTable<Fields> = {};
    findKey() :string
    {
        for( let f in this.fields )
        {
           if( this.fields[f].isOdatakey) return this.fields[f].fieldname; 
        }
        return "";
    }
}

export class ModelFactory {
    public config; 

     Entities: HashTable<Entity> = {};
    private GenerateFolders() {
        if (!fs.existsSync("./Models"))
            fs.mkdirSync("./Models");
        for (let key in this.Entities) {
            let path: string = "./Models/" + this.Entities[key].EntityName;
            if (!fs.existsSync(path))
                fs.mkdirSync(path);
        }

    }
    private gettype(type: string): string {
        if (type == "Edm.String") {
            return "string";
        }
        if (type == "Edm.Boolean") {
            return "boolean";

        } else if (type == "Edm.Binary") {
            return "buffer";

        } else if (type == "Edm.Byte") {
            return "buffer";

        } else if (type == "Edm.Date") {
            return "Date";

        } else if (type == "Edm.DateTimeOffset") {
            return "Date";

        } else if (type == "Edm.Decimal") {
            return "number";

        } else if (type == "Edm.Double") {
            return "number";

        } else if (type == "Edm.Duration") {
            return "number";

        } else if (type == "Edm.Int64") {
            return "number";

        } else if (type == "Edm.Guid") {
            return "string";

        }
        else {
            console.log("dont know this type")
        }
    }


    private generateDecorators(field: Fields): any {
        let decorators: Array<any> = [];

        if (field.isOdatakey) {
            decorators.push({ decorator: "@Edm.Key" })
        }
        else
            if (field.nullable) {
                decorators.push({ decorator: "@Edm.Nullable" })
            }
            decorators.push({decorator : "@"+ field.odatatype})
        return decorators;

    }

    private generateFields(entity: Entity) {
        let properties: Array<any> = [];
        for (let fieldk in entity.fields) {
            let field = entity.fields[fieldk];

            let property = {
                fieldName: field.fieldname,
                type: this.gettype(field.odatatype),
                decorators: this.generateDecorators(field)
            }

            properties.push(property)

        }
        for (let fieldk in entity.navigation) {
            let field = entity.navigation[fieldk];

            let classstruct: string = field.odatatype.replace('Collection(', '').replace(')', '');
            let parts: Array<string> = classstruct.split('.')
            let property = {
                fieldName: field.fieldname,

                type: parts[parts.length - 1] + "[]",
                decorators:
                    [
                        { decorator: "@Edm.Collection(Edm.EntityType(" + parts[parts.length - 1] + "))" }
                    ]
            }

            properties.push(property)

        }
        return properties;
    }


    public outputClass() {
        this.GenerateFolders();

        for (let key in this.Entities) {
            let model = this.Entities[key];
            let deps = [];
            for (let k in this.Entities) {
                if(k != key)
                deps.push({dependency : k})
            }
            let view = {
                entityName: key,
                dependencies :deps,

                properties: this.generateFields(model)


            }

            var beautify = require('js-beautify').js_beautify;

            fs.writeFile('./Models/'+key+ "/" +key + ".ts", beautify(mustache.render(ModelTemplate, view), { indent_size: 2 }), function (err :any) {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });

        }
    }
    public GenerateModels(  config: any) {
    this.config = config;
        var scheme = JSON.parse(fs.readFileSync(config.scheme, 'utf8'));
        let model: ServiceMetadata = ServiceMetadata.processMetadataJson(scheme);

        for (let schema of model.edmx.dataServices.schemas) {
            for (let entity of schema.entityTypes) {
                let EntityName: string = entity.name;
                this.Entities[EntityName] = new Entity();
                this.Entities[EntityName].EntityName = EntityName;
                for (let properties of entity.properties) {
                    let f: Fields = new Fields();
                    f.fieldname = properties.name;
                    f.odatatype = properties.type;
                    f.nullable = properties.nullable;
                    this.Entities[EntityName].fields[f.fieldname] = f;
                }
                for (let ref of entity.key.propertyRefs) {
                    this.Entities[EntityName].fields[ref.name].isOdatakey = true;
                }
                for (let nav of entity.navigationProperties) {
                    let f: Fields = new Fields();
                    f.fieldname = nav.name;
                    f.odatatype = nav.type;
                    f.nullable = nav.nullable;
                    this.Entities[EntityName].navigation[f.fieldname] = f;
                }


            }

        }
    }

}