# LGCode

An ES module (80KB) that returns the local government code (6-digit numeric code) from the municipality in Japan.

## Usage

```js
import { LGCode } from "https://code4fukui.github.io/LGCode/LGCode.js";

console.log(LGCode.encode("Tokyo", "Shinjuku")); // "131041"
console.log(LGCode.encode("Fukui", "Sabae")); // "182079"
console.log(LGCode.encode("Hokkaido", "Sapporo")); // "011002"

console.log(LGCode.decode("131041")); // [ "Tokyo", "Special Ward", "Shinjuku" ]
console.log(LGCode.decode("182079")); // [ "Fukui", "Sabae" ]

console.log(LGCode.normalize(18207)); // Add check digit: 182079
```

## Test

```
$ deno test test/LGCode.test.js
```

## Data Generation

Fetch data from the Statistics Open Data portal (SPARQL) and generate the `LG_CODE.js` file.
```
$ deno run -A tools/make.js
```

## Data Source

- [Statistics Open Data portal](https://data.e-stat.go.jp/lodw/)

## Related Articles

- [Geocoding addresses down to the neighborhood level using government data! Preparing to migrate an address conversion component](https://fukuno.jig.jp/2867)
- [A project to voluntarily web-standardize a JavaScript library from the Japanese government, publishing an ES module/Deno-compatible version of the full-width-half-width unification component](https://fukuno.jig.jp/2865)