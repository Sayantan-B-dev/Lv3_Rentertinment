// imageKitService.ts doesn't necessarily need a server side SDK for MVP, 
// ImageKit React components usually handle client side upload. 
// However, if we need server side auth generation:
import ImageKit from "@imagekit/nodejs";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "YOUR_PRIVATE_KEY",
});

export function getImageKitAuthParams() {
  return imagekit.helper.getAuthenticationParameters();
}
