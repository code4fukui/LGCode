import * as t from "https://deno.land/std/testing/asserts.ts";
import { LGCode } from "../LGCode.js";
import { ArrayUtil } from "https://js.sabae.cc/ArrayUtil.js";

Deno.test("allCode", () => {
  const list1 = [];
  const prefs = LGCode.getPrefs();
  for (const pref of prefs) {
    const cities = LGCode.getCities(pref);
    cities.forEach(c => list1.push(pref + c));
  }
  console.log(list1, list1.length);
  t.assertEquals(list1.length, 1741); // 1742 - 1(泊村)
  t.assertEquals(prefs.length + list1.length, 1788); // + 47

  const code1 = list1.map(c => {
    const code = LGCode.encode(c);
    if (Array.isArray(code)) {
      return "014036"; // 泊村は強制的に、後志総合振興局のものに
    }
    if (!code) {
      console.log(c);
      throw new Error();
    }
    return code;
  }).filter(c => c);
  const code1u = ArrayUtil.toUnique(code1);
  t.assertEquals(code1u.length, code1.length);

  const code2 = code1u.map(c => {
    const code = LGCode.parse(c);
    if (!code) {
      console.log(c); // [ "014036", "016969" ]
      throw new Error();
    }
    return code;
  });
  const dup = ArrayUtil.toDuplicated(code2);
  console.log(dup);
  t.assertEquals(dup.length, 0);
  t.assertEquals(ArrayUtil.toUnique(code2).length, code1.length);

  const code3 = code2.map(c => LGCode.normalize(c));
  const code4 = code2.map(c => "0" + c);
  const code34 = [];
  code3.forEach(c => code34.push(c));
  code4.forEach(c => code34.push(c));
  const dup2 = ArrayUtil.toDuplicated(code34);
  console.log(dup2, dup2.length);
  /*
[
  "012203", "012211",
  "012220", "012238",
  "014362", "015202",
  "015504", "016322",
  "023213", "023230",
  "043214", "044211"
] 12
  */
});

