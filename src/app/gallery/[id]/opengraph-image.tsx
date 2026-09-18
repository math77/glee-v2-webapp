import { ImageResponse } from "next/og";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { gleeABI, GLEE_CONTRACT_ADDRESS } from "@/utils/contractAbi";
import { BASE_SEPOLIA_RPC_URL } from "@/utils/chain";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "A GLEE — fully onchain generative gradient art";

const BACKGROUND = "#000000";
const FOREGROUND = "#eeeef4";
const FOREGROUND_MUTED = "#8888a0";
const ACCENT = "#a0a0cc";

function fallbackImage(label: string) {
  return new ImageResponse(
    (
      <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: BACKGROUND, color: FOREGROUND, fontStyle: "italic" }}>
        <div style={{ display: "flex", fontSize: 72 }}>GLEE.</div>
        <div style={{ display: "flex", fontSize: 24, color: FOREGROUND_MUTED, marginTop: 16, fontStyle: "normal" }}>{label}</div>
      </div>
    ),
    { ...size }
  );
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const client = createPublicClient({ chain: baseSepolia, transport: http(BASE_SEPOLIA_RPC_URL) });
    const svgRaw = await client.readContract({
      address: GLEE_CONTRACT_ADDRESS,
      abi: gleeABI,
      functionName: "generateSVG",
      args: [BigInt(id)],
    }) as string;

    // Extract viewBox / size and convert SVG to a data URI for embedding in the OG image
    const svgDataUri = `data:image/svg+xml;base64,${Buffer.from(svgRaw).toString("base64")}`;

    return new ImageResponse(
      (
        <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 80, padding: 80, background: BACKGROUND }}>
          {/* Token image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={svgDataUri} width={450} height={450} alt={`GLEE #${id}`} style={{ objectFit: "contain" }} />

          {/* Text side */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 18, letterSpacing: 6, textTransform: "uppercase", color: FOREGROUND_MUTED }}>
              GLEE · #{id}
            </div>
            <div style={{ display: "flex", fontSize: 64, fontStyle: "italic", color: FOREGROUND, marginTop: 20, lineHeight: 1.1 }}>
              A living<br />gradient.
            </div>
            <div style={{ display: "flex", fontSize: 20, color: FOREGROUND_MUTED, marginTop: 24, maxWidth: 380, lineHeight: 1.5 }}>
              Generative. Onchain. Alive. Every transfer changes its form.
            </div>
            <div style={{ display: "flex", fontSize: 18, color: ACCENT, marginTop: 36 }}>
              gleenft.xyz
            </div>
          </div>
        </div>
      ),
      { ...size }
    );
  } catch {
    return fallbackImage(`GLEE #${id}`);
  }
}