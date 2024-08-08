/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { getImageComponent } from '@metamask/snaps-sdk';
import {
  Box,
  Button,
  Divider,
  Form,
  Heading,
  Image,
  Link,
  Row,
  Spinner,
  Text,
} from '@metamask/snaps-sdk/jsx';

import { getScore } from './api';

export const renderMainUiWithError = (error: string) => {
  return (
    <Box>
      <Heading>{error}</Heading>
      <Form name="back">
        <Button type="submit">Back</Button>
      </Form>
    </Box>
  );
};

export const renderMainUi = async (account: string, chainId: string) => {
  try {
    const { score, scoreName, url, image, tokenId, updated_ms, referralCode } =
      await getScore(chainId, account);

    let imageSrc;

    if (image) {
      imageSrc = await getImageComponent(image, { width: 400 });
    }

    const twitterShareText = `I've just unlocked my potential with ${scoreName} Score by @0xNomis! What is your web3 reputation like? https://nomis.cc${url} %23OnchainReputation %23Nomis`;

    const shareText = `I've just unlocked my potential with ${scoreName} Score by Nomis! What is your web3 reputation like? https://nomis.cc${url} %23OnchainReputation %23Nomis`;

    if (!score) {
      return (
        <Box>
          <Heading>{scoreName} Score: unknown</Heading>
          <Divider />
          <Box direction="horizontal" alignment="space-between">
            <Text>
              <Link href={`https://nomis.cc${url}`}>Mint your score</Link>
            </Text>
            <Form name="calculate-score">
              <Button name="calculate-score" type="submit">
                Calculate Score
              </Button>
            </Form>
          </Box>
        </Box>
      );
    }

    return (
      <Box>
        <Heading>{`${scoreName} Score: ${score || 'unknown'}`}</Heading>
        <Divider />
        {imageSrc ? <Image src={imageSrc.value} /> : null}
        <Row label="Score">
          <Text>{String(score)}</Text>
        </Row>
        <Row label="Token id">
          <Text>{String(tokenId)}</Text>
        </Row>
        <Row label="Updated">
          <Text>{new Date(updated_ms).toLocaleString('en-Us')}</Text>
        </Row>
        <Box direction="horizontal" alignment="space-between">
          <Text>
            <Link href={`https://nomis.cc${url}`}>Mint your score</Link>
          </Text>
          <Form name="calculate-score">
            <Button name="calculate-score" type="submit">
              Calculate Score
            </Button>
          </Form>
        </Box>
        {referralCode ? <Divider /> : null}
        {referralCode ? (
          <Box direction="horizontal" alignment="space-between">
            <Text>
              <Link href={`https://twitter.com/share?url=${twitterShareText}`}>
                Share in X
              </Link>
            </Text>
            <Text>
              <Link href={`https://t.me/share/url?url=${shareText}`}>
                Share in Telegram
              </Link>
            </Text>
          </Box>
        ) : null}
      </Box>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return renderMainUiWithError(message);
  }
};

export const renderMainUiWithLoading = () => {
  return (
    <Box>
      <Heading>Calculating score...</Heading>
      <Spinner />
      <Divider />
      <Form name="back">
        <Button variant="destructive" type="submit">
          Back
        </Button>
      </Form>
    </Box>
  );
};

export const renderMainUiWithScore = (
  score: number,
  scoreName: string,
  url: string,
) => {
  return (
    <Box>
      <Heading>{`${scoreName} Score: ${Number(
        (score * 100).toFixed(2),
      )}`}</Heading>
      <Box direction="horizontal" alignment="space-between">
        <Form name="back">
          <Button variant="destructive" type="submit">
            Back
          </Button>
        </Form>
        <Text>
          <Link href={`https://nomis.cc${url}`}>Mint score</Link>
        </Text>
      </Box>
    </Box>
  );
};

export const renderTransactionUi = async (
  chainId: string,
  senderAccount: string,
  recipientAccount: string,
) => {
  try {
    const [senderData, recipientData] = await Promise.all([
      getScore(chainId, senderAccount),
      getScore(chainId, recipientAccount),
    ]);

    if (recipientData.isHolder) {
      let imageSrc;

      if (recipientData.image) {
        imageSrc = await getImageComponent(recipientData.image, { width: 400 });
      }

      return {
        content: (
          <Box>
            <Heading>
              Recipient {recipientData.scoreName} Score:{' '}
              {String(recipientData.score)}
            </Heading>
            <Divider />
            {imageSrc?.value ? <Image src={imageSrc.value} /> : null}
            <Text>
              <Link href={`https://nomis.cc${recipientData.url}`}>
                {senderData.isHolder ? 'Update your score' : 'Get your score'}
              </Link>
            </Text>
          </Box>
        ),
      };
    }

    return {
      content: (
        <Box>
          <Heading>
            Recipient doesn't have a {senderData.scoreName} Score
          </Heading>
          <Divider />
          <Text>
            <Link href={`https://nomis.cc${recipientData.url}`}>
              {senderData.isHolder ? 'Update your score' : 'Get your score'}
            </Link>
          </Text>
        </Box>
      ),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return {
      content: renderMainUiWithError(message),
    };
  }
};
