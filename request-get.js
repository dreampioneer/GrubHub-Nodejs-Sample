
import dotenv from 'dotenv'
import {generateNonce, calculateBodyHash, buildNormalizedRequest, generateHMAC_SHA256, encodeToBase64, requestAxios} from './utils.js'

dotenv.config();

const secret_key=process.env.SECRET_KEY
const merchant_id=process.env.MERCHANT_ID
const job_id='d9f61099-d172-4750-9a6f-c44440413d2d'
const path= `pos/v1/menu/ingestion/jobs/${job_id}`
const requestMethod= "GET"
const requestPath= `/pos/v1/menu/ingestion/jobs/${job_id}`
const host=process.env.HOST
const port= "443"
const nonce= generateNonce()
const bodyHash= calculateBodyHash('')

const normalizedRequest = buildNormalizedRequest(nonce, requestMethod, requestPath, host, port, '', '')
const sha256Hmac = generateHMAC_SHA256(secret_key, normalizedRequest);
const mac = encodeToBase64(sha256Hmac);

requestAxios({host, path, requestMethod, nonce, mac, requestBody: ''})
  .then((response) => {
    console.log('Success')
    console.log(response.data); 
  })
  .catch((error) => {
    console.log('Error')
    console.error(error); 
  });
