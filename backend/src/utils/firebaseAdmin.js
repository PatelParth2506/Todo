const admin = require('firebase-admin')
require('dotenv').config()

const serviceAccount = {
    type : process.env.FIREBASE_ACCOUNT_TYPE,
    project_id : process.env.FIREBASE_ACCOUNT_PROJECT_ID,
    private_key_id : process.env.FIREBASE_ACCOUNT_PRIVATE_KEY_ID,
    private_key : process.env.FIREBASE_ACCOUNT_PRIVATE_KEY,
    client_email : process.env.FIREBASE_ACCOUNT_CLIENT_EMAIL,
    client_id : process.env.FIREBASE_ACCOUNT_CLIENT_ID,
    auth_uri : process.env.FIREBASE_ACCOUNT_AUTH_URI,
    token_uri : process.env.FIREBASE_ACCOUNT_TOKEN_URI,
    auth_provider_x509_cert_url : process.env.FIREBASE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url : process.env.FIREBASE_ACCOUNT_CLIENT_X509_CERT_URL,
    universe_domain : "googleapis.com"
}

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount)
})

module.exports = admin