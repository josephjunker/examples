"use strict";
// end-snippet
// begin-snippet: adt-boolean-functions
function and(left, right) {
    return left.tag === "true" ? right : { tag: "false" };
}
function or(left, right) {
    return left.tag === "true" ? { tag: "true" } : right;
}
// end-snippet
// begin-snippet: adt-boolean-encode-decode
function adtEncodeBoolean(bool) {
    return bool ? { tag: "true" } : { tag: "false" };
}
function adtDecodeBoolean(bool) {
    return bool.tag === "true" ? true : false;
}
function churchEncodeBoolean(bool) {
    return bool.tag === "true" ? ({ tru, fals }) => tru
        : ({ tru, fals }) => fals;
}
// end-snippet
// begin-snippet: church-boolean-functions
const tru = ({ tru, fals }) => tru;
const fals = ({ tru, fals }) => fals;
function churchAnd(left, right) {
    return left({
        tru: right,
        fals
    });
}
function churchOr(left, right) {
    return left({
        tru,
        fals: right
    });
}
// Contrived example of how these might be used
const oneIsOdd = tru;
const twoIsOdd = fals;
// Using a Church boolean to create a string
const message = churchAnd(oneIsOdd, twoIsOdd)({
    tru: "both 1 and 2 are odd numbers",
    fals: "at least one of 1 or 2 are not an odd number"
});
// We can return other types from a Church Boolean as well
const undefinedIfOneIsOdd = oneIsOdd({
    tru: undefined,
    fals: 1
});
// Show that we can turn our Church boolean back into an ADT
// without losing information, which establishes that they are
// equivalent.
function churchDecodeBoolean(bool) {
    return bool({
        tru: { tag: "true" },
        fals: { tag: "false" }
    });
}
// end-snippet
// begin-snippet: adt-tuple-instantiation
const pair = {
    tag: 'tuple',
    first: 1,
    second: 'hello world'
};
function churchEncodeTuple(tuple) {
    return fn => fn(tuple.first, tuple.second);
}
// end-snippet
// begin-snippet: church-tuple-usage
// Convenience functions, for readability
function adtTuple(first, second) {
    return {
        tag: 'tuple',
        first,
        second
    };
}
function churchTuple(a, b) {
    return function (fn) {
        return fn(a, b);
    };
}
const fourFiveAdt = adtTuple(4, 5);
const fourFiveChurch = churchTuple(4, 5);
const twenty = fourFiveAdt.first * fourFiveAdt.second;
const twentyAgain = fourFiveChurch((first, second) => first * second);
const fortyFive = `${fourFiveAdt.first}{fourFiveAdt.second}`;
const fortyFiveAgain = fourFiveChurch((first, second) => `${first}${second}`);
// end-snippet
// begin-snippet: church-tuple-decode
function decodeChurchTuple(tuple) {
    return tuple((first, second) => ({
        tag: 'tuple',
        first,
        second
    }));
}
// end-snippet
// begin-snippet: church-request-state-encode-decode
function churchEncodeRequestState(requestState) {
    return function (choices) {
        if (requestState.tag === "NotYetSent") {
            return choices.notYetSent;
        }
        if (requestState.tag === "InProgress") {
            return choices.inProgress;
        }
        if (requestState.tag === "Succeeded") {
            return choices.succeeded(requestState.result);
        }
        return choices.failed(requestState.errorCode, requestState.errorMessage);
    };
}
function churchDecodeRequestState(churchRequestState) {
    return churchRequestState({
        notYetSent: { tag: "NotYetSent" },
        inProgress: { tag: "InProgress" },
        succeeded: result => ({
            tag: "Succeeded",
            result
        }),
        failed: (errorCode, errorMessage) => ({
            tag: "Failed",
            errorCode,
            errorMessage
        })
    });
}
// end-snippet
const adtRequestState = undefined;
const churchRequestState = undefined;
// begin-snippet: request-state-usage
// Using an ADT
let uiContents;
if (adtRequestState.tag === "NotYetSent") {
    uiContents = "request pending...";
}
else if (adtRequestState.tag === "InProgress") {
    uiContents = "loading...";
}
else if (adtRequestState.tag === "Succeeded") {
    uiContents = adtRequestState.result;
}
else {
    const { errorCode, errorMessage } = adtRequestState;
    uiContents = `Received error ${errorCode}: ${errorMessage}`;
}
// Using a Church encoding
const uiContents2 = churchRequestState({
    notYetSent: "request pending...",
    inProgress: "loading...",
    succeeded: result => result,
    failed: (code, msg) => `Recieved error ${code}: ${msg}`
});
// end-snippet
