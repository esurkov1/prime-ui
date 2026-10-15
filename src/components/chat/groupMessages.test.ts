import { describe, expect, it } from "vitest";

import { formatMessageTime } from "@/components/message/formatMessageTime";

import { formatMessageDate, groupMessages } from "./groupMessages";

type Item = { id: string; author: string; at: Date; service?: boolean };

const NOW = new Date(2026, 9, 8, 15, 0);
const at = (day: number, hour: number, minute: number) => new Date(2026, 9, day, hour, minute);

const options = {
  getAuthor: (item: Item) => item.author,
  getDate: (item: Item) => item.at,
  getKey: (item: Item) => item.id,
  isService: (item: Item) => item.service === true,
  now: NOW,
};

describe("formatMessageDate", () => {
  it("names today and yesterday, else the day and month, with the year when it differs", () => {
    expect(formatMessageDate(at(8, 9, 0), NOW)).toBe("Сегодня");
    expect(formatMessageDate(at(7, 23, 59), NOW)).toBe("Вчера");
    expect(formatMessageDate(new Date(2026, 2, 12), NOW)).toBe("12 марта");
    expect(formatMessageDate(new Date(2025, 11, 25), NOW)).toBe("25 декабря 2025");
  });
});

describe("formatMessageTime", () => {
  it("pads hours and minutes", () => {
    expect(formatMessageTime(at(8, 9, 5))).toBe("09:05");
  });
});

describe("groupMessages", () => {
  it("adds a date before every day and positions runs of one author", () => {
    const entries = groupMessages(
      [
        { id: "1", author: "anna", at: at(7, 18, 0) },
        { id: "2", author: "anna", at: at(8, 9, 0) },
        { id: "3", author: "anna", at: at(8, 9, 1) },
        { id: "4", author: "anna", at: at(8, 9, 2) },
        { id: "5", author: "oleg", at: at(8, 9, 3) },
      ],
      options,
    );
    expect(entries.map((entry) => (entry.type === "date" ? entry.label : entry.position))).toEqual([
      "Вчера",
      "single",
      "Сегодня",
      "first",
      "middle",
      "last",
      "single",
    ]);
    const first = entries[3];
    const last = entries[5];
    expect(first.type === "message" && [first.showAuthor, first.showAvatar]).toEqual([true, false]);
    expect(last.type === "message" && [last.showAuthor, last.showAvatar]).toEqual([false, true]);
  });

  it("breaks a run on a long pause and around a service message", () => {
    const entries = groupMessages(
      [
        { id: "1", author: "anna", at: at(8, 9, 0) },
        { id: "2", author: "anna", at: at(8, 9, 30) },
        { id: "3", author: "anna", at: at(8, 9, 31), service: true },
        { id: "4", author: "anna", at: at(8, 9, 32) },
      ],
      options,
    );
    expect(
      entries.filter((entry) => entry.type === "message").map((entry) => entry.position),
    ).toEqual(["single", "single", "single", "single"]);
  });

  it("keeps the keys of the messages", () => {
    const entries = groupMessages([{ id: "m1", author: "a", at: at(8, 9, 0) }], options);
    expect(entries.map((entry) => entry.key)).toEqual(["date-2026-10-8", "m1"]);
  });

  it("reads the days in timeZone: a late UTC evening is the next morning in Vladivostok", () => {
    const utc = (day: number, hour: number) => new Date(Date.UTC(2026, 9, day, hour, 0));
    const items = [
      { id: "1", author: "anna", at: utc(7, 12) },
      { id: "2", author: "anna", at: utc(7, 15) },
    ];
    const zoned = { ...options, now: utc(8, 3) };
    const inUtc = groupMessages(items, { ...zoned, timeZone: "UTC" });
    expect(inUtc.filter((entry) => entry.type === "date").map((entry) => entry.label)).toEqual([
      "Вчера",
    ]);
    const inVladivostok = groupMessages(items, { ...zoned, timeZone: "Asia/Vladivostok" });
    expect(
      inVladivostok.map((entry) => (entry.type === "date" ? entry.label : entry.position)),
    ).toEqual(["Вчера", "single", "Сегодня", "single"]);
    const today = inVladivostok[2];
    // The day starts at midnight of the zone: 14:00 UTC the day before.
    expect(today.type === "date" && today.date.toISOString()).toBe("2026-10-07T14:00:00.000Z");
    expect(formatMessageTime(utc(7, 15), "Asia/Vladivostok")).toBe("01:00");
  });
});
