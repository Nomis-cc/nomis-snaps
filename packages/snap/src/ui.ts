import type { DialogParams, Transaction } from '@metamask/snaps-sdk';
import { heading, panel, text } from '@metamask/snaps-sdk';

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
  return {
    content: panel([
      heading('Main UI heading'),
      text(`Account: ${account}`),
      text(`Chain ID: ${chainId}`),
    ]),
  };
};

export const renderTransactionUi = async (
  transaction: Transaction,
  chainId: string,
) => {
  return {
    content: panel([
      heading('Transaction UI heading'),
      text(`Transaction from: ${transaction.from}`),
      text(`Chain ID: ${chainId}`),
    ]),
  };
};
