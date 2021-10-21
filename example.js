import { LGCode } from "./LGCode.js";

console.log(LGCode.encode("東京都", "新宿区"));
console.log(LGCode.encode("福井県", "鯖江市"));
console.log(LGCode.encode("北海道", "札幌市"));

console.log(LGCode.decode("131041"));
console.log(LGCode.decode("182079"));
