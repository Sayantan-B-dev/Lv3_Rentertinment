// imageKitService.ts doesn't necessarily need a server side SDK for MVP, 
// ImageKit React components usually handle client side upload. 
// However, if we need server side auth generation:
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "YOUR_PUBLIC_KEY",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "YOUR_PRIVATE_KEY",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "YOUR_URL_ENDPOINT",
});

export function getImageKitAuthParams() {
  return imagekit.getAuthenticationParameters();
}
