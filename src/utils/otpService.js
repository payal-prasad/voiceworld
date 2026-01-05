const unirest = require("unirest");

/**
 * Generate a 6-digit OTP
 */
exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP to mobile number via SMS gateway
 * @param {string} mobileNo - Mobile number to send OTP to
 * @param {string} otpCode - OTP code to send
 * @returns {Promise} - Resolves if SMS sent successfully, rejects on error
 */
exports.sendOTPToMobile = (mobileNo, otpCode) => {
  return new Promise((resolve, reject) => {
    // Check if OTP sending is disabled (for development/testing)
    if (process.env.DISABLE_OTP_SENDING === "1") {
      console.log(
        `OTP Sending Disabled [${mobileNo}]: OTP ${otpCode} (mocked)`
      );
      resolve({
        status: "Success",
        message: "OTP sent successfully (mocked)",
      });
      return;
    }

    // Format mobile number to E.164 (assume India +91 if not prefixed)
    const formattedMobile = mobileNo.startsWith("+")
      ? mobileNo
      : `+91${mobileNo}`;

    const req = unirest(
      "POST",
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`
    );
    req.auth(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    req.form({
      From: process.env.TWILIO_PHONE_NUMBER,
      To: formattedMobile,
      Body: `Your OTP is ${otpCode}. Regards, YourApp`,
    });

    req.end((res) => {
      if (res.error) {
        console.error(`OTP Send Error [${mobileNo}]:`, res.error);
        console.error(`Twilio Response Body:`, res.body);
        reject({
          status: "Failed",
          error: res.error,
          message: "Failed to send OTP",
        });
      } else {
        console.log(`OTP Sent Successfully [${mobileNo}]:`, res.body);
        resolve({
          status: "Success",
          message: "OTP sent successfully",
        });
      }
    });
  });
};

/**
 * Verify OTP code
 * @param {string} storedOTP - OTP stored in database
 * @param {string} providedOTP - OTP provided by user
 * @returns {boolean} - True if OTP matches, false otherwise
 */
exports.verifyOTP = (storedOTP, providedOTP) => {
  return storedOTP === providedOTP;
};
