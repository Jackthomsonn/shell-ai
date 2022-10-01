import { VercelRequest } from "@vercel/node";

async function buffer(readable: Buffer) {
  const chunks: any = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export const toRawBody = async (req: VercelRequest) => {
  const buf = await buffer(req as any as Buffer);

  return buf.toString("utf8");
};
