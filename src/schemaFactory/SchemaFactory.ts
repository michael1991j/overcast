import * as fs from 'fs';
import { Edm } from 'odata-v4-metadata'
import * as sql from "mssql";

import { ServiceMetadata } from "odata-v4-service-metadata";
import { String } from 'odata-v4-server/build/lib';
import { Overcast } from '../index';
export interface ICallback {
    ( ) : void;
  }
class Fields {
    fieldname: string;
    isOdatakey: boolean = false;
    odatatype: string;
    nullable: boolean = false;
    getSQLtype() {
        if (this.odatatype == "Edm.String") {
            return "NVARCHAR(MAX)";
        }
        if (this.odatatype == "Edm.Boolean") {
            return "BIT";

        } else if (this.odatatype == "Edm.Binary") {
            return "BINARY(1000)";

        } else if (this.odatatype == "Edm.Byte") {
            return "BINARY(1)";

        } else if (this.odatatype == "Edm.Date") {
            return "DATETIME  DEFAULT  CURRENT_TIMESTAMP";

        } else if (this.odatatype == "Edm.DateTimeOffset") {
            return "DATETIME  DEFAULT  CURRENT_TIMESTAMP";

        } else if (this.odatatype == "Edm.Decimal") {
            return "DECIMAL";

        } else if (this.odatatype == "Edm.Double") {
            return "DECIMAL";

        } else if (this.odatatype == "Edm.Duration") {
            return "INT";

        } else if (this.odatatype == "Edm.Int64") {
            return "INT";

        } else if (this.odatatype == "Edm.Guid") {
            return "UniqueIdentifier";

        }
        else {
            console.log("dont know this type")
            process.exit(1);
        }


    }
    toSQL(): string {
        let unique: string = "";
        if (this.isOdatakey)
            unique = " NOT NULL UNIQUE";
        if (this.fieldname == "Id")
            return "";

        return this.fieldname + " " + this.getSQLtype() + unique + ",";
    }
    getIndexSQLField(tablename: string): string {

        return "Id INT IDENTITY(1,1) CONSTRAINT pk_" + tablename + " PRIMARY KEY";

    }

}
interface HashTable<T> {
    [key: string]: T;
}
class Table {
    tablename: string;
    fields: HashTable<Fields> = {};
    constructor(public schema:string = "")
    {

    }
    toSQL(): string {

        let fieldsofsql: string = ""
        for (let f in this.fields) {
            fieldsofsql += this.fields[f].toSQL() + "\n";
        }


        return `CREATE TABLE `+ this.schema + this.tablename + ` (
        `+ fieldsofsql + this.fields[this.findKey()].getIndexSQLField(this.tablename) + `)  ON [PRIMARY];`;
    }
    findKey(): string {
        for (let f in this.fields) {
            if (this.fields[f].isOdatakey) return this.fields[f].fieldname;
        }
        return "";
    }
}

export class SchemaFactory {

    private Tables: HashTable<Table> = {};
    private config: any;

    // gets tables in statabase 
    public async requestTables(r: sql.Request): Promise<sql.IResult<any>> {
        return await r.query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'");
    }

    public async Createtables(cb:ICallback = function(){}) {
        const request = await Overcast.request(this.config);
        // creates schems
            if(this.config.db.scheme)
            {
                await request.query(`IF NOT EXISTS ( SELECT  *
                    FROM    sys.schemas
                    WHERE   name = N'`+this.config.db.scheme+`' ) 
        EXEC('CREATE SCHEMA [`+this.config.db.scheme+`] AUTHORIZATION [dbo]');
    `);


            }
        let rows = await this.requestTables(request);
        let tables: Array<string> = [];
        for (let i = 0; i < rows.recordsets[0].length; i++)
            tables.push(rows.recordsets[0][i]["TABLE_NAME"]);

        for (let f in this.Tables) {
            if (tables.indexOf(this.Tables[f].tablename) > -1) {
                console.log("table exists !!!");

            }
            else {
                console.log("creating table");
                console.log(this.Tables[f].toSQL());

                await request.query(this.Tables[f].toSQL());

            }

        }
        cb();
        return;
    }



    public GenerateSchema(config: any) {
        this.config = config;
        let schemetable   = ""
        if(this.config.db.scheme)
        {
            schemetable = this.config.db.scheme + ".";
        }    
        var scheme = JSON.parse(fs.readFileSync(config.scheme, 'utf8'));
        let model: ServiceMetadata = ServiceMetadata.processMetadataJson(scheme);

        for (let schema of model.edmx.dataServices.schemas) {
            for (let entity of schema.entityTypes) {
                let tablename: string = entity.name;
                this.Tables[tablename] = new Table(schemetable);
                this.Tables[tablename].tablename = tablename;
                for (let properties of entity.properties) {
                    let f: Fields = new Fields();
                    f.fieldname = properties.name;
                    f.odatatype = properties.type;
                    f.nullable = properties.nullable;
                    this.Tables[tablename].fields[f.fieldname] = f;
                }
                for (let ref of entity.key.propertyRefs) {
                    this.Tables[tablename].fields[ref.name].isOdatakey = true;
                }
            }

        }


    }

}