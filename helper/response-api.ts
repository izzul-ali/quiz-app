import { NextResponse } from 'next/server';

export type ResponseApi<T> = {
  status_code: number;
  error: string;
  data: T;
};

export default function setResponse<T>({ status_code, error, data }: ResponseApi<T>) {
  return NextResponse.json({ status_code, error, data } as ResponseApi<T>, { status: status_code });
}
