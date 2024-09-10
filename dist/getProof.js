"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestProof = getRequestProof;
const axios_1 = __importDefault(require("axios"));
const o1js_1 = require("o1js");
const zkon_zkapp_1 = require("zkon-zkapp");
require('dotenv').config();
async function getRequestProof(req) {
    try {
        const response = await axios_1.default.post(process.env.API_BASE_URL, req, { headers: { 'x-api-key': process.env.API_KEY } });
        const oracleResponse = response.data;
        const zkonzkP = await zkon_zkapp_1.ZkonZkProgram.compile();
        const proof = await zkon_zkapp_1.ZkonZkProgram.verifySource(oracleResponse.publicArguments, oracleResponse.decommitment, oracleResponse.p256data);
        const resultZk = await (0, o1js_1.verify)(proof.toJSON(), zkonzkP.verificationKey);
        console.log(oracleResponse);
    }
    catch (error) {
        console.log(error);
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