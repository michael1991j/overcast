import * as fs from 'fs';
import * as mustache from 'mustache';
import { ModelFactory } from '../modelFactory/ModelFactory'
import { Edm, } from 'odata-v4-metadata'
import { ServiceMetadata } from "odata-v4-service-metadata";
import { findTemplate } from "./templates/findTemplate"
import { findOneTemplate } from "./templates/findOneTemplate"
import { postTemplate} from './templates/postTemplate'
import { patchTemplate} from './templates/patchTemplate'
import { putTemplate} from './templates/putTemplate'
import { deleteTemplate} from './templates/deleteTemplate'

import { ControllerUserTemplate } from "./ControllerUserTemplate"

import { ControllerTemplate } from "./ControllerTemplate"
import {serverTemplate} from './templates/serverTemplate'

export class ControllerFactory {
    model: ModelFactory;
    schemetable :string = "";
    private generateFolders() {
        if (!fs.existsSync("./Controllers"))
            fs.mkdirSync("./Controllers");
        for (let key in this.model.Entities) {
            let path: string = "./Controllers/" + this.model.Entities[key].EntityName;
            if (!fs.existsSync(path))
                fs.mkdirSync(path);
        }

    }
    private findMethodGen( key :string)
    {
        let  scheme = "";
          //special case :) 
        if(this.model.config.db.scheme)
        {
            scheme= this.model.config.db.scheme + "].[";
        }    
        let view :any ={
            entity :key,
            scheme : scheme
        }
      
        return mustache.render(findTemplate, view);

    }
    private findOneMethodGen(key :string)
    {
        let view :any ={
            entity :key,
            entitykey: this.model.Entities[key].findKey(),
            scheme : this.schemetable
        }

        return mustache.render(findOneTemplate, view);
    }
    private postMethodGen(key :string) :string
    {
        let view :any ={
            entity :key,
            entitykey: this.model.Entities[key].findKey(),
            scheme : this.schemetable
        }
        return mustache.render(postTemplate, view);
    }
    private patchMethodGen(key :string) :string
    {
        let view :any ={
            entity :key,
            entitykey: this.model.Entities[key].findKey(),
            scheme : this.schemetable
        }
        return mustache.render(patchTemplate, view);
    }
    private putMethodGen(key :string) :string
    {
        let view :any ={
            entity :key,
            entitykey: this.model.Entities[key].findKey(),
            scheme : this.schemetable
        }
        return mustache.render(putTemplate, view);
    }
    private deleteMethodGen(key :string) :string
    {
        let view :any ={
            entity :key,
            entitykey: this.model.Entities[key].findKey(),
            scheme : this.schemetable
        }
        return mustache.render(deleteTemplate, view);
    }

    
    private outputClass() {
        let deps = [];
        for (let k in this.model.Entities) {
            deps.push({dependency : k})
        }
        for (let key in this.model.Entities) {
            var querystring = require('querystring');

        var beautify = require('js-beautify').js_beautify;
       


        let view :any ={
            entityName : key,
            dependencies : deps,
            find : querystring.escape(this.findMethodGen(key)),
            findOne :  querystring.escape(this.findOneMethodGen(key)),
            post :  querystring.escape(this.postMethodGen(key)),
            patch :  querystring.escape(this.patchMethodGen(key)),
            put :  querystring.escape(this.putMethodGen(key)),
            delete :  querystring.escape(this.deleteMethodGen(key))

        }

        let classoutput :string = querystring.unescape(mustache.render(ControllerTemplate, view));
        // user output
        let classoutputTe :string = querystring.unescape(mustache.render(ControllerUserTemplate, view));

       /* fs.writeFile('./Models/'+key+ "/" +key + ".ts", , { indent_size: 2 }), function (err :any) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });*/
        fs.writeFile('./Controllers/'+key+ "/" +key +"ControllerAutoGen" +".ts",beautify(classoutput), function (err :any) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
        // for customization generations
        if(fs.existsSync('./Controllers/'+key+ "/" +key + "Controller.ts"))
        {
            console.warn("SKIPPING File " + './Controllers/'+key+ "/" +key + "Controller.ts" + "already Exist");
            
        }
        else
        {
        fs.writeFile('./Controllers/'+key+ "/" +key + "Controller.ts",beautify(classoutputTe), function (err :any) {
            if (err) {
                return console.error(err);
            }

            console.log("The file was saved!");
        });
    }
    }
    }

    public GenerateControllers(factory: ModelFactory) {

        this.model = factory;
        if(this.model.config.db.scheme)
        {
            this.schemetable = this.model.config.db.scheme + ".";
        }    

        this.generateFolders();
        this.outputClass();
        this.serverTemplate();
    }
    public serverTemplate()
    {
        let deps = [];
        for (let k in this.model.Entities) {
            deps.push({dependency : k})
        }
        let view :any ={
            dependencies : deps,
 
        }
        var querystring = require('querystring');

        let classoutput :string = querystring.unescape(mustache.render(serverTemplate, view));
        //console.log(classoutput);
        fs.writeFile("./server.ts",classoutput, function (err :any) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    }

}