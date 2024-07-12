const express = require('express');
const router = express.Router();
const axios = require("../axios");
const Checkup = require("../model/Checkup");

router.get('/:patientId', async (req, res) => {
    const checkup = await Checkup.findOne({Patient: req.params.patientId})
    const patientInfo = (await axios.get(`/Patient/${checkup.Patient}`)).data
    const organizationInfo = (await axios.get(`/Organization/${checkup.Organization[0]}`)).data
    const practitionerInfo = (await axios.get(`/Practitioner/${checkup.Practitioner[0]}`)).data

    let socialNumber;
    patientInfo.identifier.forEach(identifier => {
        identifier.type.coding.forEach(coding => {
            if (coding.code === 'NNKOR') {
                socialNumber = identifier.value;
            }
        });
    });

    const observations = []
    let opinion
    const observationData = checkup.Observation.map(async (o) => {
        const observationInfo = (await axios.get(`/Observation/${o}`)).data
        console.log(JSON.stringify(observationInfo, null, 2))
        // console.log(observationInfo)
        if (observationInfo?.code?.text && observationInfo?.valueString){
            if(observationInfo.code.text == '키' || observationInfo.code.text == '몸무게') {
                observations.unshift({[observationInfo.code.text]: observationInfo.valueString})
            }else if(observationInfo.code.text == '종합소견_생활습관관리'){
                opinion = {[observationInfo.code.text]: observationInfo.valueString}
            }else{
                observations.push({[observationInfo.code.text]: observationInfo.valueString})
            }
        }
    })

    await Promise.all(observationData)
    observations.push(opinion)

    const r = {
        patientName: patientInfo.name[0].text,
        socialNumber: socialNumber,
        hospitalName: organizationInfo.name,
        doctorName: practitionerInfo.name[0].text,
        observations: observations
    }
    res.json(r)
})

router.post('', async (req, res) => {
    try {
        const patientFhir = req.body.entry[0].resource.entry[0].resource
        let checkup = {}
        if(patientFhir){
            const r = await axios.post(`/Patient`, patientFhir)
            const patientId = r.data.id
            if (patientId){
                checkup['Patient'] = patientId
                const observationList = req.body.entry[0].resource.entry[1].resource.contained
                const observationIds = {}
                const observationSave = observationList.map(async (observation) => {
                    if (observation.hasMember) delete observation.hasMember
                    const r = await axios.post(`/${observation.resourceType}`, observation)
                    if (r.data){
                        observationIds[observation.resourceType]
                            ? observationIds[observation.resourceType].push(r.data.id)
                            : observationIds[observation.resourceType] = [r.data.id]
                    }
                })

                await Promise.all(observationSave)
                checkup = {...checkup, ...observationIds}
            }
        }

        await Checkup.create(checkup)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })

        res.json(checkup.Patient)
    }catch (e){
        console.log(e.data)
    }
})

module.exports = router