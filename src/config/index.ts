import "dotenv/config";
export const port = Number(process.env.PORT);
export const DbUrl = String(process.env.DB_URL);
export const CloudApiKey = String(process.env.CLOUD_API_KEY);
export const CloudApiSecret = String(process.env.CLOUD_API_SECRET);
export const CloudName = String(process.env.CLOUD_NAME);
export const Host = String(process.env.MAIL_HOST);
export const Password = String(process.env.MAIL_PASSWORD);
export const Email = String(process.env.MAIL);
