# 地方公共団体コード ESモジュール

市区町村から地方公共団体コード(半角数字6文字)を返すESモジュール(80KB) LGCode.js

## 使用例

```js
import { LGCode } from "./LGCode.js";
import { getLGCode, fromLGCode } from "https://code4sabae.github.io/lgcode/lgcode.mjs";

console.log(LGCode.encode("東京都", "新宿区")); // "131041"
console.log(LGCode.encode("福井県", "鯖江市")); // "182079"
console.log(LGCode.encode("北海道", "札幌市")); // "011002"

console.log(LGCode.decode("131041")); // [ "東京都", "特別区部", "新宿区" ]
console.log(LGCode.decode("182079")); // [ "福井県", "鯖江市" ]
```

## テスト

```
$ deno test test/LGCode.test.js
```

## データ生成

統計LODからSPARQLでデータ取得し LG_CODE.js を生成する
```
$ deno run -A tools/make.js
```

## 出典

- [統計LOD](https://data.e-stat.go.jp/lodw/)


## 関連記事

- [政府データを使って住所から緯度経度へ、丁目レベルのジオコーディング！ 住所変換コンポーネント移植の準備](https://fukuno.jig.jp/2867)
- [日本政府発のJavaScriptライブラリを勝手にweb標準化するプロジェクト、全角-半角統一コンポーネントのESモジュール/Deno対応版公開](https://fukuno.jig.jp/2865)
