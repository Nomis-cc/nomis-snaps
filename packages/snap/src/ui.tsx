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

export const renderMainUi = async (account: string, chainId: string) => {
  const { score, scoreName, url, image, tokenId, updated_ms } = await getScore(
    chainId,
    account,
  );

  const imageSrc = await getImageComponent(image, { width: 400 });

  return (
    <Box>
      <Heading>{`${scoreName} Score: ${score || 'unknown'}`}</Heading>
      <Divider />
      <Image src={imageSrc.value} />
      {score > 0 && (
        <Row label="Score">
          <Text>{String(score)}</Text>
        </Row>
      )}
      {score > 0 && (
        <Row label="Token id">
          <Text>{String(tokenId)}</Text>
        </Row>
      )}
      {score > 0 && (
        <Row label="Updated">
          <Text>{new Date(updated_ms).toLocaleString('en-Us')}</Text>
        </Row>
      )}
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
};

export const renderMainUiWithLoading = () => {
  return (
    <Box>
      <Heading>Calculating score...</Heading>
      <Spinner />
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

export const renderMainUiWithError = () => {
  return (
    <Box>
      <Heading>Failed to calculate score</Heading>
      <Form name="back">
        <Button type="submit">Back</Button>
      </Form>
    </Box>
  );
};

export const renderTransactionUi = async (
  chainId: string,
  senderAccount: string,
  recipientAccount: string,
) => {
  const [senderData, recipientData] = await Promise.all([
    getScore(chainId, senderAccount),
    getScore(chainId, recipientAccount),
  ]);

  if (recipientData.isHolder) {
    const imageSrc = await getImageComponent(recipientData.image, {
      width: 400,
    });

    return {
      content: (
        <Box>
          <Heading>
            Recipient {recipientData.scoreName} Score:{' '}
            {String(recipientData.score)}
          </Heading>
          <Divider />
          <Image src={imageSrc.value} />
          <Text>
            <Link href={`https://nomis.cc${recipientData.url}`}>
              Get your score
            </Link>
          </Text>
        </Box>
      ),
    };
  }

  if (!senderData.isHolder) {
    return {
      content: (
        <Box>
          <Heading>Get your ${senderData.scoreName} Score</Heading>
          <Divider />
          <Text>
            <Link href={`https://nomis.cc${recipientData.url}`}>
              Get your score
            </Link>
          </Text>
        </Box>
      ),
    };
  }

  const imageSrc = await getImageComponent(senderData.image, { width: 400 });

  return {
    content: (
      <Box>
        <Heading>
          Your {senderData.scoreName} Score: {String(senderData.score)}
        </Heading>
        <Divider />
        <Image src={imageSrc.value} />
        <Text>
          <Link href={`https://nomis.cc${senderData.url}`}>
            Update your score
          </Link>
        </Text>
      </Box>
    ),
  };
};
