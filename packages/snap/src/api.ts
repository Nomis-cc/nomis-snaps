import type { Holder } from './types';

const getData = async <ReturnType>(url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`Call to ${url} failed with status ${response.status}`);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json() as ReturnType;
};

export const calculateScore = async (chainId: string, address: string) =>
  await getData(
    `https://nomis.cc/api/snap/score?chainId=${chainId}&address=${address}`,
  );

export const getScore = async (chainId: string, address: string) =>
  await getData<Holder>(
    `https://nomis.cc/api/snap/holder?chainId=${chainId}&address=${address}`,
  );
