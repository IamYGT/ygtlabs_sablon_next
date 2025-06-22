// Basit ve güvenli password hashing

const SALT_BYTES = 16;
const KEY_LENGTH_BYTES = 32;
const ITERATIONS = 310000;
const DIGEST_ALGORITHM = "SHA-256";

// ArrayBuffer'ı Base64'e çevir
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
}

// Base64'ü ArrayBuffer'a çevir
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Şifreyi PBKDF2 ile hashle
 */
export async function hashPasswordPbkdf2(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const encoder = new TextEncoder();

  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: ITERATIONS,
      hash: DIGEST_ALGORITHM,
    },
    passwordKey,
    KEY_LENGTH_BYTES * 8
  );

  const hashBase64 = arrayBufferToBase64(derivedBits);
  const saltBase64 = arrayBufferToBase64(salt.buffer);

  return `pbkdf2-sha-256:${ITERATIONS}:${saltBase64}:${hashBase64}`;
}

/**
 * Şifreyi doğrula
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    // PBKDF2 format kontrolü
    if (storedHash.startsWith("pbkdf2-sha-256:")) {
      return await verifyPasswordPbkdf2(password, storedHash);
    }

    // Eski bcrypt formatları desteklenmiyor
    return false;
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}

/**
 * PBKDF2 hash doğrula
 */
async function verifyPasswordPbkdf2(
  password: string,
  storedHashString: string
): Promise<boolean> {
  const parts = storedHashString.split(":");
  if (parts.length !== 4 || parts[0] !== "pbkdf2-sha-256") {
    return false;
  }

  const saltBase64 = parts[2];
  const hashBase64 = parts[3];

  const salt = base64ToArrayBuffer(saltBase64);
  const encoder = new TextEncoder();

  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: ITERATIONS,
      hash: DIGEST_ALGORITHM,
    },
    passwordKey,
    KEY_LENGTH_BYTES * 8
  );

  const currentHashBase64 = arrayBufferToBase64(derivedBits);
  return currentHashBase64 === hashBase64;
}

// Modern password hashing utility object
export const hashPassword = {
  hash: hashPasswordPbkdf2,
  verify: verifyPassword,
};
