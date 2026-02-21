import bcrypt from 'bcrypt';
import { findUserByEmail } from '../repositories/user.repository.js';

export async function loginUser(
  email: string,
  password: string,
  signToken: (payload: object) => string
) {
  const user = await findUserByEmail(email);

  if (!user) throw { statusCode: 401, message: 'Invalid email or password' };

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid)
    throw { statusCode: 401, message: 'Invalid email or password' };

  const token = signToken({ sub: user.id, role: user.role });

  return {
    token,
    user: { id: user.id, email: user.email, role: user.role },
  };
}
