import axios from 'axios';
import { Field, verify, Crypto, createForeignCurveV2, createEcdsaV2 } from 'o1js';
import { ECDSAHelper, PublicArgumets, ZkonZkProgram } from 'zkon-zkapp';
import { secp256k1 } from '@noble/curves/secp256k1';

class Secp256k1 extends createForeignCurveV2(Crypto.CurveParams.Secp256k1) {}
class Ecdsa extends createEcdsaV2(Secp256k1) {}
class Scalar extends Secp256k1.Scalar {}

/**
 * Interface representing the notation in which a Request Object is constructed.
 * 
 * @example
 * ```ts
 * const exampleObject: RequestObject = {
 *   method: "GET",
 *   baseURL: "r-api.e-grains.com/v1/esoy/info",
 *   path: "data,availableSupply"
 * }
 * ```
 */
export interface RequestObject {
  /** HTTPs Method to access the Data Feed API. */
  method: string;
  /** Datafeed API Endpoint. */
  baseURL: string;  
  /**
   * The key with-in the response of the API endpoint, which is to be included in the proof.
   * @example
   * 
   * Suppose,for `"baseURL": "api.binance.com/api/v3/avgPrice?symbol=BTCUSDT"`, the API returns:
   * ```ts
   * Response = { "mins": 5, 
   * "price": "62959.73420364", 
   * "closeTime": 1728327827320
   * }
   * ```
   * 
   * Say you want the proof to include the `price` key of the API-Response. Then populate
   * ```JSON
   * "path":"price"
   * ```
   */
  path: string;  
}

/**
 * Interface representing the response object from Zkon Oracle,
 * which is used to generate a zero-knowledge Kimchi proof,
 * regarding the ECDSA Signature of the TLS-Connection.
 */

export interface OracleResponse {
  /** o1js specific data to help with ECDSA Verification.*/
  p256data: ECDSAHelper;
  /** Compressed form of the ECDSA Signature */
  signatureCompressed: string;
  /** Message of the ECDSA Signature */
  messageHex: string;
  /** o1js specific data to help with ECDSA Verification.*/
  publicArguments: PublicArgumets;
  /** o1js specific data to help with ECDSA Verification.*/
  decommitment: Field;
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

export async function getRequestProof(apiKey: string, oracleURL: string, req: RequestObject): Promise<OracleResponse> {
  try{    
    const response: any = await axios.post(oracleURL, req, { headers: {'x-api-key':apiKey} });
    console.log("Recieved data from Oracle.")

    const responseParsed = JSON.parse(response.data.proof)  
    let oracleResponse : OracleResponse = {
      p256data:responseParsed.p256data,
      messageHex: responseParsed.messageHex,
      signatureCompressed: responseParsed.signatureCompressed,
      publicArguments:responseParsed.publicArguments,
      decommitment: Field(responseParsed.decommitment),
    }

    console.log(responseParsed.decommitment);
    console.log(oracleResponse.publicArguments.commitment);
  
    oracleResponse.publicArguments.commitment = Field(oracleResponse.publicArguments.commitment)
    oracleResponse.publicArguments.dataField = Field(oracleResponse.publicArguments.dataField)
    oracleResponse.p256data.publicKey = Secp256k1.fromEthers('0283bbaa97bcdddb1b83029ef3bf80b6d98ac5a396a18ce8e72e59d3ad0cf2e767')
    const {r,s} = secp256k1.Signature.fromCompact(oracleResponse.signatureCompressed);
    oracleResponse.p256data.signature = Ecdsa.from({r:r,s:s})

    const zkonzkP = await ZkonZkProgram.compile();

    const publicData = new PublicArgumets({
      commitment: oracleResponse.publicArguments.commitment,
      dataField: oracleResponse.publicArguments.dataField
    })

    const EcdsaData = new ECDSAHelper({
      messageHash: new Scalar(BigInt('0x'+oracleResponse.messageHex)),
      signature: oracleResponse.p256data.signature,
      publicKey: oracleResponse.p256data.publicKey
    })

    console.time("Proof generation in SDK")
    const proof = await ZkonZkProgram.verifySource(
      publicData,
      oracleResponse.decommitment,
      EcdsaData
    );
    console.timeEnd("Proof generation in SDK")
    
    console.time("Proof-verified in SDK")
    const resultZk = await verify(proof.toJSON(), zkonzkP.verificationKey);
    if (!resultZk) {
      throw new Error('Unable to verify proof');
    }
    console.timeEnd("Proof-verified in SDK")

    return oracleResponse;

  }catch(error){
    console.log(error);
    throw error;
  } 
}

export default getRequestProof;