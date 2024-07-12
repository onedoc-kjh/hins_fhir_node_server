const express = require('express')
const axios = require("../axios");
const router = express.Router()
const Treatment = require("../model/Treatment")

router.get("/:patientId", async (req, res) => {
    const treatmentList = await Treatment.find({Patient: req.params.patientId})
    const r = []

    const treatmentInfo = treatmentList.map(async t => {
        const subject = (await axios.get(`/Observation/${t.Observation[0]}`)).data
        const assessment = (await axios.get(`/Observation/${t.Observation[1]}`)).data

        r.push({
            subject: subject.valueString,
            assessment: assessment.valueString,
            createdAt: t.createdAt
        })
    })

    await Promise.all(treatmentInfo)
    res.json(r)
})

router.post('', async (req, res) => {
    try{
        const subject = req.body.subject
        const assessment = req.body.assessment
        const subjectFhir= (await axios.post("Observation", {
            "resourceType": "Observation",
            "valueString": subject,
            "code": { "text": "환자 호소" }
        })).data
        const assessmentFhir = (await axios.post("Observation", {
            "resourceType": "Observation",
            "valueString": assessment,
            "code": { "text": "진료 기록" }
        })).data

        await Treatment.create({
            Patient: req.body.patientId,
            Observation: [subjectFhir.id, assessmentFhir.id]
        })
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })

        res.json({success: true})
    }catch (e){
        console.log(e)
    }
})

module.exports = router