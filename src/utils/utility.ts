import crypto from "crypto";

function generateSlugName(name: string) {
  let randomNumber = Math.floor(Math.random() * 9000) + 1000;
  let slug = name.replace(/\s+/g, "_") + "_" + randomNumber;
  return slug.toLowerCase();
}

function generateVerificationToken() {
  return crypto.randomBytes(20).toString("hex");
}

export { generateSlugName, generateVerificationToken };
