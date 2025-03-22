import { queryCouchbase } from "./couchbase-utils";

export async function getUserByWalletAddress(walletAddress) {
  const query = `
    SELECT u.*
    FROM blogin._default._default u
    WHERE u.walletAddress = $walletAddress
    LIMIT 1
  `;

  const rows = await queryCouchbase(query, { walletAddress });

  return rows[0] || null;
}
