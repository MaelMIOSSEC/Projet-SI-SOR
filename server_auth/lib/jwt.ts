import { randomBytes, scrypt } from "node:crypto";
import { SignJWT, jwtVerify } from "jsr:@panva/jose";

import { type AuthPayload, isAuthPayload } from "../types/autentificationType.ts";

const JWT_SECRET = "projet-M1-SI-SOR-2026";
const JWT_KEY = new TextEncoder().encode(JWT_SECRET);

export async function createJWT(
    payload: Omit<AuthPayload, "exp">
): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .sign(JWT_KEY);
}

export async function verifyJWT(token: string): Promise<AuthPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_KEY);

        if (isAuthPayload(payload)) {
            return payload;
        }

        return null;
    } catch (error) {
        console.error("JWT Verification failed : ", error);
        return null;
    }
}

export function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");

    return new Promise((resolve, reject) => {
        //scrypt(password, salt, 64, (err: any, derivedKey: { toString: (arg0: string) => any; }) => {
        scrypt(password, salt, 64, (err: any, derivedKey: any) => {  
            if (err) reject(err);
            else resolve(`${derivedKey.toString("hex")}.${salt}`);
        });
    });
}

export function verifyPassword(
    password: string,
    storedHash: string
): Promise<boolean> {
    const [hash, salt] = storedHash.split(".");

    return new Promise((resolve, reject) => {
        //scrypt(password, salt, 64, (err: any, derivedKey: { toString: (arg0: string) => string; }) => {
        scrypt(password, salt, 64, (err: any, derivedKey: any) => { 
            if (err) reject(err);
            else resolve(hash === derivedKey.toString("hex"));
        });
    });
}