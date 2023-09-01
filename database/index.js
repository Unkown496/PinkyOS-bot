import { loadJson } from '../helpres/load.js';
import { __dirname } from '../namespaces.js';

import { Sequelize } from 'sequelize';

import dotenv from "dotenv";

dotenv.config();
const {
    db
} = process.env;

const sequelize = new Sequelize(db);


export default sequelize;