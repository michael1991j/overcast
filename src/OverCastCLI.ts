
import {SchemaFactory} from './schemaFactory/SchemaFactory';
import {ModelFactory} from './modelFactory/ModelFactory'
import {ControllerFactory} from './controllerFactory/ControllerFactory'
import {configsTemplate} from './controllerFactory/templates/configTemplate'
import * as fs from 'fs'; 
import * as mustache from 'mustache';
import { json } from 'express';
export interface ICallback {
  ( ) : void;
}
export class OverCastCLI {
   constructor() {

  }
 
  public createSchema(config :any,cb: ICallback= function(){} ): void {
    let  factory: SchemaFactory = new SchemaFactory();
     factory.GenerateSchema(config);
     factory.Createtables(cb);
  }
  public GenerateModels(config :any): void {
    let  factory: ModelFactory = new ModelFactory();
     factory.GenerateModels(config);
     factory.outputClass();
  }

  public GenerateControllers(config :any): void {
    let  methodFactory: ModelFactory = new ModelFactory();
    methodFactory.GenerateModels(config);
    let  factory: ControllerFactory = new ControllerFactory();
     factory.GenerateControllers(methodFactory);
  }
  public GenerateConfig(config :any)
  {
    var beautify = require('js-beautify').js_beautify;
    let view :any ={
      config : JSON.stringify(config),
    }

    let classoutput :string = (mustache.render(configsTemplate, view));

    fs.writeFile("./config.ts",classoutput, function (err :any) {
      if (err) {
          return console.log(err);
      }

      console.log("The file was saved!");
  });
  

}
}

