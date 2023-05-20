import bcrypt from "bcrypt";

class PasswordHashServices {
  public async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  public async compare(
    password: string,
    passwordHash: string
  ): Promise<boolean> {
    const result = await bcrypt.compare(password, passwordHash);
    return result;
  }
}

export default PasswordHashServices;
