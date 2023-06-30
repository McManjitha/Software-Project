require('dotenv').config();
const { CLUSTER, DB_NAME, DB_PWD, DB_USER } = process.env;


const uri = `mongodb+srv://${DB_USER}:${DB_PWD}@${CLUSTER}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;


module.exports = uri;