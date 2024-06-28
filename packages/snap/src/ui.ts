import type { DialogParams } from '@metamask/snaps-sdk';
import {
  button,
  divider,
  form,
  getImageComponent,
  heading,
  panel,
  spinner,
  text,
} from '@metamask/snaps-sdk';

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
  const { score, scoreName, url, image } = await getScore(chainId, account);

  const displayData: Parameters<typeof panel>[0] = [
    heading(`${scoreName} Score: ${score || 'unknown'}`),
    divider(),
    form({
      name: 'calculate-score',
      children: [
        button({
          value: 'Calculate score',
          buttonType: 'submit',
        }),
      ],
    }),
    text(`[Mint your score](https://nomis.cc${url})`),
  ];

  if (image) {
    displayData.splice(1, 0, await getImageComponent(image, { width: 400 }));
  }

  return panel(displayData);
};

export const renderMainUiWithLoading = () => {
  return panel([heading('Please wait...'), spinner()]);
};

export const renderMainUiWithScore = (
  score: number,
  scoreName: string,
  url: string,
) => {
  return panel([
    heading(`${scoreName} Score: ${Number((score * 100).toFixed(2))}`),
    text(`[Mint your score](https://nomis.cc${url})`),
    divider(),
    form({
      name: 'back',
      children: [
        button({
          value: 'Back',
          buttonType: 'submit',
        }),
      ],
    }),
  ]);
};

export const renderMainUiWithError = () => {
  return panel([
    heading('Failed to calculate score'),
    form({
      name: 'back',
      children: [
        button({
          value: 'Back',
          buttonType: 'submit',
        }),
      ],
    }),
  ]);
};

export const renderTransactionUi = async (chainId: string, account: string) => {
  const { score, scoreName, url, isHolder, image } = await getScore(
    chainId,
    account,
  );

  if (!isHolder) {
    return {
      content: panel([
        heading(`Get your ${scoreName} Score`),
        text(`[Get Score](https://nomis.cc${url})`),
      ]),
    };
  }

  const displayData: Parameters<typeof panel>[0] = [
    heading(`${scoreName} Score: ${score}`),
    divider(),
    text(`[Update your score](https://nomis.cc${url})`),
  ];

  if (image) {
    displayData.splice(1, 0, await getImageComponent(image, { width: 400 }));
  }

  return {
    content: panel(displayData),
  };
};
