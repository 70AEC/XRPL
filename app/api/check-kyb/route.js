import { getUserByWalletAddress } from "@/lib/user";

export default async function handler(req, res) {
  const { walletAddress } = req.query;

  if (!walletAddress || typeof walletAddress !== "string") {
    return res.status(400).json({ error: "Missing wallet address" });
  }

  try {
    const user = await getUserByWalletAddress(walletAddress);

    if (!user) {
      return res.status(200).json({ exists: false });
    }

    return res.status(200).json({
      exists: true,
      kybVerified: user.kybVerified === true,
    });
  } catch (error) {
    console.error("KYB check failed:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
