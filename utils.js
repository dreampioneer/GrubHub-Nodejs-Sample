import crypto from 'crypto'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config();

const issue_date=process.env.ISSUE_DATE

export const generateNonce = () => {
    const timestamp = Date.now() - issue_date; // Unix timestamp in seconds
    const randomChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';

    // Generate a random string of 8 characters
    for (let i = 0; i < 8; i++) {
        randomString += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }

    return `${timestamp}:${randomString}`;
}

export const calculateBodyHash = (requestBody) => {
    const sha256Hash = crypto.createHash('sha256').update(requestBody).digest();
    const base64Encoded = Buffer.from(sha256Hash, 'utf8').toString('base64');
    return base64Encoded;
}

export const buildNormalizedRequest = (nonce, requestMethod, requestPath, host, port, bodyHash, ext) => {
    const NEW_LINE = '\n';
    let normalizedRequest = '';

    normalizedRequest += nonce + NEW_LINE;
    normalizedRequest += requestMethod.toUpperCase() + NEW_LINE;
    normalizedRequest += requestPath + NEW_LINE;
    normalizedRequest += host.toLowerCase() + NEW_LINE;
    normalizedRequest += port + NEW_LINE;
    normalizedRequest += bodyHash + NEW_LINE;
    normalizedRequest += ext + NEW_LINE;

    return normalizedRequest;
}

export const generateHMAC_SHA256 = (secretKey, normalizedRequest) => {
    const hmac = crypto.createHmac('sha256', Buffer.from(secretKey, 'utf8'));
    hmac.update(Buffer.from(normalizedRequest, 'utf8'));
    return hmac.digest();
}

export const encodeToBase64 = (data) => {
    return Buffer.from(data,'utf-8').toString('base64');
}

export const requestAxios = ({host, path, method, nonce, mac, requestBody, bodyHash=''}) => {
    let data = JSON.stringify(requestBody);
    return new Promise((resolve, reject) => {
        let config = {
            method: method,
            maxBodyLength: Infinity,
            url: 'https://' + host + '/' + path,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': bodyHash ? `MAC id="${process.env.CLIENT_ID}",nonce="${nonce}",bodyhash="${bodyHash}",mac="${mac}"` : `MAC id="${process.env.CLIENT_ID}",nonce="${nonce}",mac="${mac}"`, 
                'X-GH-PARTNER-KEY': process.env.PARTNER_KEY,
            },
            data: data
        };
        
        axios.request(config)
            .then((response) => {
                resolve(response); 
            })
            .catch((error) => {
                reject(error);
            });
    })
}
