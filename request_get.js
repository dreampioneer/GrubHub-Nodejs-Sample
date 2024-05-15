const crypto = require('crypto')
const axios = require('axios')
const client_id='sv:v1:23d6fcc0-7e66-11ee-a477-b1bd807b989e'
const secret_key="0Av0v9d2lb0RlOmkYXGYsiILpyP_apOHPzlKf9q9JB4"
const issue_date='1699468764812'
const partner_key='q8G3IH5lEe63IeW7ed3EMQ'

function generateNonce(){
    const timestamp = Date.now() - issue_date; // Unix timestamp in seconds
    console.log("Date.now()", Date.now());
    console.log("issue_date", issue_date);
    const randomChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';

    // Generate a random string of 8 characters
    for (let i = 0; i < 8; i++) {
        randomString += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }

    return `${timestamp}:${randomString}`;
}

function calculateBodyHash(requestBody) {
    const sha256Hash = crypto.createHash('sha256').update(requestBody).digest('hex');
    const base64Encoded = Buffer.from(sha256Hash).toString('base64');
    return base64Encoded;
}

function buildNormalizedRequest(nonce, requestMethod, requestPath, host, port, bodyHash, ext) {
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

function generateHMAC_SHA256(secretKey, normalizedRequest) {
    const hmac = crypto.createHmac('sha256', Buffer.from(secretKey, 'utf8'));
    hmac.update(Buffer.from(normalizedRequest, 'utf8'));
    return hmac.digest();
}

function encodeToBase64(data) {
    return Buffer.from(data,'utf-8').toString('base64');
}

const path= "pos/v1/merchant/10017291208/menu/schedules/overrides"
const requestMethod= "GET"
const requestPath= "/pos/v1/merchant/10017291208/menu/schedules/overrides"
const host= "api-third-party-gtm-pp.grubhub.com"
const port= "443"
const nonce= generateNonce()
const bodyHash= calculateBodyHash('')

const normalizedRequest = buildNormalizedRequest(nonce, requestMethod, requestPath, host, port, '', '')
const sha256Hmac = generateHMAC_SHA256(secret_key, normalizedRequest);
const mac = encodeToBase64(sha256Hmac);

console.log('nonce', nonce)
console.log('bodyHash', bodyHash)
console.log('normalizedRequest', normalizedRequest)
console.log('sha256Hmac', sha256Hmac)
console.log('mac', mac)
// return
let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://' + host + '/' + path,
    headers: { 
      'Authorization': `MAC id="${client_id}",nonce="${nonce}",mac="${mac}"`, 
      'X-GH-PARTNER-KEY': partner_key
    }
  };
  
  axios.request(config)
  .then((response) => {
    console.log('success');
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log('Erorrorr');
    console.log(error);
  });
