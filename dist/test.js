import ZKON from "./zkon";
const apiKey = 'foo178xx';
const oracle = 'http://127.0.0.1:3000/';
const zkon = new ZKON(apiKey, oracle);
try {
    const result = await zkon.request({
        method: "GET",
        baseURL: "api.binance.com/api/v3/avgPrice?symbol=BTCUSDT",
        path: "price"
    });
    console.log(result);
}
catch (error) {
    console.log(error);
}
//# sourceMappingURL=test.js.map