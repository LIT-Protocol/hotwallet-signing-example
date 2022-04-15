import { fromString as uint8arrayFromString } from "uint8arrays/from-string";
import ethers from "ethers";
import siwe from "siwe";

const privKey =
  "3dfb4f70b15b6fccc786347aaea445f439a7f10fd10c55dd50cafc3d5a0abac1";
const privKeyBuffer = uint8arrayFromString(privKey, "base16");
const wallet = new ethers.Wallet(privKeyBuffer);

const domain = "localhost";
const origin = "https://localhost/login";
const statement =
  "This is a test statement.  You can put anything you want here.";

const siweMessage = new siwe.SiweMessage({
  domain,
  address: wallet.address,
  statement,
  uri: origin,
  version: "1",
  chainId: "1",
});

const messageToSign = siweMessage.prepareMessage();

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
