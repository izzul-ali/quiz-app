'use server';

import { cookies } from 'next/headers';

export default async function signout() {
  cookies().delete('auth_id');
  cookies().delete('auth_key');
}
