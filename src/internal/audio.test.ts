import { afterEach, describe, expect, it, vi } from "vitest";

import { audioContextCtor, normalizePeaks } from "./audio";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("normalizePeaks", () => {
  it("scales the loudest level to 1 and rounds to hundredths", () => {
    expect(normalizePeaks([0.1, 0.4, 0.2])).toEqual([0.25, 1, 0.5]);
    expect(normalizePeaks([1, 3])).toEqual([0.33, 1]);
  });

  it("keeps silent levels as they are", () => {
    expect(normalizePeaks([0, 0, 0])).toEqual([0, 0, 0]);
    expect(normalizePeaks([])).toEqual([]);
  });
});

describe("audioContextCtor", () => {
  it("is the standard constructor, then the prefixed one, else undefined", () => {
    class Standard {}
    class Prefixed {}
    vi.stubGlobal("AudioContext", Standard);
    vi.stubGlobal("webkitAudioContext", Prefixed);
    expect(audioContextCtor()).toBe(Standard);
    vi.stubGlobal("AudioContext", undefined);
    expect(audioContextCtor()).toBe(Prefixed);
    vi.stubGlobal("webkitAudioContext", undefined);
    expect(audioContextCtor()).toBeUndefined();
  });
});
