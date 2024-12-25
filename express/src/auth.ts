import Express from "express";
import { createDecoder, createVerifier } from "fast-jwt";

import HttpError from "./interfaces/http-error";
import HttpStatus from "./interfaces/http-status";

if (!process.env.PUBLIC_KEY && !process.env.URL) {
  throw new Error("Require keycloak PUBLIC_KEY or URL with REALM.");
}

const jwtVerify = createVerifier({
  key: async () => {
    return `-----BEGIN PUBLIC KEY-----\n${process.env.PUBLIC_KEY}\n-----END PUBLIC KEY-----`;
  },
});

const jwtDecode = createDecoder();

export async function expressAuthentication(
  request: Express.Request,
  _securityName?: string,
  _scopes?: string[]
) {
  const token = request.headers["authorization"]?.includes("Bearer ")
    ? request.headers["authorization"].split(" ")[1]
    : request.headers["authorization"];

  if (!token) {
    throw new HttpError(
      HttpStatus.UNAUTHORIZED,
      "ไม่พบข้อมูลสำหรับยืนยันตัวตน"
    );
  }

  let payload: Record<string, any> = {};

  switch (process.env.PREFERRED_MODE) {
    case "online":
      payload = await verifyOnline(token);
      break;
    case "offline":
      payload = await verifyOffline(token);
      break;
    default:
      if (process.env.URL) {
        payload = await verifyOnline(token);
        break;
      }
      if (process.env.PUBLIC_KEY) {
        payload = await verifyOffline(token);
        break;
      }
  }

  return payload;
}

async function verifyOffline(token: string) {
  const payload = await jwtVerify(token).catch((_) => null);
  if (!payload) {
    throw new HttpError(HttpStatus.UNAUTHORIZED, "ไม่สามารถยืนยันตัวตนได้");
  }
  return payload;
}

async function verifyOnline(token: string) {
  const res = await fetch(
    `${process.env.URL}/protocol/openid-connect/userinfo`,
    {
      headers: { authorization: `Bearer ${token}` },
    }
  ).catch((e) => console.error(e));
  console.log("res", res);

  if (!res) throw new Error("ไม่สามารถเข้าถึงระบบยืนยันตัวตน");
  if (!res.ok) {
    throw new HttpError(HttpStatus.UNAUTHORIZED, "ไม่สามารถยืนยันตัวตนได้");
  }

  return await jwtDecode(token);
}
