/*
import pako from "pako"; // yarn add pako
// import LZString from "lz-string";

// base64 to Blob
export async function dataURLtoBlob(base64String: string) {
  const binaryString = window.atob(base64String.split(",")[1]);
  const ab = new ArrayBuffer(binaryString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < binaryString.length; i++) {
    ia[i] = binaryString.charCodeAt(i);
  }
  return new Blob([ab], { type: "image/jpeg" });
}

export function compressBase64(base64String: string) {
  // Base64 문자열을 Uint8Array로 변환
  const str = base64String.includes("data:image")
    ? base64String.split(",")[1]
    : base64String;
  const binaryString = atob(str); // 'data:image/png;base64,' 부분 제거
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // 압축
  const compressed = pako.deflate(bytes);
  const compressedBase64 = btoa(String.fromCharCode(...compressed));
  return compressedBase64; // 압축된 Uint8Array 반환
}

export function uint8ArrayToBase64(compressedBase64) {
  // const binaryString = String.fromCharCode.apply(null, uint8Array);
  // return "data:image/png;base64," + btoa(binaryString);

  const binaryString = window.atob(compressedBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const decompressed = pako.inflate(bytes);
  // const originalBase64 =
  //   "data:image/png;base64," + btoa(String.fromCharCode(...decompressed));
  const originalBase64 = btoa(String.fromCharCode(...decompressed));
  return originalBase64;
}

export const compressAndEncode = (data: string) => {
  const uint8Array = new TextEncoder().encode(data);
  const compressedData = pako.deflate(uint8Array);
  const base64Encoded = btoa(String.fromCharCode(...compressedData));
  return base64Encoded;
};

export const decodeAndDecompress = (base64: string) => {
  const binaryString = atob(base64);
  const uint8Array = new Uint8Array(
    [...binaryString].map((char) => char.charCodeAt(0))
  );
  const decompressedData = pako.inflate(uint8Array);
  const originalData = new TextDecoder().decode(decompressedData);
  return originalData;
};
*/
