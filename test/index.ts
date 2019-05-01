import * as express from "express";
import { Server } from "./server";

import {
    Overcast,
    getConvertedValue
} from "../src/index";

Overcast.launchServer(Server);