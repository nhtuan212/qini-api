import NodeRSA from "node-rsa";
import { RSA_PRIVATE_KEY } from "../constants";

/**
 * Generate RSA key pair for development/testing
 * In production, keys should be generated securely and stored properly
 * @returns object containing public and private keys
 */
export const generateRSAKeyPair = () => {
    const key = new NodeRSA({ b: 2048 });
    return {
        publicKey: key.exportKey("public"),
        privateKey: key.exportKey("private"),
    };
};

/**
 * Decrypt RSA encrypted password
 * @param {string} encryptedPassword - RSA encrypted password from frontend
 * @returns {string} - Decrypted plain text password
 */
export const decryptPassword = (encryptedPassword: string): string => {
    try {
        const key = new NodeRSA({ b: 2048 });
        key.importKey(RSA_PRIVATE_KEY, "private");

        const decrypted = key.decrypt(encryptedPassword, "utf8");
        return decrypted;
    } catch (error) {
        console.error("error ===>", error);
        throw new Error(
            `Failed to decrypt password: ${
                error instanceof Error ? error.message : "Unknown error"
            }`,
        );
    }
};
