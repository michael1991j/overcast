
export let configsTemplate : any =
`import * as fs from 'fs';
let content; 

if (fs.existsSync("./config.json")) {
 console.log("Using local Config  Files");
 let contents :any = fs.readFileSync("./config.json");
 let jsonContent = JSON.parse(contents);
 content = jsonContent; 
}
else
{
    console.log("Using default config file");
    content = {{{config}}};

}

export const config = content;
`










