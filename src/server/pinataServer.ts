import axios from 'axios';

/**
 * Server-side helper to pin JSON metadata to Pinata.
 * Use a server-only env var `PINATA_JWT` (do NOT expose this to clients).
 */
export async function pinJSONToPinata(metadata: object): Promise<string> {
  const PINATA_JWT = process.env.PINATA_JWT;
  if (!PINATA_JWT) {
    throw new Error('PINATA_JWT not configured on server');
  }

  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
  const res = await axios.post(
    url,
    {
      pinataContent: metadata,
      pinataOptions: { cidVersion: 1 },
    },
    {
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res?.data?.IpfsHash) throw new Error('Pinata response missing IpfsHash');
  return res.data.IpfsHash;
}

export default pinJSONToPinata;
