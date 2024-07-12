const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
app.use(cors());

mongoose
    .connect("mongodb://localhost:27017/fhir", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Successfully connected to mongodb'))
    .catch(e => console.error(e));

app.use(express.json())

app.use('/checkup', require('./route/checkupRoute'))
app.use('/administration', require('./route/administrationRoute'))
app.use('/medical-chart', require('./route/medicalchartRoute'))
app.use('/reservation', require('./route/reservationRoute'))
app.use('/treatment', require('./route/treatmentRoute'))

app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});