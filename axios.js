const axios = require("axios").create({
    baseURL: "http://localhost:8080/fhir",
    headers: {
        "Content-Type": "application/json"
    }
})

module.exports = axios