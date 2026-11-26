"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    name;
    type;
    hand;
    role;
    // type: 0 is human, 1 is AI
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.hand = [];
        this.role = -1;
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map