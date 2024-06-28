import type {
  OnHomePageHandler,
  OnInstallHandler,
  OnRpcRequestHandler,
  OnTransactionHandler,
  OnUpdateHandler,
} from '@metamask/snaps-sdk';

import { renderMainUi, renderPromptNextSteps, renderTransactionUi } from './ui';
import { convertCAIP2ToHex, getAccount, getChainId } from './utils';

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    default:
      throw new Error('Method not found.');
  }
};

export const onInstall: OnInstallHandler = async () => {
  await snap.request({
    method: 'snap_dialog',
    params: await renderPromptNextSteps(),
  });
};

export const onUpdate: OnUpdateHandler = async () => {
  await snap.request({
    method: 'snap_dialog',
    params: await renderPromptNextSteps(),
  });
};

export const onHomePage: OnHomePageHandler = async () => {
  const [account, chainId] = await Promise.all([getAccount(), getChainId()]);

  return renderMainUi(account, chainId);
};

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  return renderTransactionUi(convertCAIP2ToHex(chainId), transaction.from);
};
