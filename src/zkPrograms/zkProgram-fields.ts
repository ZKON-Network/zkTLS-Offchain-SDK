import { Mina, Field, ZkProgram, Struct, createEcdsaV2, createForeignCurveV2,Crypto, Bool, Provable, UInt8} from 'o1js';

class Secp256k1 extends createForeignCurveV2(Crypto.CurveParams.Secp256k1) {}
class Scalar extends Secp256k1.Scalar {}
class Ecdsa extends createEcdsaV2(Secp256k1) {}

class ECDSAHelper extends Struct({
  messageHash: Scalar,
  signature: Ecdsa,
  publicKey: Secp256k1
}){}

class PublicArgumetsFields extends Struct({
    commitment: Field,
    dataField: Field
  }){}

const ZkonZkProgram = ZkProgram({
    name:'zkon-proof',
    publicInput: PublicArgumetsFields,
    publicOutput: Bool,
  
    methods:{
      verifySource:{
        privateInputs: [Field, ECDSAHelper], 
        async method (
          commitment: PublicArgumetsFields,
          decommitment: Field,
          ECDSASign:ECDSAHelper,
        ){
          //decommitment.assertEquals(commitment.commitment,"Response from proof-server invalid.");
          return ECDSASign.signature.verifySignedHashV2(ECDSASign.messageHash, ECDSASign.publicKey)
        }
      }
    }
  });

  export {ZkonZkProgram , PublicArgumetsFields ,ECDSAHelper};
