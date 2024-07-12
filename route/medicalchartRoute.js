const express = require('express')
const router = express.Router();
const axios = require("../axios");
const MedicalChart = require('../model/MedicalChart')

router.get('/:patientId', async (req, res) => {
    const medicalchart = await MedicalChart.find({Patient: req.params.patientId})
    res.json({success: true})
})

router.post('/:patientId', async (req, res) => {

    try{
        const medicalchartFhir = req.body.entry[0].resource.entry
        const medicalchartIds = {}

        if (medicalchartFhir){
            const medicalchartSave = medicalchartFhir.map(async (medicalchart) => {
                if (medicalchart.resource.provider) delete medicalchart.resource.provider
                if (medicalchart.resource.patient) delete medicalchart.resource.patient
                if (medicalchart.resource.insurer) delete medicalchart.resource.insurer
                const r = await axios.post(`/${medicalchart.resource.resourceType}`, medicalchart.resource)

                if (r.data){
                    medicalchartIds[medicalchart.resource.resourceType]
                        ? medicalchartIds[medicalchart.resource.resourceType].push(r.data.id)
                        : medicalchartIds[medicalchart.resource.resourceType] = [r.data.id]
                }
                // console.log(medicalchart.resource.resourceType, JSON.stringify(medicalchart.resource, null, 2))
            })

            await Promise.all(medicalchartSave)

            await MedicalChart.create({...{Patient: req.params.patientId}, ...medicalchartIds})
                .then(res => {
                    console.log(res)
                })
                .catch(err => {
                    console.log(err)
                })
        }
        res.json({success: true})
    }catch (e){
        console.log(e.data)
    }
})

module.exports = router