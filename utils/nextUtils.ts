'use server';

import { cookies } from 'next/headers';

export const setCookie = (name: string, value: string) => {
  cookies().set(name, value, { maxAge: 31536000 });
};

export const getCookie = async (name: string) => {
  return cookies().get(name);
};

export const deleteCookie = async (name: string) => {
  return cookies().delete(name);
};
