export function genUuid(stringVector=16) {
    return `${Math.random()*1e8.toString(stringVector)}`;
};