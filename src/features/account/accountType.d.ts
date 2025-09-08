export interface PersonalInfoStateType {
    lastname?: string;
    firstname?: string;
    fullname?: string;
    image?: string;
    gender?: string;
    dob?: Date;
}

export interface VerifyInfoStateType {
    username?: string;
    not_edit_username?: string;
    email?: string;
    telephone?: string;
    email_confirm?: string;
    telephone_confirm?: string;
}

export interface SocialLinkStateType {
    id_google?: string;
    id_facebook?: string;
    id_apple?: string;
    id_zalo?: string;
}

export interface CustomerInfoStateType {
    personalInfo: PersonalInfoStateType | null;
    verifyInfo: VerifyInfoStateType | null;
    socialLink: SocialLinkStateType | null;
    statusCustomerInfo?: string;
    statusPutCustomerInfo?: string;
    message?: string;
}

export interface CustomerAccumulatedStateType {
    point?: {
        score?: any;
        loyal_name?: string;
    } | null;
    statusPoint?: string;
    message?: string;
}

export interface AccountState {
    customerInfo: CustomerInfoStateType;
    customerAccumulated: CustomerAccumulatedStateType;
    register: {
        telephone_?: string;
        statusRegister?: string;
        message?: string;
    };
}
