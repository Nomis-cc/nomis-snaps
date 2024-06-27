import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    default:
      throw new Error('Method not found.');
  }
};
