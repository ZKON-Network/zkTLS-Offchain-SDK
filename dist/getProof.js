"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestProof = getRequestProof;
const axios_1 = __importDefault(require("axios"));
const o1js_1 = require("o1js");
const zkon_zkapp_1 = require("zkon-zkapp");
async function getRequestProof(apiKey, oracleURL, req) {
    try {
        const response = await axios_1.default.post(oracleURL, req, { headers: { 'x-api-key': apiKey } });
        const oracleResponse = response.data;
        const zkonzkP = await zkon_zkapp_1.ZkonZkProgram.compile();
        const proof = await zkon_zkapp_1.ZkonZkProgram.verifySource(oracleResponse.publicArguments, oracleResponse.decommitment, oracleResponse.p256data);
        const resultZk = await (0, o1js_1.verify)(proof.toJSON(), zkonzkP.verificationKey);
        if (!resultZk) {
            throw new Error('Unable to verify proof');
        }
        console.log(oracleResponse);
        return oracleResponse;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
exports.default = getRequestProof;
//Mockdata
/*getRequestProof({
  method: "GET",
  baseUrl: "r-api.e-grains.com/v1/esoy/info",
  path: "data,availableSupply"
});*/ 
//# sourceMappingURL=getProof.js.map