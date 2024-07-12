const express = require('express')
const router = express.Router()
const axios = require("../axios");
const Administration = require("../model/Administration")

router.get('/:patientId', async (req, res) => {
    const administration = await Administration.find({Patient: req.params.patientId})
    res.json({success: true})
})

router.post('/:patientId', async (req, res) => {
    try{
        const administrationFhir = req.body.entry[0].resource.entry
        const administrationIds = {}

        if (administrationFhir){
            const administrationSave = administrationFhir.map(async (administration) => {
                if (administration.resource.ingredient) delete administration.resource.ingredient
                if (administration.resource.subject) delete administration.resource.subject
                if (administration.resource.medicationReference) delete administration.resource.medicationReference
                if (administration.resource.performer) delete administration.resource.performer
                const r = await axios.post(`/${administration.resource.resourceType}`, administration.resource)

                if (r.data){
                    administrationIds[administration.resource.resourceType]
                        ? administrationIds[administration.resource.resourceType].push(r.data.id)
                        : administrationIds[administration.resource.resourceType] = [r.data.id]
                }
            })

            await Promise.all(administrationSave)

            await Administration.create({...{Patient: req.params.patientId}, ...administrationIds})
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