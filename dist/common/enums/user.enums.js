"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderEnum = exports.GenderEnum = void 0;
var GenderEnum;
(function (GenderEnum) {
    GenderEnum[GenderEnum["male"] = 0] = "male";
    GenderEnum[GenderEnum["female"] = 1] = "female";
})(GenderEnum || (exports.GenderEnum = GenderEnum = {}));
var ProviderEnum;
(function (ProviderEnum) {
    ProviderEnum[ProviderEnum["system"] = 0] = "system";
    ProviderEnum[ProviderEnum["Google"] = 1] = "Google";
})(ProviderEnum || (exports.ProviderEnum = ProviderEnum = {}));
