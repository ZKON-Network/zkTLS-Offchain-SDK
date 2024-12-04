import ZKON from "./zkon";
import getRequestProof, { OracleResponse, RequestObject } from './getProof';

const apiKey = 'foo178xx'; 
const oracle = 'http://127.0.0.1:3000/'
const zkon =  new ZKON(apiKey, oracle);

async function basic_API_request(){
    const SDK_Response = await zkon.request({
        method:"GET",
        baseURL:"api.binance.com/api/v3/avgPrice?symbol=BTCUSDT",
        path:"price",
    });

    console.log("DataField:",Number(SDK_Response.publicArguments.dataField.toBigInt())/1e8)
}

async function API_with_body(){
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

    const SDK_Response = await zkon.request({
        method:"POST",
        baseURL:"safebrowsing.googleapis.com/v4/threatMatches:find?key=<api-key>",
        path:"0",
        body: jsonBody
    });

    console.log("DataField:",Number(SDK_Response.publicArguments.dataField.toBigInt())/1e8)

}

async function API_with_headers(){
    const SDK_Response = await zkon.request({
        method:"GET",
        baseURL:"api.binance.com/api/v3/avgPrice?symbol=BTCUSDT",
        path:"price",
        headers:{
            "Host":"api.binance.com" //This has no effect on the API's outcome.
        }
    });
    console.log("DataField:",Number(SDK_Response.publicArguments.dataField.toBigInt())/1e8)
}

async function basic_string_API_request(){
    const SDK_Response = await zkon.requestStringProof({
        method:"GET",
        baseURL:"swapi.dev/api/people/1",
        path:"name",
    });

    console.log("DataField:",SDK_Response.publicArguments.dataField)
}

//basic_API_request()
//API_with_body()
//API_with_headers()
//basic_string_API_request()