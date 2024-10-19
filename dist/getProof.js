import axios from 'axios';
import { Field, verify, Crypto, createForeignCurveV2, createEcdsaV2 } from 'o1js';
import { ECDSAHelper, PublicArgumets, ZkonZkProgram } from 'zkon-zkapp';
import { secp256k1 } from '@noble/curves/secp256k1';
class Secp256k1 extends createForeignCurveV2(Crypto.CurveParams.Secp256k1) {
}
class Ecdsa extends createEcdsaV2(Secp256k1) {
}
class Scalar extends Secp256k1.Scalar {
}
/**
 * Responsible for requesting & fetching proof of proveable-data feed, using the Zkon Oracle Network.
 *
 * @param {string} apiKey - The API Key provided by ZKON. To be used as `x-api-key` in headers.
 * @param {string} oracleURL - Address of the Oracle. Example `127.0.0.1:5000`
 * @param {RequestObject} req - The Object which contains the information which is to be fetched and proved.
 *
 * @returns An encapsulated object, which is used to generate a zero-knowledge Kimchi proof, regarding the ECDSA Signature of the TLS-Connection.
 *
 * @example
 * ```ts
 * getRequestProof('foo178xx','http://127.0.0.1:3000/',{
 *   method: "GET",
 *   baseURL: "r-api.e-grains.com/v1/esoy/info",
 *   path: "data,availableSupply"
 * })
 * ```
 */
export async function getRequestProof(apiKey, oracleURL, req) {
    try {
        console.time("Recieved data from Oracle");
        const response = await axios.post(oracleURL, req, { headers: { 'x-api-key': apiKey } });
        console.timeEnd("Recieved data from Oracle");
        console.time("Parsing");
        const responseParsed = JSON.parse(response.data.proof);
        console.timeLog("Parsing", "Response Parsing");
        let oracleResponse = {
            p256data: responseParsed.p256data,
            messageHex: responseParsed.messageHex,
            signatureCompressed: responseParsed.signatureCompressed,
            publicArguments: responseParsed.publicArguments,
            decommitment: Field(responseParsed.decommitment),
        };
        console.timeLog("Parsing", "OracleResponse Parsing");
        oracleResponse.publicArguments.commitment = Field(oracleResponse.publicArguments.commitment);
        oracleResponse.publicArguments.dataField = Field(oracleResponse.publicArguments.dataField);
        oracleResponse.p256data.publicKey = Secp256k1.fromEthers('0283bbaa97bcdddb1b83029ef3bf80b6d98ac5a396a18ce8e72e59d3ad0cf2e767');
        const { r, s } = secp256k1.Signature.fromCompact(oracleResponse.signatureCompressed);
        oracleResponse.p256data.signature = Ecdsa.from({ r: r, s: s });
        console.timeLog("Parsing", "DataParsing");
        const zkonzkP = await ZkonZkProgram.compile();
        console.timeLog("Parsing", "ZkProgram Compile");
        const publicData = new PublicArgumets({
            commitment: oracleResponse.publicArguments.commitment,
            dataField: oracleResponse.publicArguments.dataField
        });
        console.timeLog("Parsing", "PublicArg Parsing");
        const EcdsaData = new ECDSAHelper({
            messageHash: new Scalar(BigInt('0x' + oracleResponse.messageHex)),
            signature: oracleResponse.p256data.signature,
            publicKey: oracleResponse.p256data.publicKey
        });
        console.timeLog("Parsing", "ECDSA Parsing");
        console.timeEnd("Parsing");
        console.time("Proof generation in SDK");
        const proof = await ZkonZkProgram.verifySource(publicData, oracleResponse.decommitment, EcdsaData);
        console.timeEnd("Proof generation in SDK");
        console.time("Proof-verified in SDK");
        const resultZk = await verify(proof.toJSON(), zkonzkP.verificationKey);
        if (!resultZk) {
            throw new Error('Unable to verify proof');
        }
        console.timeEnd("Proof-verified in SDK");
        return oracleResponse;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
export default getRequestProof;
//# sourceMappingURL=getProof.js.map