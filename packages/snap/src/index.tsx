import type {
  OnRpcRequestHandler,
  OnUserInputHandler,
  OnTransactionHandler,
} from '@metamask/snaps-sdk';
import { type OnHomePageHandler } from '@metamask/snaps-sdk';

import { calculateScore } from './api';
import {
  renderMainUi,
  renderMainUiWithError,
  renderMainUiWithLoading,
  renderMainUiWithScore,
  renderTransactionUi,
} from './ui';
import { convertCAIP2ToHex, getAccount, getChainId } from './utils';

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    case 'getAddress':
      return await getAccount();
    default:
      throw new Error('Method not found.');
  }
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
  try {
    return renderTransactionUi(
      convertCAIP2ToHex(chainId),
      transaction.from,
      transaction.to,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { content: renderMainUiWithError(message) };
  }
};

export const onUserInput: OnUserInputHandler = async ({ id, event }) => {
  try {
    if (event.name === 'calculate-score') {
      await snap.request({
        method: 'snap_updateInterface',
        params: {
          id,
          ui: renderMainUiWithLoading(),
        },
      });

      const [account, chainId] = await Promise.all([
        getAccount(),
        getChainId(),
      ]);

      try {
        const { score, scoreName, url } = await calculateScore(
          chainId,
          account,
        );

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
            ui: renderMainUiWithError('Failed to calculate score'),
          },
        });
      }
    }

    if (event.name === 'back') {
      const [account, chainId] = await Promise.all([
        getAccount(),
        getChainId(),
      ]);

      const ui = await renderMainUi(account, chainId);

      await snap.request({
        method: 'snap_updateInterface',
        params: {
          id,
          ui,
        },
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    await snap.request({
      method: 'snap_updateInterface',
      params: {
        id,
        ui: renderMainUiWithError(message),
      },
    });
  }
};
