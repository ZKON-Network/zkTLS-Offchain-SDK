import axios from 'axios';
import { Field, verify, Crypto, createForeignCurveV2, createEcdsaV2, UInt8 } from 'o1js';
import { ECDSAHelper } from 'zkon-zkapp';
import { secp256k1 } from '@noble/curves/secp256k1';
import { ZkonZkProgram, PublicArgumetsFields } from './zkPrograms/zkProgram-fields.js';
import { ZkonZkProgramString, PublicArgumetsString } from './zkPrograms/zkProgram-strings.js';
class Secp256k1 extends createForeignCurveV2(Crypto.CurveParams.Secp256k1) {
}
class Ecdsa extends createEcdsaV2(Secp256k1) {
}
class Scalar extends Secp256k1.Scalar {
}
/**
 * **This is an Internal API, not exposed directly.**
 *
 * Responsible for requesting & fetching proof of proveable-data feed, using the Zkon Oracle Network.
 *
 * @param {string} apiKey - The API Key provided by ZKON. To be used as `x-api-key` in headers.
 * @param {string} oracleURL - Address of the Oracle. Example `127.0.0.1:5000`
 * @param {RequestObject} req - The Object which contains the information which is to be fetched and proved.
  @param {Object} [optional] - Optional parameters for the request.
 * @param {boolean} [optional.proofDeferred=false] - If `true`, the proof generation is deferred.
 * @param {string} [optional.proofType] - The type of proof to request (e.g., "string-proof", "field-proof").
 * @returns {Promise<OracleResponse>} An encapsulated object, which is used to generate a zero-knowledge Kimchi proof, regarding the ECDSA Signature of the TLS-Connection.
 *
 * @example
 * ```ts
 * getRequestProof('foo178xx','http://127.0.0.1:3000/',{
 *   method: "GET",
 *   baseURL: "r-api.e-grains.com/v1/esoy/info",
 *   path: "data,availableSupply",
 * }, {proofDeferred: true, proofType: "field-proof"})
 * ```
 */
export async function getRequestProof(apiKey, oracleURL, req, optional) {
    const { proofDeferred = false, proofType = "field-proof" } = optional || {}; // Default values
    try {
        console.time("Recieved data from Oracle");
        const response = await axios.post(oracleURL, { ...req, ...{ proofType: proofType } }, { headers: { 'x-api-key': apiKey } });
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
        //oracleResponse.publicArguments.dataField = Field(oracleResponse.publicArguments.dataField) //This needs to change according to proofType. 
        oracleResponse.p256data.publicKey = Secp256k1.fromEthers('0283bbaa97bcdddb1b83029ef3bf80b6d98ac5a396a18ce8e72e59d3ad0cf2e767');
        const { r, s } = secp256k1.Signature.fromCompact(oracleResponse.signatureCompressed);
        oracleResponse.p256data.signature = Ecdsa.from({ r: r, s: s });
        console.timeLog("Parsing", "DataParsing");
        const EcdsaData = new ECDSAHelper({
            messageHash: new Scalar(BigInt('0x' + oracleResponse.messageHex)),
            signature: oracleResponse.p256data.signature,
            publicKey: oracleResponse.p256data.publicKey
        });
        console.timeLog("Parsing", "ECDSA Parsed");
        //Conditionally execute the proof-generation.
        //let PublicArgumets;
        if (proofType === "string-proof") {
            console.log("Proof-Type:", proofType);
            if (proofDeferred) {
                return oracleResponse;
            }
            const maxLengthString = 1000;
            let stringData = String(oracleResponse.publicArguments.dataField);
            const encoder = new TextEncoder();
            let UTF8Bytes = [];
            for (let i = 0; i < stringData.length; i++) {
                const charBytes = encoder.encode(stringData.charAt(i));
                UTF8Bytes.push(...charBytes);
            }
            const byteArray = new Uint8Array(UTF8Bytes); //Range check UInt8
            console.log(byteArray);
            let string_utf8 = Array.from(byteArray, (value) => UInt8.from(value));
            for (let i = string_utf8.length; i < maxLengthString; i++) {
                string_utf8.push(UInt8.from(0));
            }
            const zkProgram = ZkonZkProgramString;
            const PublicArgumets = new PublicArgumetsString({
                commitment: oracleResponse.publicArguments.commitment,
                dataField: string_utf8
            });
            console.timeLog("Parsing", "PublicArg Parsed");
            console.timeEnd("Parsing");
            const checker = await zkProgram.compile();
            console.time("Proof generation in SDK");
            const proof = await zkProgram.verifySource(PublicArgumets, oracleResponse.decommitment, EcdsaData);
            console.timeEnd("Proof generation in SDK");
            console.time("Proof-verified in SDK");
            const resultZk = await verify(proof.toJSON(), checker.verificationKey);
            console.timeEnd("Proof-verified in SDK");
            if (!resultZk) {
                throw new Error('Unable to verify proof');
            }
            return oracleResponse;
        }
        else {
            console.log("Proof-Type:", proofType);
            const zkProgram = ZkonZkProgram;
            oracleResponse.publicArguments.dataField = Field(oracleResponse.publicArguments.dataField); //This needs to change according to proofType. 
            if (proofDeferred) {
                return oracleResponse;
            }
            const PublicArgumets = new PublicArgumetsFields({
                commitment: oracleResponse.publicArguments.commitment,
                dataField: oracleResponse.publicArguments.dataField
            });
            console.timeLog("Parsing", "PublicArg Parsed");
            console.timeEnd("Parsing");
            const checker = await zkProgram.compile();
            console.time("Proof generation in SDK");
            const proof = await zkProgram.verifySource(PublicArgumets, oracleResponse.decommitment, EcdsaData);
            console.timeEnd("Proof generation in SDK");
            console.time("Proof-verified in SDK");
            const resultZk = await verify(proof.toJSON(), checker.verificationKey);
            console.timeEnd("Proof-verified in SDK");
            if (!resultZk) {
                throw new Error('Unable to verify proof');
            }
            return oracleResponse;
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
/**
 * Generate the proof from the obtained **_OracleResponse_** object
 *
 * @param proofType - The type of proof to request (e.g., "string-proof", "field-proof"). Defaults to "false"
 * @param oracleResponse - The Object recieved from the **Zkon.request()** or **_Zkon.requestStringProof()_**
 * @returns {Promise<boolean>} Returns true if the proof is generated & valid, false if otherwise.
 */
export async function generateAndVerifyProof(proofType = "field-proof", oracleResponse) {
    const EcdsaData = new ECDSAHelper({
        messageHash: new Scalar(BigInt('0x' + oracleResponse.messageHex)),
        signature: oracleResponse.p256data.signature,
        publicKey: oracleResponse.p256data.publicKey
    });
    if (proofType === "string-proof") {
        const maxLengthString = 1000;
        let stringData = String(oracleResponse.publicArguments.dataField);
        let string_val = stringData.split('').map(x => UInt8.from(x.charCodeAt(0)));
        for (let i = string_val.length; i < maxLengthString; i++) {
            string_val.push(UInt8.from(0));
        }
        const zkProgram = ZkonZkProgramString;
        const PublicArgumets = new PublicArgumetsString({
            commitment: oracleResponse.publicArguments.commitment,
            dataField: string_val
        });
        const checker = await zkProgram.compile();
        const proof = await zkProgram.verifySource(PublicArgumets, oracleResponse.decommitment, EcdsaData);
        const resultZk = await verify(proof.toJSON(), checker.verificationKey);
        if (!resultZk) {
            throw new Error('Unable to verify proof');
        }
        return true;
    }
    else {
        const zkProgram = ZkonZkProgram;
        oracleResponse.publicArguments.dataField = Field(oracleResponse.publicArguments.dataField); //This needs to change according to proofType. 
        const PublicArgumets = new PublicArgumetsFields({
            commitment: oracleResponse.publicArguments.commitment,
            dataField: oracleResponse.publicArguments.dataField
        });
        const checker = await zkProgram.compile();
        const proof = await zkProgram.verifySource(PublicArgumets, oracleResponse.decommitment, EcdsaData);
        const resultZk = await verify(proof.toJSON(), checker.verificationKey);
        if (!resultZk) {
            throw new Error('Unable to verify proof');
        }
        return true;
    }
}
export default getRequestProof;
//# sourceMappingURL=getProof.js.map