"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerficationCode = void 0;
const brevo = require('@getbrevo/brevo');
const sendVerficationCode = (email, otp, name) => __awaiter(void 0, void 0, void 0, function* () {
    let defaultClient = brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.SENDINBLUEAPI;
    let apiInstance = new brevo.TransactionalEmailsApi();
    try {
        let sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.sender = { "name": "LogicLoom", "email": "verfify@logicroom.io" };
        sendSmtpEmail.to = [
            { "email": email, "name": name }
        ];
        sendSmtpEmail.subject = "Codepanda verfication code";
        sendSmtpEmail.htmlContent = "Your verfication code - " + otp;
        apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
            console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        }, function (error) {
            console.log("failed to send verification code");
            console.error(error);
        });
        return { status: true, message: "Otp sended" };
    }
    catch (err) {
        return { status: false, message: "Unknown error" };
    }
});
exports.sendVerficationCode = sendVerficationCode;
