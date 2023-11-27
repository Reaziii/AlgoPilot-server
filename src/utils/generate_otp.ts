export default function generateOTP(otpLength:number): string {
    const otp = Math.floor(Math.pow(10, otpLength - 1) + Math.random() * 9 * Math.pow(10, otpLength - 1));
    return otp.toString();
}