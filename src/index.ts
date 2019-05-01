
import * as express from "express";
import * as sql from "mssql";
import { parse, convert, Options, EntitySet } from 'odata2openapi';
import { ODataServer, ODataController, Edm, odata, ODataQuery } from "odata-v4-server";
import { OverCastCLI } from "./OverCastCLI";
export { OverCastCLI };

export interface ICallback {
    (): void;
}
async function connect(dbconfig: any): Promise<sql.ConnectionPool> {
    connection = new sql.ConnectionPool(dbconfig);
    return await connection.connect();
}

let connection: sql.ConnectionPool = null;

export class OvercastServer extends ODataServer {

    public Checkschema(config, cb: ICallback) {
        let a: OverCastCLI = new OverCastCLI();
        a.createSchema(config, cb);

    }

    public StartupWithAuth(config) {


    }
}



export class Overcast {
    constructor(public x: number, public y: number) { }
    static launchServer(Odateserver: any, config: any = {}) {
        var app = express();
        var passport = require("passport");
        var BearerStrategy = require('passport-azure-ad').BearerStrategy;

        app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        let oauthisenabled = false;
        let keyauthisenabled = false;
        let keys = [];
        let obj: any = Odateserver.$metadata();

        //obj.edmx.dataServices.schemas[0].entityTypes[2]
        let hostname = 'localhost:3000';
        let contextPath = '/';
        if (config.global) {
            if (config.global.contextPath) {
                contextPath = config.global.contextPath;
            }
            if (config.global.hostname) {
                hostname = config.global.hostname;
            }

            if (config.global.oAuth) {
                if (config.global.oAuth.enabled!= null) {
                    oauthisenabled = config.global.oAuth.enabled;
                }
                else {
                    oauthisenabled = true;
                }
                if (oauthisenabled) {
                    if (config.global.oAuth.options) {

                        var bearerStrategy = new BearerStrategy(config.global.oAuth.options,
                            function (token, done) {
                                // Send user info using the second argument
                                done(null, {}, token);
                            }
                        );
                        app.use(passport.initialize());
                        passport.use(bearerStrategy);
                    }
                    else {
                        console.log("missing options for oauth");
                        process.exit(-1);

                    }
                }
            }
            if (config.global.serviceAuth) {
                keyauthisenabled = true;
                if (config.global.serviceAuth.enabled!= null) {
                    keyauthisenabled = config.global.serviceAuth.enabled
                }
                else {
                    keyauthisenabled = true;
                }
                if (keyauthisenabled) {
                    if (config.global.serviceAuth.keys) {
                        keys = config.global.serviceAuth.keys;
                    }
                    else {
                        console.log("missing keys for serviceauth");
                        process.exit(-1);

                    }

                }
            }
        }
        const options: Options = {
            host: hostname,
            basePath: contextPath
        };
        parse(obj.data)
            .then(service => convert(service.entitySets, options))
            .then(swagger => {

                const swaggerUi = require('swagger-ui-express');

                app.use(contextPath + 'api-docs', swaggerUi.serve, swaggerUi.setup(JSON.parse(JSON.stringify(swagger, null, 2))));




                if (oauthisenabled == true) {
                    app.use(contextPath,

                        (req, res, next) => {
                            passport.authenticate('oauth-bearer', { session: false }, function (err, user, info) {
                                if (err) {
                                    return res.status(401).json(err);
                                }
                                if (user == false) {
                                    // checking keys
                                    if (keyauthisenabled && req.headers.authorization) {
                                        if (keys.indexOf(req.headers.authorization) != -1) {
                                            return next();
                                        }
                                        else {
                                            return res.status(401).json({ access: "denied" });
                                        }

                                    }


                                    return res.status(401).json({ access: "denied" });

                                }

                                return next();

                            })(req, res)

                        }, Odateserver.create());


                    // with  key check
                }
                else if (keyauthisenabled == true) {
                    app.use(contextPath, (req, res, next) => {
                        if (keyauthisenabled && req.headers.authorization) {

                            if (keys.indexOf(req.headers.authorization) != -1) {
                                return next();
                            }
                            else {
                                return res.status(401).json({ access: "denied" });
                            }
                        }
                        return res.status(401).json({ access: "denied" });
                    }, Odateserver.create());

                }
                else {
                    // no auth
                    app.use(contextPath, Odateserver.create());
                }
                var server = app.listen(3000, function () {

                    var host = server.address().address;
                    var port = server.address().port;

                    console.log(' app  is listening at http://%s:%s', host, port);

                });

            }
            )
            .catch(error => console.error(error))
    }
    static filterNullValues(item: any) {
        const newItem = {};
        Object.keys(item)
            .filter(key => item[key] !== null)
            .forEach(key => newItem[key] = item[key]);
        return newItem;
    }
    static getConvertedValue(par: any): string {
        if (par === true || par === "true") { return '1'; }
        if (par === false || par === "false") { return '0'; }
        if (typeof par === "string") { return "'" + par + "'"; }
        return String(par);
    }
    static convertResults(data: any): any {
        const rows: any[] = (Array.isArray(data)) ? data : [data];
        return rows.map(row =>
            Object.assign({}, this.filterNullValues(row))
        );
    }
    static async newRequest(config: any): Promise<sql.Request> {
        connection = await connect(config.db);
        return await connection.request();

    }

    static async request(config: any): Promise<sql.Request> {
        if (connection == null)
            connection = await connect(config.db);
        if (!connection.connected)
            connection = await connect(config.db);

        return await connection.request();

    }
}