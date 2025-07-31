import * as argon2 from 'argon2'
import 'server-only'

export async function verifyPassword(passHash: string, password: string) {
  return await argon2.verify(passHash, password)
}
