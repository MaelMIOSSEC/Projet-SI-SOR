import { randomBytes, scrypt } from "node:crypto";
import { SignJWT, jwtVerify } from "jsr:@panva/jose";

import { type AuthPayload, isAuthPayload } from "../types/autentificationType.ts";
// Key should be stored in environment variable in production
const JWT_SECRET = "projet-M1-SI-SOR-2026";

// Convert the secret to a Uint8Array for use with jose
const JWT_KEY = new TextEncoder().encode(JWT_SECRET);

/** Creates a JSON Web Token (JWT) with the given payload.
 * @param payload - The payload to include in the JWT.
 * @returns A promise resolving to the generated JWT string.
 */
export async function createJWT(
    payload: Omit<AuthPayload, "exp">
): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .sign(JWT_KEY);
}

/** Verifies a JSON Web Token (JWT) and returns the payload if valid.
 * @param token - The JWT string to verify.
 * @returns A promise resolving to the payload if the token is valid, or null if invalid.
 */
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

/** Hashes a password with a salt.
 * @param password - The password to hash.
 * @returns A promise resolving to the hashed password.
 */
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

/** Verifies a password against a stored hash.
 * @param password - The password to verify.
 * @param storedHash - The stored hash to compare against.
 * @returns A promise resolving to true if the password is correct, or false otherwise.
 */
export function verifyPassword(
    password: string,
    storedHash: string
): Promise<boolean> {
    
    if (!storedHash) {
        return Promise.reject(new Error("storedHash est vide ou manquant"));
    }
 
    const parts = storedHash.split(".");
 
    if (parts.length !== 2) {
        return Promise.reject(
            new Error(`Format de storedHash invalide : attendu "hash.salt", reçu ${parts.length} partie(s)`)
        );
    }
 
    const [hash, salt] = parts;
 
    if (!hash) {
        return Promise.reject(new Error("La partie hash de storedHash est vide"));
    }
 
    if (!salt) {
        return Promise.reject(new Error("La partie salt de storedHash est vide"));
    }
 
    return new Promise((resolve, reject) => {
        scrypt(password, salt, 64, (err: any, derivedKey: any) => {
            if (err) reject(err);
            else resolve(hash === derivedKey.toString("hex"));
        });
    });
}