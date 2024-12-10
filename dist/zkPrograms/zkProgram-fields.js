import { Field, ZkProgram, Struct, createEcdsaV2, createForeignCurveV2, Crypto } from 'o1js';
class Secp256k1 extends createForeignCurveV2(Crypto.CurveParams.Secp256k1) {
}
class Scalar extends Secp256k1.Scalar {
}
class Ecdsa extends createEcdsaV2(Secp256k1) {
}
class ECDSAHelper extends Struct({
    messageHash: Scalar,
    signature: Ecdsa,
    publicKey: Secp256k1
}) {
}
class PublicArgumetsFields extends Struct({
    commitment: Field,
    dataField: Field
}) {
}
const ZkonZkProgram = ZkProgram({
    name: 'zkon-proof',
    publicInput: PublicArgumetsFields,
    methods: {
        verifySource: {
            privateInputs: [Field, ECDSAHelper],
            async method(commitment, decommitment, ECDSASign) {
                //decommitment.assertEquals(commitment.commitment,"Response from proof-server invalid.");
                const checkSignature = ECDSASign.signature.verifySignedHashV2(ECDSASign.messageHash, ECDSASign.publicKey);
                return checkSignature.assertEquals(true, "Signature Verification Invalid!");
            }
        }
    }
});
export { ZkonZkProgram, PublicArgumetsFields, ECDSAHelper };
//# sourceMappingURL=zkProgram-fields.js.map