# LGCode

日本の市区町村名から地方公共団体コード（6桁の数値コード）を返すESモジュール（80KB）です。

## 使い方

```js
import { LGCode } from "https://code4fukui.github.io/LGCode/LGCode.js";

console.log(LGCode.encode("Tokyo", "Shinjuku")); // "131041"
console.log(LGCode.encode("Fukui", "Sabae")); // "182079"
console.log(LGCode.encode("Hokkaido", "Sapporo")); // "011002"

console.log(LGCode.decode("131041")); // ["Tokyo", "Special Ward", "Shinjuku"]
console.log(LGCode.decode("182079")); // ["Fukui", "Sabae"]

console.log(LGCode.normalize(18207)); // Add check digit: 182079
```

## テスト

```
$ deno test test/LGCode.test.js
```

## データ生成

統計データLOD（SPARQL）からデータを取得し、`LG_CODE.js`ファイルを生成します。
```
$ deno run -A tools/make.js
```

## データソース

- [統計データLOD](https://data.e-stat.go.jp/lodw/)

## 関連記事

- [政府データで住所を町丁目レベルまでジオコーディング！ 住所変換コンポーネントの移行準備](https://fukuno.jig.jp/2867)
- [日本政府発のJavaScriptライブラリを勝手にWeb標準化するプロジェクト、全角半角統一コンポーネントのESモジュール/Deno対応版公開](https://fukuno.jig.jp/2865)

## ライセンス

MIT License
