import { fromString as uint8arrayFromString } from "uint8arrays/from-string";
import ethers from "ethers";

const AUTH_SIGNATURE_BODY =
  "I am creating an account to use Lit Protocol at {{timestamp}}";

const privKey =
  "3dfb4f70b15b6fccc786347aaea445f439a7f10fd10c55dd50cafc3d5a0abac1";
const privKeyBuffer = uint8arrayFromString(privKey, "base16");

const now = new Date().toISOString();
const messageToSign = AUTH_SIGNATURE_BODY.replace("{{timestamp}}", now);

const wallet = new ethers.Wallet(privKeyBuffer);
const signature = await wallet.signMessage(messageToSign);

console.log("signature", signature);

const recoveredAddress = ethers.utils.verifyMessage(messageToSign, signature);

const authSig = {
  sig: signature,
  derivedVia: "web3.eth.personal.sign",
  signedMessage: messageToSign,
  address: recoveredAddress,
};

console.log("authSig", authSig);
