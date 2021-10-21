import * as t from "https://deno.land/std/testing/asserts.ts";
import { LGCode } from "../LGCode.js";

Deno.test("decode", () => {
  t.assertEquals(LGCode.encode("沖縄県", "島尻郡", "渡名喜村"), "473561");
  t.assertEquals(LGCode.encode("沖縄県", "島尻郡渡名喜村"), "473561");
  t.assertEquals(LGCode.encode("沖縄県", "渡名喜村"), "473561");
  t.assertEquals(LGCode.encode("沖縄県", "渡名喜村"), "473561");
  t.assertEquals(LGCode.encode("沖縄県渡名喜村"), "473561");
  t.assertEquals(LGCode.encode("渡名喜村"), null); // 都道府県必須 "473561");
  t.assertEquals(LGCode.encode("福井県鯖江市"), "182079");
  t.assertEquals(LGCode.encode("福井県高浜町"), "184811");
  t.assertEquals(LGCode.encode("福井県大飯郡高浜町"), "184811"); // 群はあってもいい
  t.assertEquals(LGCode.encode("福井県"), "180009");
});
Deno.test("encode", () => {
  t.assertEquals(LGCode.decode("473561"), ["沖縄県", "島尻郡", "渡名喜村"]);
  t.assertEquals(LGCode.decode("182079"), ["福井県", "鯖江市"]);
  t.assertEquals(LGCode.decode("184811"), ["福井県", "大飯郡", "高浜町"]);
});
Deno.test("find", () => {
  const expect = [
    "016446",
    "183822",
    "204811",
    "214043",
  ];
  t.assertEquals(LGCode.find("池田町"), expect);
  t.assertEquals(LGCode.find("福野町"), null);
});
Deno.test("normalize", () => {
  t.assertEquals(LGCode.normalize(18207), "182079");
  t.assertEquals(LGCode.normalize(1), "010006");
  t.assertEquals(LGCode.decode("010006"), ["北海道"]);
  t.assertEquals(LGCode.normalize(18), "180009");
  t.assertEquals(LGCode.decode("180009"), ["福井県"]);
});
