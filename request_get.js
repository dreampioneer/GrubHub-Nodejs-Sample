
import dotenv from 'dotenv'
import {generateNonce, calculateBodyHash, buildNormalizedRequest, generateHMAC_SHA256, encodeToBase64, requestAxios} from '../test-app/utils.js'

dotenv.config();

const client_id=process.env.CLIENT_ID
const secret_key=process.env.SECRET_KEY
const partner_key=process.env.PARTNER_KEY
const merchant_id=process.env.MERCHANT_ID
const path= `pos/v1/merchant/${merchant_id}/menu/schedules/overrides`
const requestMethod= "GET"
const requestPath= `/pos/v1/merchant/${merchant_id}/menu/schedules/overrides`
const host=process.env.HOST
const port= "443"
const nonce= generateNonce()
const bodyHash= calculateBodyHash('')

const normalizedRequest = buildNormalizedRequest(nonce, requestMethod, requestPath, host, port, '', '')
const sha256Hmac = generateHMAC_SHA256(secret_key, normalizedRequest);
const mac = encodeToBase64(sha256Hmac);
const method = 'get'

requestAxios({host, path, method, nonce, mac, requestBody: ''})
  .then((response) => {
    console.log('Success')
    console.log(response.data); 
  })
  .catch((error) => {
    console.log('Error')
    console.error(error); 
  });
