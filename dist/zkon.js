"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getProof_1 = __importDefault(require("./getProof"));
class ZKON {
    apiKey;
    oracleURL;
    constructor(apiKey, oracleURL) {
        this.apiKey = apiKey;
        this.oracleURL = oracleURL;
    }
    async request(req) {
        return (0, getProof_1.default)(this.apiKey, this.oracleURL, req);
    }
}
exports.default = ZKON;
//# sourceMappingURL=zkon.js.map