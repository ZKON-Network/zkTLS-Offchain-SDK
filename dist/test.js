import ZKON from "./zkon";
const apiKey = 'foo178xx';
const oracle = 'http://127.0.0.1:3000/';
const zkon = new ZKON(apiKey, oracle);
try {
    // const result = await zkon.request({
    //     method:"GET",
    //     baseURL:"virustotal.com/vtapi/v2/url/report?apikey=963da7aa41e95fd36940080e9184e8a96b4a8a1d6e48215ba9fceef94342cf72&resource=https://www.zkon.xyz",
    //     path:"total"
    // });
    // const result = await zkon.request({
    //     method:"GET",
    //     baseURL:"api.binance.com/api/v3/avgPrice?symbol=BTCUSDT",
    //     path:"price",
    // });
    console.time("SDK E2E Run");
    const jsonBody = {
        client: {
            clientId: "SecureShield",
            clientVersion: "1.0.0"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ "url": "https://www.zkon.xyz" }]
        }
    };
    const result = await zkon.request({
        method: "POST",
        baseURL: "safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyB98HeEHWFvOhX5gzqtrYppbhkpkKlxCqM",
        path: "0",
        body: jsonBody
    });
    // console.log(result);
    console.log("DataField:", Number(result.publicArguments.dataField.toBigInt()) / 1e8);
    console.timeEnd("SDK E2E Run");
}
catch (error) {
    console.log(error);
}
// https://www.virustotal.com/vtapi/v2/url/scan?apikey=963da7aa41e95fd36940080e9184e8a96b4a8a1d6e48215ba9fceef94342cf72&resource=https://example.com
/*
const apiKey = '7167f985b29603ce28303f77f49ab7e2646a03a285a4312157619c4cb78b0a52';
const oracle = 'http://127.0.0.1:9000/';

const result = await zkon.request({
        method:"POST",
        baseURL:"virustotal.com/vtapi/v2/url/scan?apikey=963da7aa41e95fd36940080e9184e8a96b4a8a1d6e48215ba9fceef94342cf72&resource=https://example.com",
        path:""
    });

const result = await zkon.request({
        method:"GET",
        baseURL:"api.binance.com/api/v3/avgPrice?symbol=BTCUSDT",
        path:"price"
    });

Run the provable-data-api. Run this file.
*/ 
//# sourceMappingURL=test.js.map