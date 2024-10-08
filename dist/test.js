import ZKON from "./zkon";
const apiKey = 'foo178xx';
const oracle = 'http://127.0.0.1:3000/';
const zkon = new ZKON(apiKey, oracle);
try {
    const result = await zkon.request({
        method: "GET",
        baseURL: "virustotal.com/vtapi/v2/url/report?apikey=963da7aa41e95fd36940080e9184e8a96b4a8a1d6e48215ba9fceef94342cf72&resource=https://www.zkon.xyz",
        path: "total"
    });
    // const result = await zkon.request({
    //     method:"GET",
    //     baseURL:"api.binance.com/api/v3/avgPrice?symbol=BTCUSDT",
    //     path:"price"
    // });
    // console.log(result);
    console.log("DataField:", Number(result.publicArguments.dataField.toBigInt()) / 1e8);
}
catch (error) {
    console.log(error);
}
//# sourceMappingURL=test.js.map