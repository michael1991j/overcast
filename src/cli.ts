#! /usr/bin/env node
import {OverCastCLI} from './index'
import  * as fs from 'fs';  
console.log("starting  overcast Generator Engine !!");

var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
let a : OverCastCLI = new OverCastCLI();

var program = require('commander');
program
  .version('0.1.0')
  .option('-g, --generater', 'generates the code')
  .option('-c, --createschema', 'creates the schema')
  .parse(process.argv);
if(program.createschema)
{
  a.createSchema(config);
}
else if(program.generater)
{
a.GenerateModels(config);
a.GenerateControllers(config);
a.GenerateConfig(config);
}
else
{
 console.log("outputing help");
}