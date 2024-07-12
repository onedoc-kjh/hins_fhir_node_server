const express = require('express')
const router = express.Router()
const Reservation = require("../model/Reservation")
const ReservationDto = require("../dto/reservation");

router.post('', async (req, res) => {
    try {
        await Reservation.create(req.body)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })

        res.json({success: true})
    }catch (e) {
        console.log(e.data)
    }
})

router.get('/:Name', async (req, res) => {
    try {
        const reservationList = await Reservation.find({Name: req.params.Name})
        const r = [];
        const mapping = reservationList.map(reservation => {
            const reservationDto = new ReservationDto(reservation.Name, reservation.SocialNumber, reservation.Subject, reservation.createdAt, reservation.AppId, reservation.Channel, reservation.PatientId)
            r.push(reservationDto.toJson())
        })

        await Promise.all(mapping)

        res.json(r)

    }catch (e){
        console.log(e)
    }
})

router.get('', async (req, res) => {
    try {
        const reservationList = await Reservation.find()
        const r = [];
        const mapping = reservationList.map(reservation => {
            const reservationDto = new ReservationDto(reservation.Name, reservation.SocialNumber, reservation.Subject, reservation.createdAt, reservation.AppId, reservation.Channel, reservation.PatientId)
            r.push(reservationDto.toJson())
        })

        await Promise.all(mapping)

        res.json(r)

    }catch (e){
        console.log(e)
    }
})

module.exports = router