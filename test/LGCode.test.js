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
  t.assertEquals(LGCode.encode("東京都"), "130001");
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
  t.assertEquals(LGCode.normalize(131041), "131041");
  t.assertEquals(LGCode.normalize(13104), "131041");
});
Deno.test("parse", () => {
  t.assertEquals(LGCode.parse("182079"), 18207);
  t.assertEquals(LGCode.parse("131041"), 13104);
});
Deno.test("parse err", () => {
  t.assertEquals(LGCode.parse("18207"), null);
});
Deno.test("getPrefs", () => {
  t.assertEquals(LGCode.getPrefs().length, 47);
  t.assertEquals(LGCode.getPrefs()[0], "北海道");
});
Deno.test("getCities", () => {
  //t.assertEquals(LGCode.getCities("福井県"), 17);
  t.assertEquals(LGCode.getCities("福井県").length, 17);
  t.assertEquals(LGCode.getCities("福井県")[0], "福井市");
  t.assertEquals(LGCode.getCities("東京都").length, 57);
  t.assertEquals(LGCode.getCities("東京都")[0], "千代田区");
});
Deno.test("泊村問題", () => {
  // [ "014036", "016969" ]
  t.assertEquals(LGCode.decode("014036"), ["北海道", "後志総合振興局", "泊村"]);
  t.assertEquals(LGCode.decode("016969"), ["北海道", "根室振興局", "泊村"]); // 法律上のみ存在する村 https://ja.wikipedia.org/wiki/%E6%B3%8A%E6%9D%91_(%E5%8C%97%E6%B5%B7%E9%81%93%E6%A0%B9%E5%AE%A4%E6%8C%AF%E8%88%88%E5%B1%80)
});

Deno.test("decodeByPrefCity", () => {
  t.assertEquals(LGCode.decodeByPrefCity("014036"), ["北海道", "泊村"]);
  t.assertEquals(LGCode.decodeByPrefCity("182079"), ["福井県", "鯖江市"]);
  t.assertEquals(LGCode.decodeByPrefCity("473561"), ["沖縄県", "渡名喜村"]);
  t.assertEquals(LGCode.decodeByPrefCity("131032"), ["東京都", "港区"]);
  t.assertEquals(LGCode.decodeByPrefCity(""), null);
  t.assertEquals(LGCode.decodeByPrefCity("130001"), ["東京都", ""]);
});
