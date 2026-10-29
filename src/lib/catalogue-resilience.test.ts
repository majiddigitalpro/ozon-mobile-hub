import { describe, test } from "node:test";
import { deepStrictEqual } from "node:assert";
import { readPublicCatalogue } from "./catalogue-resilience";

describe("public catalogue outage handling", () => {
  test("returns no invented products when the service reports an error", async () => {
    deepStrictEqual(await readPublicCatalogue(async () => ({ data: null, error: { status: 521 } })), []);
  });
  test("keeps public pages usable when the network request rejects", async () => {
    deepStrictEqual(await readPublicCatalogue(async () => { throw new Error("Network unavailable"); }), []);
  });
  test("returns live catalogue rows unchanged when the service recovers", async () => {
    const rows = [{ id: "live-phone", price: 12000 }];
    deepStrictEqual(await readPublicCatalogue(async () => ({ data: rows, error: null })), rows);
  });
});