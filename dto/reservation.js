class ReservationDto {
    constructor(
        Name, SocialNumber, Subject, createdAt, AppId, Channel, PatientId
    ) {
        this.Name = Name;
        this.SocialNumber = SocialNumber;
        this.Subject = Subject;
        this.createdAt = createdAt;
        this.AppId = AppId;
        this.Channel = Channel;
        this.PatientId = PatientId;

    }

    toJson() {
        return {
            Name: this.Name,
            SocialNumber: this.SocialNumber,
            Subject: this.Subject,
            createdAt: this.createdAt,
            AppId: this.AppId,
            Channel: this.Channel,
            PatientId: this.PatientId,
        }
    }
}

module.exports = ReservationDto