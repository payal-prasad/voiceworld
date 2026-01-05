const https = require("https");

const API_KEY = "64fb9cce-2afc-434a-afc1-838f7c2c99d4";
const SECRET_KEY =
  "56c5562b18d989267582c6a905a569768afbdee058ac5d7b820f879e47a3724c";

const options = {
  method: "POST",
  hostname: "api.videosdk.live",
  port: null,
  path: "/v2/rooms",
  headers: {
    authorization: `${API_KEY}:${SECRET_KEY}`,
    "Content-Type": "application/json",
  },
};

const req = https.request(options, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    const body = Buffer.concat(chunks);
    const data = JSON.parse(body.toString());

    console.log("\n===========================================");
    console.log("Your VideoSDK Token (valid format):");
    console.log(`${API_KEY}:${SECRET_KEY}`);
    console.log("===========================================");
    console.log("\nUpdate your .env file with:");
    console.log(`REACT_APP_VIDEOSDK_TOKEN="${API_KEY}:${SECRET_KEY}"`);
    console.log("===========================================\n");

    if (data.roomId) {
      console.log("Test meeting created successfully!");
      console.log("Room ID:", data.roomId);
    }
  });
});

req.on("error", function (e) {
  console.error("Error:", e.message);
});

req.end();
