import axios from 'axios'
import dotenv from 'dotenv'
import {  v4 as uuidv4  } from 'uuid'
import {generateNonce, calculateBodyHash, buildNormalizedRequest, generateHMAC_SHA256, encodeToBase64, requestAxios} from './utils.js'

dotenv.config();

const secret_key=process.env.SECRET_KEY
const merchant_id=process.env.MERCHANT_ID
const path= `pos/v1/menu/ingestion`
const requestMethod= "POST"
const requestPath= `/pos/v1/menu/ingestion`
const host=process.env.HOST
const port= "443"
const nonce= generateNonce()
const requestBody = {
    job_id: uuidv4(),
    merchant_ids: [
        process.env.MERCHANT_ID
    ],
    menu_url: "https://example.com/menu",
    normalized_menu: true,
    apply_existing_schedule_overrides: true,
    timestamp: Date.now()
}
console.log(JSON.stringify(requestBody))
console.log(typeof requestBody)

const bodyHash= calculateBodyHash(JSON.stringify(requestBody))

const normalizedRequest = buildNormalizedRequest(nonce, requestMethod, requestPath, host, port, bodyHash, '')
const sha256Hmac = generateHMAC_SHA256(secret_key, normalizedRequest);
const mac = encodeToBase64(sha256Hmac);

console.log("nonce", nonce)
console.log("normalizedRequest", normalizedRequest)
console.log("sha256Hmac", sha256Hmac)
console.log("mac", mac)

requestAxios({host, path, method: requestMethod, nonce, mac, requestBody, bodyHash}).then((response) => {
    console.log('Success')
    console.log(response.data); 
  })
  .catch((error) => {
    console.log('Error')
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    }
  });