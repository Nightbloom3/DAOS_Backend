export class UpdateNewsletterProfileDTO {

    readonly newsletter: boolean;

    constructor(newsletter: boolean) {
        this.newsletter = newsletter;
    }
    
}