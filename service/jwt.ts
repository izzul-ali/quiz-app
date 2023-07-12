import jwt from 'jsonwebtoken';

export function generateToken(id: string, email: string) {
  const token = jwt.sign({ id, email }, process.env.JWT_SECRET_KEY!, { algorithm: 'HS256', expiresIn: '1h' });
  return token;
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY!, { algorithms: ['HS256'] });
    return true;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
      console.log(error.message);
      return false;
    }

    const err = <Error>error;
    console.log(err.message);

    return false;
  }
}
