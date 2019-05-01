import * as fs from 'fs';
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
    content = {"scheme":"scheme.json","db":{"server":"sensorbox.database.windows.net","database":"sensorboxexample","user":"michael","password":"R0bot123","options":{"encrypt":true},"port":1433,"stream":false,"parseJSON":false}};

}

export const config = content;
