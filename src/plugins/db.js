import Localbase from "localbase";

const db = new Localbase("db_offline");

db.config.debug = process.env.NODE_ENV === "production" ? false : true;

export default db;
