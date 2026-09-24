import { describe, expect, it } from "vitest";
import { flattenSkillsData } from "@/components/SkillGraph";
import skillsDe from "@/data/skills.json";
import skillsEn from "@/data/skills_en.json";

describe("flattenSkillsData", () => {
  it("keeps direct ratings as they are", () => {
    expect(flattenSkillsData({ Languages: { C: 2, Dart: 3 } })).toEqual({
      Languages: { C: 2, Dart: 3 },
    });
  });

  it("replaces a nested group by the rounded mean of its ratings", () => {
    expect(
      flattenSkillsData({
        Languages: { Scripting: { Python: 3, JavaScript: 3, TypeScript: 4 }, C: 2 },
      }),
    ).toEqual({ Languages: { Scripting: 3, C: 2 } });
    expect(flattenSkillsData({ Web: { React: { React: 4, "Next.js": 5 } } })).toEqual({
      Web: { React: 5 },
    });
  });

  it("drops an empty nested group but keeps the category", () => {
    expect(flattenSkillsData({ Tools: { Empty: {} } })).toEqual({ Tools: {} });
  });

  it("returns an empty object for empty input", () => {
    expect(flattenSkillsData({})).toEqual({});
  });

  it.each([
    ["skills.json", skillsDe],
    ["skills_en.json", skillsEn],
  ])("flattens %s to ratings between 1 and 5", (_name, data) => {
    const flat = flattenSkillsData(data);
    expect(Object.keys(flat)).toEqual(Object.keys(data));
    for (const skills of Object.values(flat)) {
      for (const rating of Object.values(skills)) {
        expect(Number.isInteger(rating)).toBe(true);
        expect(rating).toBeGreaterThanOrEqual(1);
        expect(rating).toBeLessThanOrEqual(5);
      }
    }
  });
});
