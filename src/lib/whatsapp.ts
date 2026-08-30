import { BRANCHES, getBranch, type BranchId } from "@/data/branches";

/**
 * Builds a wa.me deep link with a pre-filled message.
 * Pass a branch id to route the chat to that branch's number.
 */
export function waLink(message: string, branch?: BranchId): string {
  const number = branch ? getBranch(branch).whatsapp : BRANCHES[0].whatsapp;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const waMessages = {
  general: "Hi Ozon Mobiles, I'd like some help. ",
  product: (name: string) =>
    `Hi Ozon Mobiles, I'm interested in the ${name}. Is it available?`,
  accessory: (name: string) => `Hi Ozon Mobiles, is the ${name} available?`,
  repair: (model = "[model]", problem = "[problem]") =>
    `Hi Ozon Mobiles, I need help with a phone repair. My device is ${model}. The issue is ${problem}.`,
  offers: "Hi Ozon Mobiles, could you tell me about today's available offers?",
  finance: "Hi Ozon Mobiles, I'd like to know about EMI and finance options.",
  store: (branchName: string) => `Hi ${branchName}, I have a question about your store.`,
  help: "Hi Ozon Mobiles, I couldn't find what I was looking for. Can you help me?",
};
