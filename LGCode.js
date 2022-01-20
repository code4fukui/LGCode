import { LG_CODE } from "./LG_CODE.js";
import { ArrayUtil } from "https://js.sabae.cc/ArrayUtil.js";

let prefs = null;

const fromLGCode = (code) => {
  let ncode = parseInt(code);
  if (isNaN(ncode) || !ncode) return null;
  const res = [];
  for (;;) {
    const l = LG_CODE[ncode];
    if (!l) return null;
    res.unshift(l[1]);
    ncode = l[0];
    if (!ncode) break;
  }
  return res;
};

let lgrevmap = null; // [code, name]

const queryMap = (cityname) => {
  if (!lgrevmap) {
    lgrevmap = makeReverseMap(LG_CODE);
  }
  let res = lgrevmap[cityname];
  if (res) return res;
  if (cityname.indexOf("ヶ") >= 0) return lgrevmap[cityname.replace("ヶ", "ケ")];
  if (cityname.indexOf("ケ") >= 0) return lgrevmap[cityname.replace("ケ", "ヶ")];
  return null;
};

const makeCodeResult = (res) => {
  if (!res) return null;
  if (res.length === 1) return res[0][0];
  return res.map((a) => a[0]);
};
const getLGCodeFrom2 = (cityname1, cityname2) => {
  const l = queryMap(cityname2);
  if (!l) return null;
  const l2 = queryMap(cityname1);
  if (!l2 || l2.length !== 1) return null;
  const pcode = parseInt(l2[0][0]);
  const l3 = l.filter((a) => {
    if (a[1] == pcode) return true;
    return LG_CODE[a[1]][0] == pcode;
  });
  return makeCodeResult(l3);
};

const findLGCode = (cityname1) => {
  return makeCodeResult(queryMap(cityname1));
};

const getLGCode = (cityname1, cityname2 = null, cityname3 = null) => {
  if (!cityname1) { // 0 params
    return null;
  }
  if (!cityname2) { // 1 param
    //return makeCodeResult(queryMap(cityname1));
    if (!prefs) {
      prefs = getPrefs();
    }
    for (let i = 0; i < prefs.length; i++) {
      const pref = prefs[i];
      if (cityname1.startsWith(pref)) {
        if (cityname1 == pref) {
          return addCheckDigit(i + 1);
        }
        cityname2 = cityname1.substring(pref.length);
        cityname1 = pref;
        break;
      }
    }
    if (!cityname2) {
      return null;
    }
  }
  if (!cityname3) { // 2 params
    if (cityname2.endsWith("区")) { // 都道府県の代わりに市を使う
      const n = cityname2.indexOf("市");
      if (n >= 0) {
        const city = cityname2.substring(0, n + 1);
        const ku = cityname2.substring(n + 1);
        return getLGCodeFrom2(city, ku);
      }
    }
    if (cityname2.endsWith("町") || cityname2.endsWith("村")) { // 郡は無視
      const n = cityname2.indexOf("郡");
      if (n > 0 && n < cityname2.length - 2) { // 兵庫県上郡町 対策
        const town = cityname2.substring(n + 1);
        return getLGCodeFrom2(cityname1, town);
      }
    }
    return getLGCodeFrom2(cityname1, cityname2);
  }
  // 3params (ignore cityname1)
  return getLGCodeFrom2(cityname2, cityname3);
};

const makeReverseMap = (map) => {
  const res = {};
  for (const code in LG_CODE) {
    const [parent, name] = LG_CODE[code];
    let a = res[name];
    if (!a) {
      a = res[name] = [];
    }
    a.push([parseInt(code), parent]);
  }
  return res;
};

const getCityChildren = (nameorcode) => {
  if (!nameorcode) {
    return null;
  }
  const code = getCityChildrenWithDistrict(nameorcode);
  if (!code) return null;
  const res = [];
  code.forEach((c) => {
    if (c[1].endsWith("郡") || c[1].endsWith("振興局") || c[1] == "特別区部") {
      const district = getCityChildrenWithDistrict(c[0]);
      district.forEach((d) => res.push(d));
    } else {
      res.push(c);
    }
  });
  return res;
};

const queryCode = (nameorcode) => {
  let code = parseInt(nameorcode);
  if (isNaN(code)) {
    //code = getLGCode(nameorcode);
    code = makeCodeResult(queryMap(nameorcode));
    if (!code || Array.isArray(code)) return null;
  }
  return [...LG_CODE[code], code];
};

const getCityChildrenWithDistrict = (nameorcode) => {
  const l = queryCode(nameorcode);
  if (!l) return null;
  const code = l[2];
  const res = [];
  for (const c in LG_CODE) {
    const d = LG_CODE[c];
    if (d[0] == code) {
      const name = d[1];
      res.push([parseInt(c), name]);
    }
  }
  return res;
};

const getCityParent = (nameorcode) => {
  const l = queryCode(nameorcode);
  if (!l) return null;
  return [l[0], LG_CODE[l[0]][1]];
};

const searchCities = (name) => {
  const res = [];
  for (const n in LG_CODE) {
    const city = LG_CODE[n];
    const cityname = city[1];
    if (cityname.indexOf(name) >= 0) {
      res.push([n, cityname]);
    }
  }
  return res;
};

const getPrefs = () => {
  const prefs = [];
  for (const lg in LG_CODE) {
    if (lg > 0 && lg % 1000 == 0) {
      //console.log(lg, LG_CODE[lg]);
      prefs.push(LG_CODE[lg][1]);
    }
  }
  return prefs;
};

const addCheckDigit = (code) => {
  if (!code) {
    return null;
  }
  if (Array.isArray(code)) {
    return code.map(c => addCheckDigit(c));
  }
  const tcode = typeof code;
  if (tcode == "number") {
    code = code.toString();
  } else if (tcode != "string") {
    return null; // throw new Error("not LGcode");
  }
  if (code.length == 1) {
    code = "0" + code + "000";
  } else if (code.length == 2) {
    code = code + "000";
  } else if (code.length < 5) {
    code = ("0000" + code).substring(code.length + 4 - 5);
  } else if (code.length == 6) {
    const res = addCheckDigit(code.substring(0, 5));
    if (res != code) {
      return null; // throw new Error("not LGcode");
    }
    return code;
  }
  if (code.length != 5) {
    return null; // throw new Error("not LGcode");
  }
	let sum = 0;
  for (let i = 0; i < code.length; i++) {
    const n = parseInt(code[i]);
    sum += n * (6 - i);
	}
	const chk = (11 - sum % 11) % 10;
	return code + chk;
};

const removeCheckDigit = (code) => {
  const tcode = typeof code;
  if (tcode != "string" || code.length != 6) {
    return null; // throw new Error("not LGcode");
  }
  addCheckDigit(code);
  return parseInt(code.substring(0, 5));
};

class LGCode {
  static normalize(code) {
    return addCheckDigit(code);
  }
  static parse(code) {
    return removeCheckDigit(code);
  }
  static decode(code) {
    return fromLGCode(removeCheckDigit(code));
  }
  static decodeByPrefCity(code) {
    const names = fromLGCode(removeCheckDigit(code));
    if (!names) {
      return null;
    }
    if (names.length == 1) {
      return [names[0], ""];
    }
    const pref = names[0];
    const s = names[1];
    if (s.endsWith("振興局") || s.endsWith("郡") || s == "特別区部") {
      return [pref, names[2]];
    }
    return [pref, names[1]];
  }
  static encode(s1, s2, s3) {
    return addCheckDigit(getLGCode(s1, s2, s3));
  }
  static find(s) {
    return addCheckDigit(findLGCode(s));
  }
  static getPrefs() {
    return getPrefs();
  }
  static getCities(pref) {
    //return getCityChildren(pref)?.sort((a, b) => a[0] - b[0]).map(p => p[1]);
    const res = getCityChildren(pref)?.map(p => p[1]);
    // 泊村、重複は1つにする
    if (!ArrayUtil.isUnique(res)) {
      return ArrayUtil.toUnique(res);
    }
    return res;
  }
  static getWards(pref, city) {
    const code = removeCheckDigit(this.encode(pref, city));
    const res = getCityChildren(code);
    const wards = res.map(d => d[1]);
    return wards;
  }
}

export { LGCode };
