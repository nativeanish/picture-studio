import { _derivation } from "../stores/useVideo"
type _commericial = "n" | "a" | "a-w-c";
export function getCommercial(e: "n" | "a" | "a-w-c"): string {
    switch (e) {
        case "a":
            return "Allowed"
        case "n":
            return "None"
        case "a-w-c":
            return "Allowed-With-Credit"
    }
}
export function getDerivation(e: _derivation): string {
    switch (e) {
        case "n":
            return "None"
        case "a-w-c":
            return "Allowed-With-Credit"
        case "a-w-i":
            return "Allowed-With-Indication"
        case "a-w-l-p":
            return "Allowed-With-License-Passthrough"
        case "a-w-25":
            return "Allowed-With-RevenueShare-25%"
        case "a-w-50":
            return "Allowed-With-RevenueShare-50%"
        case "a-w-75":
            return "Allowed-With-RevenueShare-75%"
        case "a-w-100":
            return "Allowed-With-RevenueShare-100%"
    }
}
export function isDerivationType(value: string): value is _derivation {
    return [
        "n",
        "a-w-c",
        "a-w-i",
        "a-w-l-p",
        "a-w-25",
        "a-w-50",
        "a-w-75",
        "a-w-100",
    ].includes(value);
}
export function isCommericalType(value: string): value is _commericial {
    return ["n", "a", "a-w-c"].includes(value);
}