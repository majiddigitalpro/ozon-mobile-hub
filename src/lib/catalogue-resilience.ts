/** Public pages remain usable during a catalogue outage; never invent stock or prices. */
export async function readPublicCatalogue<T>(
  read: () => PromiseLike<{ data: T[] | null; error: unknown }>,
): Promise<T[]> {
  try {
    const result = await read();
    if (result.error) {
      console.warn("Public catalogue temporarily unavailable");
      return [];
    }
    return result.data ?? [];
  } catch {
    console.warn("Public catalogue temporarily unavailable");
    return [];
  }
}