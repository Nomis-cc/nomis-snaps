import type { DialogParams } from '@metamask/snaps-sdk';
import { address, divider, heading, panel, text } from '@metamask/snaps-sdk';

import { getScore } from './api';

export const renderPromptNextSteps = async () => {
  return {
    type: 'alert',
    content: panel([
      heading('After install heading'),
      text('After install text'),
    ]),
  } as DialogParams;
};

export const renderMainUi = async (account: string, chainId: string) => {
  const { score, scoreName, url, isHolder } = await getScore(chainId, account);

  return {
    content: panel([
      heading(`${scoreName} Score: ${score || 'unknown'}`),
      address(account as `0x${string}`),
      divider(),
      text(
        `[${isHolder ? 'Update' : 'Get'} your score](https://nomis.cc${url})`,
      ),
    ]),
  };
};

export const renderTransactionUi = async (chainId: string, account: string) => {
  const { score, scoreName, url, isHolder } = await getScore(chainId, account);

  if (!isHolder) {
    return {
      content: panel([
        heading(`Get your ${scoreName} Score`),
        text(`[Get Score](https://nomis.cc${url})`),
      ]),
    };
  }

  return {
    content: panel([
      heading(`${scoreName} Score: ${score}`),
      divider(),
      text(`[Update your score](https://nomis.cc${url})`),
    ]),
  };
};
