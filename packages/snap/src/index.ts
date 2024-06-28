import {
  type OnHomePageHandler,
  type OnInstallHandler,
  type OnRpcRequestHandler,
  type OnTransactionHandler,
  type OnUpdateHandler,
  type OnUserInputHandler,
} from '@metamask/snaps-sdk';

import { calculateScore } from './api';
import {
  renderMainUi,
  renderMainUiWithError,
  renderMainUiWithLoading,
  renderMainUiWithScore,
  renderPromptNextSteps,
  renderTransactionUi,
} from './ui';
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

  const content = await renderMainUi(account, chainId);

  return {
    content,
  };
};

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  return renderTransactionUi(convertCAIP2ToHex(chainId), transaction.from);
};

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  if (event.name === 'calculate-score') {
    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: renderMainUiWithLoading(),
      },
    });

    const [account, chainId] = await Promise.all([getAccount(), getChainId()]);

    try {
      const { score, scoreName, url } = await calculateScore(chainId, account);

      await snap.request({
        method: 'snap_updateInterface',
        params: {
          id,
          ui: renderMainUiWithScore(score, scoreName, url),
        },
      });
    } catch {
      await snap.request({
        method: 'snap_updateInterface',
        params: {
          id,
          ui: renderMainUiWithError(),
        },
      });
    }
  }

  if (event.name === 'back') {
    const [account, chainId] = await Promise.all([getAccount(), getChainId()]);

    const ui = await renderMainUi(account, chainId);

    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui,
      },
    });
  }
};
