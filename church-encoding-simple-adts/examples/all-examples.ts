// begin-snippet: adt-boolean-definition
type ADTBoolean = True | False;

type True = { tag: "true" };
type False = { tag: "false" };
// end-snippet

// begin-snippet: adt-boolean-functions
function and(left: ADTBoolean, right: ADTBoolean): ADTBoolean {
    return left.tag === "true" ? right : { tag: "false" };
}

function or(left: ADTBoolean, right: ADTBoolean): ADTBoolean {
    return left.tag === "true" ? { tag: "true" } : right;
}
// end-snippet

// begin-snippet: adt-boolean-encode-decode
function adtEncodeBoolean(bool: boolean): ADTBoolean {
    return bool ? { tag: "true" } : { tag: "false" };
}

function adtDecodeBoolean(bool: ADTBoolean): boolean {
    return bool.tag === "true" ? true : false;
}
// end-snippet

// begin-snippet: church-boolean-definition
type ChurchBoolean = <A>(choices: { tru: () => A, fals: () => A}) => A;

function churchEncodeBoolean(bool: ADTBoolean): ChurchBoolean {
    return bool.tag === "true" ? ({ tru, fals }) => tru()
    :                            ({ tru, fals }) => fals();
}
// end-snippet

// begin-snippet: church-boolean-functions
const tru: ChurchBoolean = ({ tru, fals }) => tru();
const fals: ChurchBoolean = ({ tru, fals }) => fals();

function churchAnd(
    left: ChurchBoolean,
    right: ChurchBoolean): ChurchBoolean {

    return left({
        tru: () => right,
        fals: () => fals
    })
}

function churchOr(
    left: ChurchBoolean,
    right: ChurchBoolean): ChurchBoolean {

    return left({
      tru: () => tru,
      fals: () => right
    });
}

// Contrived example of how these might be used
const oneIsOdd = tru;
const twoIsOdd = fals;

// Using a Church boolean to create a string
const message = churchAnd(oneIsOdd, twoIsOdd)({
  tru: () => "both 1 and 2 are odd numbers",
  fals: () => "at least one of 1 or 2 are not an odd number"
});

// We can return other types from a Church Boolean as well
const undefinedIfOneIsOdd: undefined | number = oneIsOdd({
  tru: () => undefined,
  fals: () => 1
})

// Show that we can turn our Church boolean back into an ADT
// without losing information, which establishes that they are
// equivalent.
function churchDecodeBoolean(bool: ChurchBoolean): ADTBoolean {
    return bool<ADTBoolean>({
        tru: () => ({ tag: "true" }),
        fals: () => ({ tag: "false" })
    });
}
// end-snippet

// begin-snippet: adt-tuple-definition
type Tuple<A, B> = {
    tag: 'tuple',
    first: A,
    second: B
}
// end-snippet

// begin-snippet: adt-tuple-instantiation
const pair: Tuple<number, string> = {
    tag: 'tuple',
    first: 1,
    second: 'hello world'
}
// end-snippet

// begin-snippet: church-tuple-definition
type ChurchTuple<A, B> = <C>(fn: (first: A, second: B) => C) => C;

function churchEncodeTuple<A, B>(tuple: Tuple<A, B>): ChurchTuple<A, B> {
    return fn => fn(tuple.first, tuple.second);
}
// end-snippet

// begin-snippet: church-tuple-usage
// Convenience functions, for readability
function adtTuple<A, B>(first: A, second: B): Tuple<A, B> {
    return {
        tag: 'tuple',
        first,
        second
    };
}

function churchTuple<A, B>(a: A, b: B): ChurchTuple<A, B> {
    return function(fn) {
        return fn(a, b);
    }
}

const fourFiveAdt = adtTuple(4, 5);
const fourFiveChurch = churchTuple(4, 5);

const twenty = fourFiveAdt.first * fourFiveAdt.second;
const twentyAgain = fourFiveChurch((first, second) => first * second);

const fortyFive = `${fourFiveAdt.first}{fourFiveAdt.second}`;
const fortyFiveAgain = fourFiveChurch(
    (first, second) => `${first}${second}`);
// end-snippet

// begin-snippet: church-tuple-decode
function decodeChurchTuple<A, B>(tuple: ChurchTuple<A, B>): Tuple<A, B> {
    return tuple((first, second) => ({
        tag: 'tuple',
        first,
        second
    }));
}
// end-snippet

// begin-snippet: request-state-adt-definition
type RequestState =
    | NotYetSent
    | InProgress
    | Succeeded
    | Failed;

type NotYetSent = { tag: "NotYetSent" };
type InProgress = { tag: "InProgress" };
type Succeeded = {
    tag: "Succeeded",
    result: string
}
type Failed = {
    tag: "Failed",
    errorCode: number,
    errorMessage: string
}
// end-snippet

// begin-snippet: church-succeeded-and-failed
type ChurchSucceeded = <A>(fn: (result: string) => A) => A;
type ChurchFailed = <A>(fn: (errorCode: number, errorMessage: string) => A) => A;
// end-snippet

// begin-snippet: church-request-state-definition
type ChurchRequestState = <A>(choices: {
    notYetSent: () => A,
    inProgress: () => A,
    succeeded: (result: string) => A,
    failed: (errorCode: number, errorMessage: string) => A
}) => A
// end-snippet

// begin-snippet: church-request-state-encode-decode
function churchEncodeRequestState(
    requestState: RequestState
    ): ChurchRequestState {

    return function<A>(choices: {
        notYetSent: () => A,
        inProgress: () => A,
        succeeded: (result: string) => A,
        failed: (errorCode: number, errorMessage: string) => A
    }): A {
        if (requestState.tag === "NotYetSent") {
            return choices.notYetSent();
        } 

        if (requestState.tag === "InProgress") {
            return choices.inProgress();
        }

        if (requestState.tag === "Succeeded") {
            return choices.succeeded(requestState.result);
        }

        return choices.failed(
            requestState.errorCode,
            requestState.errorMessage);
    }
}

function churchDecodeRequestState(
    churchRequestState: ChurchRequestState): RequestState {

    return churchRequestState<RequestState>({
        notYetSent: () => ({ tag: "NotYetSent" }),
        inProgress: () => ({ tag: "InProgress" }),
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

const adtRequestState: RequestState = undefined as any;
const churchRequestState: ChurchRequestState = undefined as any;

// begin-snippet: request-state-usage
// Using an ADT
let uiContents;
if(adtRequestState.tag === "NotYetSent") {
    uiContents = "request pending...";
} else if (adtRequestState.tag === "InProgress") {
    uiContents = "loading...";
} else if (adtRequestState.tag === "Succeeded") {
    uiContents = adtRequestState.result;
} else {
    const {errorCode, errorMessage} = adtRequestState;
    uiContents = `Received error ${errorCode}: ${errorMessage}`
}

// Using a Church encoding
const uiContents2 = churchRequestState({
    notYetSent: () => "request pending...",
    inProgress: () => "loading...",
    succeeded: result => result,
    failed: (code, msg) => `Recieved error ${code}: ${msg}` 
})
// end-snippet

// begin-snippet: purist-church-request-state
type PuristChurchRequestState =
    <T>(handleNotYetSent: () => T) =>
       (handleInProgress: () => T) =>
       (handleSuccess: (result: string) => T) =>
       (handleError: (errorCode: number) => (errorMessage: string) => T) => T
// end-snippet
