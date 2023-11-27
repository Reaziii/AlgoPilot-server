const brevo = require('@getbrevo/brevo');
export const sendVerficationCode = async (email: string, otp: string, name: string): Promise<{ status: boolean, message: string }> => {
    let defaultClient = brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.SENDINBLUEAPI;
    let apiInstance = new brevo.TransactionalEmailsApi();
    try {
        let sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.sender = { "name": "LogicLoom", "email": "verfify@logicroom.io" };
        sendSmtpEmail.to = [
            { "email": email, "name": name }
        ]
        sendSmtpEmail.subject = "Codepanda verfication code"
        sendSmtpEmail.htmlContent = "Your verfication code - " + otp;
        apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
            console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        }, function (error: any) {
            console.log("failed to send verification code")
            console.error(error);
        });
        return { status: true, message: "Otp sended" }
    } catch (err) {
        return { status: false, message: "Unknown error" }
    }

}



