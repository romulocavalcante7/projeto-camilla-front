'use server';

import { cookies } from 'next/headers';

export const setCookie = (name: string, value: string) => {
  cookies().set(name, value);
};

export const getCookie = async (name: string) => {
  return cookies().get(name);
};

export const deleteCookie = async (name: string) => {
  return cookies().delete(name);
};
