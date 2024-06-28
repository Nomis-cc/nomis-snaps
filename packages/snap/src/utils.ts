export const getChainId = async () => {
  let chainId = await ethereum.request<string>({
    method: 'eth_chainId',
  });

  if (!chainId) {
    console.error('Something went wrong while getting the chain ID.');
    chainId = '1';
  }

  return chainId;
};

export const getAccount = async () => {
  const accounts = await ethereum.request<string[]>({
    method: 'eth_requestAccounts',
  });

  return accounts?.[0] ?? '';
};

export const convertCAIP2ToHex = (caip2: string) => {
  const parts = caip2.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid CAIP-2 format');
  }

  const hexPart = parts[1] as string;

  return `0x${hexPart}`;
};
