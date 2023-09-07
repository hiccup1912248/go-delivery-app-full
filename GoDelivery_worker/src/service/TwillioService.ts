import axio from 'axios';

// import { TWILLIO_URL } from "@env";
const TWILLIO_URL = 'https://verify-4723-skmzqg.twil.io';

const sendSMSVerfication = async (phoneNumber: string) => {
    try {
        const data = JSON.stringify({
            to: phoneNumber,
            channel: 'sms',
        });

        const response = await fetch(`${TWILLIO_URL}/start-verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
        });
        const json = await response.json();
        console.log('send sms json ===> ', json);
        return json.success;
    } catch (error) {
        return false;
    }
}

const checkVerification = async (phoneNumber: string, code: string) => {
    try {
        const data = JSON.stringify({
            to: phoneNumber,
            code: code,
        });
        const response = await fetch(`${TWILLIO_URL}/check-verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
        });
        const json = await response.json();
        console.log('check sms json ===> ', json);
        return json.success;
    } catch (error) {
        return false;
    }
}

export default {
    sendSMSVerfication,
    checkVerification,
};