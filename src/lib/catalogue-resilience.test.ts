import { describe, expect, test } from "bun:test";
import { readPublicCatalogue } from "./catalogue-resilience";

describe("public catalogue outage handling", () => {
  test("returns no invented products when the service reports an error", async () => {
    expect(await readPublicCatalogue(async () => ({ data: null, error: { status: 521 } }))).toEqual([]);
  });
  test("keeps public pages usable when the network request rejects", async () => {
    expect(await readPublicCatalogue(async () => { throw new Error("Network unavailable"); })).toEqual([]);
  });
  test("returns live catalogue rows unchanged when the service recovers", async () => {
    const rows = [{ id: "live-phone", price: 12000 }];
    expect(await readPublicCatalogue(async () => ({ data: rows, error: null }))).toEqual(rows);
  });
});