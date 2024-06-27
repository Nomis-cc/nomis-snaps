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
