var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
System.register("testing/spy", [], function (exports_1, context_1) {
    "use strict";
    var Spy, SpyAction, SpyActionType;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Spy = /** @class */ (function () {
                function Spy(object, property) {
                    var _this = this;
                    this.object = object;
                    this.property = property;
                    this.calls = [];
                    this.storedProperty = object[property];
                    this.and = new SpyAction(this.storedProperty);
                    var newFunctionProperty = (function () {
                        var params = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            params[_i] = arguments[_i];
                        }
                        _this.calls.push(params);
                        return _this.and.call(params);
                    });
                    newFunctionProperty[Spy.MARKER] = this;
                    object[property] = newFunctionProperty;
                }
                Spy.isSpy = function (object) {
                    return !!object[Spy.MARKER];
                };
                Spy.assertSpy = function (object) {
                    if (!Spy.isSpy(object))
                        throw new Error('Object is not a spy.');
                    return object[Spy.MARKER];
                };
                Spy.prototype.reset = function () {
                    this.object[this.property] = this.storedProperty;
                };
                Spy.prototype.clearCalls = function () {
                    this.calls.length = 0;
                };
                Spy.prototype.getCalls = function () {
                    return this.calls;
                };
                Spy.prototype.toString = function () {
                    var objectString = this.object['constructor']['name'] === 'Function' ?
                        this.object['name'] : this.object['constructor']['name'];
                    return objectString + "." + this.property;
                };
                Spy.MARKER = '__jas_spy__';
                return Spy;
            }());
            exports_1("Spy", Spy);
            SpyAction = /** @class */ (function () {
                function SpyAction(defaultImplementation) {
                    this.defaultImplementation = defaultImplementation;
                    this.actionType = SpyActionType.DO_NOTHING;
                    this.fakeCall = null;
                }
                SpyAction.prototype.call = function (params) {
                    switch (this.actionType) {
                        case SpyActionType.CALL_THROUGH:
                            return this.defaultImplementation.apply(this, __spread(params));
                        case SpyActionType.DO_NOTHING:
                            break;
                        case SpyActionType.FAKE:
                            return this.fakeCall.apply(this, __spread(params));
                    }
                };
                SpyAction.prototype.callThrough = function () {
                    this.actionType = SpyActionType.CALL_THROUGH;
                };
                SpyAction.prototype.callFake = function (fakeFn) {
                    this.actionType = SpyActionType.FAKE;
                    this.fakeCall = fakeFn;
                };
                SpyAction.prototype.returnValue = function (retValue) {
                    this.actionType = SpyActionType.FAKE;
                    this.fakeCall = function () { return retValue; };
                };
                return SpyAction;
            }());
            exports_1("SpyAction", SpyAction);
            (function (SpyActionType) {
                SpyActionType[SpyActionType["CALL_THROUGH"] = 0] = "CALL_THROUGH";
                SpyActionType[SpyActionType["DO_NOTHING"] = 1] = "DO_NOTHING";
                SpyActionType[SpyActionType["FAKE"] = 2] = "FAKE";
            })(SpyActionType || (SpyActionType = {}));
        }
    };
});
System.register("testing/util", [], function (exports_2, context_2) {
    "use strict";
    var Util;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            Util = /** @class */ (function () {
                function Util() {
                }
                Util.isPOJO = function (arg) {
                    if (arg == null || typeof arg !== 'object') {
                        return false;
                    }
                    var proto = Object.getPrototypeOf(arg);
                    // Prototype may be null if you used `Object.create(null)`
                    // Checking `proto`'s constructor is safe because `getPrototypeOf()`
                    // explicitly crosses the boundary from object data to object metadata.
                    return !proto || proto.constructor.name === 'Object';
                };
                Util.equals = function (a, b) {
                    if (Array.isArray(a) && Array.isArray(b)) {
                        return Util.arrayEquals(a, b);
                    }
                    if (Util.isPOJO(a) && Util.isPOJO(b)) {
                        return Util.pojoEquals(a, b);
                    }
                    return a === b;
                };
                Util.arrayEquals = function (arr1, arr2) {
                    if (arr1.length !== arr2.length)
                        return false;
                    return arr1.every(function (el, i) { return Util.equals(el, arr2[i]); });
                };
                Util.pojoEquals = function (obj1, obj2) {
                    // Remove keys that have undefined values.
                    var clearUndefinedValues = function (obj) {
                        for (var key in obj)
                            if (obj[key] === undefined)
                                delete obj[key];
                    };
                    clearUndefinedValues(obj1);
                    clearUndefinedValues(obj2);
                    if (Object.keys(obj1).length !== Object.keys(obj2).length)
                        return false;
                    for (var key in obj1) {
                        if (!Util.equals(obj1[key], obj2[key]))
                            return false;
                    }
                    return true;
                };
                Util.isError = function (e) {
                    return e instanceof Error || e.constructor.name.endsWith('Error');
                };
                return Util;
            }());
            exports_2("default", Util);
        }
    };
});
System.register("testing/expectation", ["testing/spy", "testing/util"], function (exports_3, context_3) {
    "use strict";
    var spy_1, util_1, Expectation, SpyMatcher;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (spy_1_1) {
                spy_1 = spy_1_1;
            },
            function (util_1_1) {
                util_1 = util_1_1;
            }
        ],
        execute: function () {
            Expectation = /** @class */ (function () {
                function Expectation(actual, isInverse, notSource) {
                    if (isInverse === void 0) { isInverse = false; }
                    this.actual = actual;
                    this.isInverse = isInverse;
                    this.not = notSource !== null && notSource !== void 0 ? notSource : new Expectation(actual, !this.isInverse, this);
                    this.notString = this.isInverse ? 'not ' : '';
                }
                Expectation.prototype.toEqual = function (expected) {
                    var equals = util_1["default"].equals(this.actual, expected);
                    if (equals && this.isInverse) {
                        throw new Error("Expected anything but " + expected + ".");
                    }
                    else if (!equals && !this.isInverse) {
                        throw new Error("Expected " + expected + ", got " + this.actual + ".");
                    }
                };
                Expectation.prototype.toThrow = function (expectedErrorMessage) {
                    if (typeof this.actual !== 'function') {
                        throw new Error('Expectation is not a function');
                    }
                    var errorMatchesExpectedMessage = function (e) {
                        if (!util_1["default"].isError(e) || !expectedErrorMessage)
                            return false;
                        return (e.message || '')
                            .toLowerCase()
                            .includes(expectedErrorMessage.toLowerCase());
                    };
                    var fail = function (e, prefixMessage) {
                        if (util_1["default"].isError(e)) {
                            Expectation.augmentAndThrow(e, prefixMessage);
                        }
                        else {
                            throw new Error(prefixMessage);
                        }
                    };
                    if (!this.isInverse) {
                        var DO_NOT_CATCH = String(Math.random());
                        try {
                            this.actual();
                            throw new Error(DO_NOT_CATCH);
                        }
                        catch (e) {
                            if (e.message === DO_NOT_CATCH) {
                                throw new Error('Expected function to throw.');
                            }
                            if (expectedErrorMessage && !errorMatchesExpectedMessage(e)) {
                                fail(e, "Expected error message '" + (e.message || '') + "' to include '" + expectedErrorMessage + "'.");
                            }
                        }
                    }
                    else {
                        try {
                            this.actual();
                        }
                        catch (e) {
                            if (!expectedErrorMessage) {
                                fail(e, 'Expected function not to throw.');
                            }
                            if (errorMatchesExpectedMessage(e)) {
                                fail(e, "Expected error not to include '" + expectedErrorMessage + "'");
                            }
                        }
                    }
                };
                Expectation.prototype.toContain = function (expectedContents) {
                    if (typeof this.actual === 'string') {
                        if (typeof expectedContents !== 'string') {
                            throw new Error("Cannot check containment in a string. Got " + typeof expectedContents);
                        }
                        if (this.isInverse === this.actual.includes(expectedContents)) {
                            throw new Error("Expected " + this.actual + " " + this.notString + "to contain '" + expectedContents + "'.");
                        }
                        return;
                    }
                    if (typeof Array.isArray(this.actual)) {
                        if (this.isInverse ===
                            this.actual.includes(expectedContents)) {
                            throw new Error("Expected " + this.actual + " " + this.notString + "to contain '" + expectedContents + "'.");
                        }
                        return;
                    }
                    throw new Error('Can only check containment of arrays and strings.');
                };
                Expectation.prototype.toHaveBeenCalled = function () {
                    var spy = spy_1.Spy.assertSpy(this.actual);
                    if (this.isInverse === !!spy.getCalls().length) {
                        throw new Error("Expected " + spy + " " + this.notString + "to have been called.");
                    }
                };
                Expectation.prototype.toHaveBeenCalledTimes = function (expected) {
                    var spy = spy_1.Spy.assertSpy(this.actual);
                    var actual = spy.getCalls().length;
                    if (this.isInverse === (actual === expected)) {
                        throw new Error("Expected " + spy + " " + this.notString + "to have been called " + expected + " times." + (this.isInverse ? '' : " Called " + actual + " times."));
                    }
                };
                Expectation.prototype.toHaveBeenCalledLike = function (spyMatcher) {
                    var spy = spy_1.Spy.assertSpy(this.actual);
                    var someCallMatches = spy.getCalls().some(function (callArgs) {
                        return spyMatcher.argsMatcher(callArgs);
                    });
                    if (this.isInverse === someCallMatches) {
                        throw new Error("Expected " + spy + " " + this.notString + "to have been called " +
                            "according to this matcher.");
                    }
                };
                Expectation.prototype.toHaveBeenCalledWith = function () {
                    var expectedArgs = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        expectedArgs[_i] = arguments[_i];
                    }
                    var spy = spy_1.Spy.assertSpy(this.actual);
                    var someCallMatches = spy.getCalls().some(function (callArgs) {
                        return util_1["default"].arrayEquals(expectedArgs, callArgs);
                    });
                    if (this.isInverse === someCallMatches) {
                        throw new Error("Expected " + spy + " " + this.notString + "to have been called " +
                            "with the given parameters.");
                    }
                };
                Expectation.prototype.toBeUndefined = function () {
                    if (this.isInverse === (this.actual === undefined)) {
                        throw new Error("Expected " + this.actual + " " + this.notString + "to be undefined.");
                    }
                };
                Expectation.augmentAndThrow = function (e, expectationMsg) {
                    e.message = expectationMsg + "\n" + e.message;
                    e.stack = expectationMsg + "\n" + e.stack;
                    throw e;
                };
                return Expectation;
            }());
            exports_3("Expectation", Expectation);
            SpyMatcher = /** @class */ (function () {
                function SpyMatcher(argsMatcher) {
                    this.argsMatcher = argsMatcher;
                }
                return SpyMatcher;
            }());
            exports_3("SpyMatcher", SpyMatcher);
        }
    };
});
System.register("testing/tester", ["testing/spy", "testing/expectation", "testing/util"], function (exports_4, context_4) {
    "use strict";
    var spy_2, expectation_1, util_2, Tester;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (spy_2_1) {
                spy_2 = spy_2_1;
            },
            function (expectation_1_1) {
                expectation_1 = expectation_1_1;
            },
            function (util_2_1) {
                util_2 = util_2_1;
            }
        ],
        execute: function () {
            Tester = /** @class */ (function () {
                function Tester(verbose) {
                    if (verbose === void 0) { verbose = true; }
                    this.verbose = verbose;
                    this.indentation = Tester.INDENT_PER_LEVEL;
                    // Empty state allows beforeEach and afterEach, hence one context starting in
                    // the stack.
                    this.currentDescriptionContext = this.getEmptyDescriptionContext();
                    this.descriptionContextStack = [this.currentDescriptionContext];
                    this.currentItContext = null;
                }
                Tester.prototype.describe = function (description, testFn) {
                    var e_1, _a, _b, e_2, _c;
                    if (this.currentItContext) {
                        this.throwTesterError('Illegal context for describe()');
                    }
                    // If the current descriptionContext didn't execute it's beforeAlls yet
                    // (because it had no it()s), execute them now.
                    this.maybeExecuteBeforeAlls();
                    this.currentDescriptionContext = this.getEmptyDescriptionContext();
                    this.descriptionContextStack.push(this.currentDescriptionContext);
                    this.indent();
                    testFn();
                    // If no it()s were called in this context, still call the beforeAlls, to
                    // match any cleanup in afterAlls.
                    this.maybeExecuteBeforeAlls();
                    try {
                        for (var _d = __values(this.currentDescriptionContext.afterAlls), _e = _d.next(); !_e.done; _e = _d.next()) {
                            var afterAll = _e.value;
                            afterAll();
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_e && !_e.done && (_a = _d["return"])) _a.call(_d);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    this.dedent();
                    // Remove the description context, and handle its statistics and output.
                    var lastDescriptionContext = this.descriptionContextStack.pop();
                    if (!lastDescriptionContext) {
                        this.throwTesterError('There should have been a description context here.');
                    }
                    var successCount = lastDescriptionContext.successCount, failureCount = lastDescriptionContext.failureCount, lastContextOutput = lastDescriptionContext.output, spies = lastDescriptionContext.spies;
                    this.currentDescriptionContext =
                        this.descriptionContextStack[this.descriptionContextStack.length - 1];
                    this.currentDescriptionContext.successCount += successCount;
                    this.currentDescriptionContext.failureCount += failureCount;
                    if (this.verbose || failureCount) {
                        var indentedDescription = Array(this.indentation + 1).join(' ') + description;
                        (_b = this.currentDescriptionContext.output).push.apply(_b, __spread(['', indentedDescription], lastContextOutput));
                    }
                    try {
                        // Reset spies in reverse order: First in, first out.
                        for (var _f = __values(spies.reverse()), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var spy = _g.value;
                            spy.reset();
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_c = _f["return"])) _c.call(_f);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                };
                Tester.prototype.xdescribe = function (description, testFn) {
                    this.output("\n" + description + " (skipped)");
                };
                Tester.prototype.beforeAll = function (beforeFn) {
                    if (this.currentItContext) {
                        this.throwTesterError('Illegal context for beforeAll()');
                    }
                    this.currentDescriptionContext.beforeAlls.push(beforeFn);
                };
                Tester.prototype.beforeEach = function (beforeFn) {
                    if (this.currentItContext) {
                        this.throwTesterError('Illegal context for beforeEach()');
                    }
                    this.currentDescriptionContext.beforeEaches.push(beforeFn);
                };
                Tester.prototype.afterEach = function (afterFn) {
                    if (this.currentItContext) {
                        this.throwTesterError('Illegal context for afterEach()');
                    }
                    this.currentDescriptionContext.afterEaches.push(afterFn);
                };
                Tester.prototype.afterAll = function (afterFn) {
                    if (this.currentItContext) {
                        this.throwTesterError('Illegal context for afterAll()');
                    }
                    this.currentDescriptionContext.afterAlls.push(afterFn);
                };
                Tester.prototype.maybeExecuteBeforeAlls = function () {
                    var e_3, _a;
                    // It's a little tricky to tell when to call the beforeAlls, so we need to
                    // make sure the are called only once.
                    // - before the first it() in this describe()
                    // - at the start of the first contained describe() (if there are no it()s)
                    // - before the afterAlls() in this describe() if neither of the other two
                    //   happen
                    if (!this.currentDescriptionContext.successCount &&
                        !this.currentDescriptionContext.failureCount &&
                        !this.currentDescriptionContext.beforeAllsCalled) {
                        try {
                            for (var _b = __values(this.currentDescriptionContext.beforeAlls), _c = _b.next(); !_c.done; _c = _b.next()) {
                                var beforeAll = _c.value;
                                beforeAll();
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                        this.currentDescriptionContext.beforeAllsCalled = true;
                    }
                };
                Tester.prototype.it = function (unitTestName, testFn) {
                    var e_4, _a, e_5, _b, e_6, _c, e_7, _d, e_8, _e, e_9, _f;
                    if (this.currentItContext) {
                        this.throwTesterError('Cannot nest it() units. Use a describe() for the outer.');
                    }
                    this.maybeExecuteBeforeAlls();
                    var startTime = Date.now();
                    try {
                        for (var _g = __values(this.descriptionContextStack), _h = _g.next(); !_h.done; _h = _g.next()) {
                            var context = _h.value;
                            try {
                                for (var _j = (e_5 = void 0, __values(context.beforeEaches)), _k = _j.next(); !_k.done; _k = _j.next()) {
                                    var beforeEach = _k.value;
                                    beforeEach();
                                }
                            }
                            catch (e_5_1) { e_5 = { error: e_5_1 }; }
                            finally {
                                try {
                                    if (_k && !_k.done && (_b = _j["return"])) _b.call(_j);
                                }
                                finally { if (e_5) throw e_5.error; }
                            }
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (_h && !_h.done && (_a = _g["return"])) _a.call(_g);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                    var success;
                    var failureOutput;
                    try {
                        this.currentItContext = { spies: [] };
                        testFn();
                        success = true;
                        this.currentDescriptionContext.successCount++;
                    }
                    catch (e) {
                        if (e.name === Tester.ERROR_NAME)
                            throw e;
                        success = false;
                        this.indent();
                        failureOutput = util_2["default"].isError(e) ?
                            e.stack || e.message :
                            'Exception during test execution. No error object.';
                        this.dedent();
                        this.currentDescriptionContext.failureCount++;
                    }
                    finally {
                        try {
                            for (var _l = __values(this.currentItContext.spies), _m = _l.next(); !_m.done; _m = _l.next()) {
                                var spy = _m.value;
                                spy.reset();
                            }
                        }
                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                        finally {
                            try {
                                if (_m && !_m.done && (_c = _l["return"])) _c.call(_l);
                            }
                            finally { if (e_6) throw e_6.error; }
                        }
                        this.currentItContext = null;
                    }
                    try {
                        for (var _o = __values(this.descriptionContextStack), _p = _o.next(); !_p.done; _p = _o.next()) {
                            var context = _p.value;
                            try {
                                for (var _q = (e_8 = void 0, __values(context.afterEaches)), _r = _q.next(); !_r.done; _r = _q.next()) {
                                    var afterEach = _r.value;
                                    afterEach();
                                }
                            }
                            catch (e_8_1) { e_8 = { error: e_8_1 }; }
                            finally {
                                try {
                                    if (_r && !_r.done && (_e = _q["return"])) _e.call(_q);
                                }
                                finally { if (e_8) throw e_8.error; }
                            }
                            try {
                                for (var _s = (e_9 = void 0, __values(context.spies)), _t = _s.next(); !_t.done; _t = _s.next()) {
                                    var spy = _t.value;
                                    spy.clearCalls();
                                }
                            }
                            catch (e_9_1) { e_9 = { error: e_9_1 }; }
                            finally {
                                try {
                                    if (_t && !_t.done && (_f = _s["return"])) _f.call(_s);
                                }
                                finally { if (e_9) throw e_9.error; }
                            }
                        }
                    }
                    catch (e_7_1) { e_7 = { error: e_7_1 }; }
                    finally {
                        try {
                            if (_p && !_p.done && (_d = _o["return"])) _d.call(_o);
                        }
                        finally { if (e_7) throw e_7.error; }
                    }
                    if (this.verbose || !success) {
                        var s = success ? '✓' : '✗';
                        this.output(s + " " + unitTestName + " (in " + (Date.now() - startTime) + " ms)");
                    }
                    ;
                    if (failureOutput)
                        this.output(failureOutput);
                };
                Tester.prototype.xit = function (unitTestName, testFn) {
                    this.output("\u25CB " + unitTestName + " (skipped)");
                };
                Tester.prototype.expect = function (actual) {
                    return new expectation_1.Expectation(actual);
                };
                Tester.prototype.spyOn = function (object, method) {
                    if (typeof object[method] !== 'function') {
                        this.throwTesterError('Can only spy on functions');
                    }
                    var spy = new spy_2.Spy(object, method);
                    if (this.currentItContext) {
                        this.currentItContext.spies.push(spy);
                    }
                    else {
                        this.currentDescriptionContext.spies.push(spy);
                    }
                    return spy;
                };
                Tester.prototype.matcher = function (argsMatcher) {
                    return new expectation_1.SpyMatcher(argsMatcher);
                };
                Tester.prototype.finish = function () {
                    var e_10, _a, e_11, _b;
                    // Finish the root description context. Reset spies in reverse order: First
                    // in, first out.
                    var _c = this.currentDescriptionContext, afterAlls = _c.afterAlls, spies = _c.spies;
                    this.maybeExecuteBeforeAlls();
                    try {
                        for (var afterAlls_1 = __values(afterAlls), afterAlls_1_1 = afterAlls_1.next(); !afterAlls_1_1.done; afterAlls_1_1 = afterAlls_1.next()) {
                            var afterAll = afterAlls_1_1.value;
                            afterAll();
                        }
                    }
                    catch (e_10_1) { e_10 = { error: e_10_1 }; }
                    finally {
                        try {
                            if (afterAlls_1_1 && !afterAlls_1_1.done && (_a = afterAlls_1["return"])) _a.call(afterAlls_1);
                        }
                        finally { if (e_10) throw e_10.error; }
                    }
                    try {
                        for (var _d = __values(spies.reverse()), _e = _d.next(); !_e.done; _e = _d.next()) {
                            var spy = _e.value;
                            spy.reset();
                        }
                    }
                    catch (e_11_1) { e_11 = { error: e_11_1 }; }
                    finally {
                        try {
                            if (_e && !_e.done && (_b = _d["return"])) _b.call(_d);
                        }
                        finally { if (e_11) throw e_11.error; }
                    }
                    return {
                        successCount: this.currentDescriptionContext.successCount,
                        failureCount: this.currentDescriptionContext.failureCount,
                        output: this.currentDescriptionContext.output
                    };
                };
                Tester.prototype.indent = function () {
                    this.indentation += Tester.INDENT_PER_LEVEL;
                };
                Tester.prototype.dedent = function () {
                    this.indentation -= Tester.INDENT_PER_LEVEL;
                };
                Tester.prototype.output = function (result) {
                    var _this = this;
                    result.split('\n').forEach(function (line) {
                        _this.currentDescriptionContext.output.push(Array(_this.indentation + 1).join(' ') + line);
                    });
                };
                Tester.prototype.getEmptyDescriptionContext = function () {
                    return {
                        beforeAlls: [],
                        beforeEaches: [],
                        afterEaches: [],
                        afterAlls: [],
                        successCount: 0,
                        failureCount: 0,
                        output: [],
                        spies: []
                    };
                };
                Tester.prototype.throwTesterError = function (message) {
                    var error = new Error(message);
                    error.name = Tester.ERROR_NAME;
                    throw error;
                };
                Tester.ERROR_NAME = 'TesterError';
                Tester.INDENT_PER_LEVEL = 2;
                return Tester;
            }());
            exports_4("Tester", Tester);
        }
    };
});
System.register("testing/testrunner", ["testing/tester"], function (exports_5, context_5) {
    "use strict";
    var tester_1, TestRunner;
    var __moduleName = context_5 && context_5.id;
    function runTests(tests, options) {
        TestRunner.run(tests, options);
        return Logger.getLog();
    }
    exports_5("runTests", runTests);
    return {
        setters: [
            function (tester_1_1) {
                tester_1 = tester_1_1;
            }
        ],
        execute: function () {
            TestRunner = /** @class */ (function () {
                function TestRunner() {
                }
                TestRunner.run = function (tests, _a) {
                    var e_12, _b;
                    var _c = _a.suppressLogs, suppressLogs = _c === void 0 ? true : _c, _d = _a.showSuccesses, showSuccesses = _d === void 0 ? true : _d, _e = _a.testerClass, testerClass = _e === void 0 ? tester_1.Tester : _e;
                    // Suppress logs inside tests.
                    var storedLogFn = Logger.log;
                    if (suppressLogs) {
                        Logger.log = function (_) {
                            return Logger;
                        };
                    }
                    var successTotal = 0;
                    var failureTotal = 0;
                    var outputTotal = ['Testing...\n'];
                    var startTime = Date.now();
                    try {
                        for (var tests_1 = __values(tests), tests_1_1 = tests_1.next(); !tests_1_1.done; tests_1_1 = tests_1.next()) {
                            var test = tests_1_1.value;
                            var testStartTime = Date.now();
                            var tester = new testerClass(showSuccesses);
                            test.run(tester);
                            var _f = tester.finish(), successCount = _f.successCount, failureCount = _f.failureCount, output = _f.output;
                            successTotal += successCount;
                            failureTotal += failureCount;
                            var runTime = "(in " + (Date.now() - testStartTime) + " ms)";
                            if (!failureCount) {
                                outputTotal.push(test.name + " \u2713 " + runTime);
                            }
                            else {
                                outputTotal.push(test.name + " - " + failureCount + " failures " + runTime);
                            }
                            if (failureCount || showSuccesses)
                                outputTotal.push.apply(outputTotal, __spread(output, ['']));
                        }
                    }
                    catch (e_12_1) { e_12 = { error: e_12_1 }; }
                    finally {
                        try {
                            if (tests_1_1 && !tests_1_1.done && (_b = tests_1["return"])) _b.call(tests_1);
                        }
                        finally { if (e_12) throw e_12.error; }
                    }
                    outputTotal.push('');
                    outputTotal.push("Total -- " + TestRunner.getStats(successTotal, failureTotal) + " " +
                        ("(in " + (Date.now() - startTime) + " ms)"));
                    outputTotal.push('');
                    if (suppressLogs)
                        Logger.log = storedLogFn;
                    if (outputTotal.length < 100) {
                        Logger.log(outputTotal.join('\n'));
                    }
                    else {
                        var pages = Math.ceil(outputTotal.length / 100);
                        var page = 1;
                        while (outputTotal.length) {
                            Logger.log(__spread([
                                "Testing ... page " + page++ + "/" + pages
                            ], outputTotal.splice(0, 100)).join('\n'));
                        }
                    }
                };
                TestRunner.getStats = function (success, failure) {
                    return success + failure + " run, " + success + " pass, " + failure + " fail";
                };
                return TestRunner;
            }());
            exports_5("TestRunner", TestRunner);
        }
    };
});
System.register("testing/fakes", [], function (exports_6, context_6) {
    "use strict";
    var Fake, FakeGmailApp, FakeGmailLabel, FakeGmailThread, FakeGmailMessage, FakeProperties;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
            Fake = /** @class */ (function () {
                function Fake() {
                }
                Fake.prototype.fake = function () {
                    return this;
                };
                return Fake;
            }());
            FakeGmailApp = /** @class */ (function () {
                function FakeGmailApp() {
                }
                FakeGmailApp.setData = function (params) {
                    var _a;
                    FakeGmailApp.labelMap = new Map(((_a = params.labels) !== null && _a !== void 0 ? _a : []).map(function (labelParams) { return [labelParams.name, new FakeGmailLabel(labelParams)]; }));
                };
                FakeGmailApp.getUserLabelByName = function (name) {
                    var _a;
                    var label = (_a = FakeGmailApp.labelMap.get(name)) === null || _a === void 0 ? void 0 : _a.fake();
                    return label;
                };
                return FakeGmailApp;
            }());
            exports_6("FakeGmailApp", FakeGmailApp);
            FakeGmailLabel = /** @class */ (function (_super) {
                __extends(FakeGmailLabel, _super);
                function FakeGmailLabel(params) {
                    var e_13, _a;
                    var _b;
                    var _this = _super.call(this) || this;
                    _this.params = params;
                    _this.threads = new Set();
                    try {
                        for (var _c = __values((_b = _this.params.threads) !== null && _b !== void 0 ? _b : []), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var threadParams = _d.value;
                            var fakeGmailThread = new FakeGmailThread(threadParams);
                            fakeGmailThread.addLabel(_this);
                        }
                    }
                    catch (e_13_1) { e_13 = { error: e_13_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
                        }
                        finally { if (e_13) throw e_13.error; }
                    }
                    return _this;
                }
                FakeGmailLabel.prototype.getName = function () {
                    return this.params.name;
                };
                FakeGmailLabel.prototype.getThreads = function () {
                    return Array.from(this.threads).map(function (fakeThread) { return fakeThread.fake(); });
                };
                FakeGmailLabel.prototype.addThread = function (thread) {
                    this.threads.add(thread);
                };
                FakeGmailLabel.prototype.removeThread = function (thread) {
                    this.threads["delete"](thread);
                };
                return FakeGmailLabel;
            }(Fake));
            FakeGmailThread = /** @class */ (function (_super) {
                __extends(FakeGmailThread, _super);
                function FakeGmailThread(params) {
                    var _this = _super.call(this) || this;
                    _this.params = params;
                    _this.labels = new Set();
                    _this.id = String(Math.random());
                    return _this;
                }
                FakeGmailThread.prototype.getId = function () {
                    return this.id;
                };
                FakeGmailThread.prototype.addLabel = function (label) {
                    this.labels.add(label.getName());
                    label.addThread(this);
                };
                FakeGmailThread.prototype.removeLabel = function (label) {
                    this.labels["delete"](label.getName());
                    label.removeThread(this);
                };
                FakeGmailThread.prototype.getMessages = function () {
                    var _a;
                    return ((_a = this.params.messages) !== null && _a !== void 0 ? _a : [])
                        .map(function (messageParams) { return new FakeGmailMessage(messageParams).fake(); });
                };
                return FakeGmailThread;
            }(Fake));
            FakeGmailMessage = /** @class */ (function (_super) {
                __extends(FakeGmailMessage, _super);
                function FakeGmailMessage(params) {
                    var _this = _super.call(this) || this;
                    _this.params = params;
                    return _this;
                }
                FakeGmailMessage.prototype.getDate = function () {
                    var _a;
                    return (_a = this.params.date) !== null && _a !== void 0 ? _a : new Date();
                };
                FakeGmailMessage.prototype.getFrom = function () {
                    var _a;
                    return (_a = this.params.from) !== null && _a !== void 0 ? _a : 'Unset from (sender)';
                };
                FakeGmailMessage.prototype.getPlainBody = function () {
                    var _a;
                    return (_a = this.params.plainBody) !== null && _a !== void 0 ? _a : 'Unset subject';
                };
                FakeGmailMessage.prototype.getSubject = function () {
                    var _a;
                    return (_a = this.params.subject) !== null && _a !== void 0 ? _a : 'Unset subject';
                };
                return FakeGmailMessage;
            }(Fake));
            FakeProperties = /** @class */ (function () {
                function FakeProperties() {
                    this.properties = new Map();
                }
                FakeProperties.prototype.deleteAllProperties = function () {
                    this.properties.clear();
                    return this;
                };
                FakeProperties.prototype.deleteProperty = function (key) {
                    this.properties["delete"](key);
                    return this;
                };
                FakeProperties.prototype.getKeys = function () {
                    return Array.from(this.properties.keys());
                };
                FakeProperties.prototype.getProperties = function () {
                    var e_14, _a;
                    var obj = {};
                    try {
                        for (var _b = __values(this.properties), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                            obj[key] = value;
                        }
                    }
                    catch (e_14_1) { e_14 = { error: e_14_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                        }
                        finally { if (e_14) throw e_14.error; }
                    }
                    return obj;
                };
                FakeProperties.prototype.getProperty = function (key) {
                    return this.properties.get(key);
                };
                FakeProperties.prototype.setProperties = function (properties, deleteAllOthers) {
                    deleteAllOthers !== null && deleteAllOthers !== void 0 ? deleteAllOthers : this.properties.clear();
                    for (var key in properties) {
                        this.properties.set(key, properties[key]);
                    }
                };
                FakeProperties.prototype.setProperty = function (key, value) {
                    this.properties.set(key, value);
                };
                return FakeProperties;
            }());
            exports_6("FakeProperties", FakeProperties);
        }
    };
});
System.register("apihelper", ["testing/spy", "testing/testrunner", "testing/tester", "testing/fakes"], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var exportedNames_1 = {
        "Spy": true,
        "TestRunner": true,
        "Tester": true
    };
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default" && !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_7(exports);
    }
    return {
        setters: [
            function (spy_3_1) {
                exports_7({
                    "Spy": spy_3_1["Spy"]
                });
            },
            function (testrunner_1_1) {
                exports_7({
                    "TestRunner": testrunner_1_1["TestRunner"]
                });
            },
            function (tester_2_1) {
                exports_7({
                    "Tester": tester_2_1["Tester"]
                });
            },
            function (fakes_1_1) {
                exportStar_1(fakes_1_1);
            }
        ],
        execute: function () {
        }
    };
});
// The name JASLib here is important. It must match
// `depencies.libraries[n].userSymbol` in appscript.json for code that depends
// on this lib. E.g.
// https://github.com/jamesoguntebi/AS_LeaseLib/blob/master/appsscript.json
System.register("jas_api", ["apihelper"], function (exports_8, context_8) {
    "use strict";
    var JASLib;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (JASLib_1) {
                JASLib = JASLib_1;
            }
        ],
        execute: function () {// The name JASLib here is important. It must match
            // `depencies.libraries[n].userSymbol` in appscript.json for code that depends
            // on this lib. E.g.
            // https://github.com/jamesoguntebi/AS_LeaseLib/blob/master/appsscript.json
            exports_8("JASLib", JASLib);
        }
    };
});
/**
 * This file name needs an underscore before it to force it to be first
 * alphabetically. https://github.com/google/clasp/issues/72
 */
System.register("testing/_simple_test", ["testing/tester"], function (exports_9, context_9) {
    "use strict";
    var tester_3, SimpleTest;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (tester_3_1) {
                tester_3 = tester_3_1;
            }
        ],
        execute: function () {/**
             * This file name needs an underscore before it to force it to be first
             * alphabetically. https://github.com/google/clasp/issues/72
             */
            /** For testing the test framework. */
            SimpleTest = /** @class */ (function () {
                function SimpleTest() {
                    this.output = [];
                    this.successes = 0;
                    this.failures = 0;
                    this.output.push(this.constructor.name);
                }
                SimpleTest.prototype.run = function () {
                    var e_15, _a;
                    try {
                        for (var _b = __values(Object.getOwnPropertyNames(this.constructor.prototype)), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var key = _c.value;
                            if (key.startsWith('test') && typeof this[key] === 'function') {
                                this.runUnit(key, this[key]);
                            }
                        }
                    }
                    catch (e_15_1) { e_15 = { error: e_15_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                        }
                        finally { if (e_15) throw e_15.error; }
                    }
                };
                SimpleTest.prototype.finish = function () {
                    this.output.push("  " + (this.successes + this.failures) + " run, " + this.successes + " pass, " + this.failures + " fail");
                    return this.output;
                };
                /**
                 * @param testFn A function that should throw if the test unit fails. It will
                 *     be bound to `this`, allowing callers to conviently call
                 *     `runUnit('description', this.test1)`.
                 */
                SimpleTest.prototype.runUnit = function (testName, testFn) {
                    try {
                        testFn.call(this);
                        this.output.push("  \u2713 " + testName);
                        this.successes++;
                    }
                    catch (e) {
                        this.output.push("  \u2717 " + testName);
                        this.failures++;
                    }
                };
                /**
                 * Throws an error that the Tester class always catches and rethrows, so that
                 * when testing Tester, failures aren't suppressed.
                 */
                SimpleTest.prototype.fail = function () {
                    var error = new Error();
                    error.name = tester_3.Tester.ERROR_NAME;
                    throw error;
                };
                SimpleTest.prototype.failIfThrows = function (fn) {
                    try {
                        fn();
                    }
                    catch (_a) {
                        this.fail();
                    }
                };
                SimpleTest.prototype.failIfNotThrows = function (fn) {
                    var DO_NOT_CATCH = String(Math.random());
                    try {
                        fn();
                        throw new Error(DO_NOT_CATCH);
                    }
                    catch (e) {
                        if (e.message === DO_NOT_CATCH)
                            this.fail();
                    }
                };
                return SimpleTest;
            }());
            exports_9("default", SimpleTest);
        }
    };
});
System.register("testing/expectation_test", ["testing/_simple_test", "testing/spy", "testing/expectation"], function (exports_10, context_10) {
    "use strict";
    var _simple_test_1, spy_4, expectation_2, ExpectationTest;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (_simple_test_1_1) {
                _simple_test_1 = _simple_test_1_1;
            },
            function (spy_4_1) {
                spy_4 = spy_4_1;
            },
            function (expectation_2_1) {
                expectation_2 = expectation_2_1;
            }
        ],
        execute: function () {
            ExpectationTest = /** @class */ (function (_super) {
                __extends(ExpectationTest, _super);
                function ExpectationTest() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ExpectationTest.prototype.createSpy = function (targetFn) {
                    var object = { isASpy: targetFn ? targetFn : function () { } };
                    return { spy: new spy_4.Spy(object, 'isASpy'), spiedFn: object.isASpy };
                };
                ExpectationTest.prototype.testToEqual = function () {
                    this.failIfThrows(function () { return new expectation_2.Expectation(5).toEqual(5); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(5).toEqual(6); });
                };
                ExpectationTest.prototype.testNotToEqual = function () {
                    this.failIfThrows(function () { return new expectation_2.Expectation(5).not.toEqual(6); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(5).not.toEqual(5); });
                };
                ExpectationTest.prototype.testToThrow = function () {
                    var throwA = function () { throw new Error('a'); };
                    var noThrow = function () { };
                    this.failIfThrows(function () { return new expectation_2.Expectation(throwA).toThrow(); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(noThrow).toThrow(); });
                    this.failIfThrows(function () { return new expectation_2.Expectation(throwA).toThrow('a'); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(throwA).toThrow('b'); });
                };
                ExpectationTest.prototype.testNotToThrow = function () {
                    var throwA = function () { throw new Error('a'); };
                    var noThrow = function () { };
                    this.failIfThrows(function () { return new expectation_2.Expectation(noThrow).not.toThrow(); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(throwA).not.toThrow(); });
                    this.failIfThrows(function () { return new expectation_2.Expectation(throwA).not.toThrow('b'); });
                    this.failIfThrows(function () { return new expectation_2.Expectation(noThrow).not.toThrow('a'); });
                    this.failIfThrows(function () { return new expectation_2.Expectation(noThrow).not.toThrow('b'); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(throwA).not.toThrow('a'); });
                };
                ExpectationTest.prototype.testToContain = function () {
                    this.failIfThrows(function () { return new expectation_2.Expectation('hello').toContain('ello'); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation('hello').toContain('hi'); });
                    this.failIfThrows(function () { return new expectation_2.Expectation([1, 2, 3]).toContain(2); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation([1, 2, 3]).toContain(4); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(11).toContain(10); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation({ a: 'apples' }).toContain('a'); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation({ a: 'apples' })
                        .toContain('apples'); });
                };
                ExpectationTest.prototype.testNotToContain = function () {
                    this.failIfThrows(function () { return new expectation_2.Expectation('hello').not.toContain('hi'); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation('hello').not.toContain('ello'); });
                    this.failIfThrows(function () { return new expectation_2.Expectation([1, 2, 3]).not.toContain(4); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation([1, 2, 3]).not.toContain(2); });
                };
                ExpectationTest.prototype.testToHaveBeenCalled = function () {
                    var object = { notASpy: function () { } };
                    object.notASpy();
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(object.notASpy).toHaveBeenCalled(); });
                    var calledSpyFn = this.createSpy().spiedFn;
                    var notCalledSpyFn = this.createSpy().spiedFn;
                    calledSpyFn();
                    this.failIfThrows(function () { return new expectation_2.Expectation(calledSpyFn).toHaveBeenCalled(); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(notCalledSpyFn).toHaveBeenCalled(); });
                };
                ExpectationTest.prototype.testNotToHaveBeenCalled = function () {
                    var calledSpyFn = this.createSpy().spiedFn;
                    var notCalledSpyFn = this.createSpy().spiedFn;
                    calledSpyFn();
                    this.failIfThrows(function () { return new expectation_2.Expectation(notCalledSpyFn).not.toHaveBeenCalled(); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(calledSpyFn).not.toHaveBeenCalled(); });
                };
                ExpectationTest.prototype.testToHaveBeenCalledTimes = function () {
                    var spiedFn = this.createSpy().spiedFn;
                    spiedFn();
                    spiedFn();
                    this.failIfThrows(function () { return new expectation_2.Expectation(spiedFn).toHaveBeenCalledTimes(2); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(spiedFn).toHaveBeenCalledTimes(3); });
                };
                ExpectationTest.prototype.testNotToHaveBeenCalledTimes = function () {
                    var spiedFn = this.createSpy().spiedFn;
                    spiedFn();
                    spiedFn();
                    this.failIfThrows(function () { return new expectation_2.Expectation(spiedFn).not.toHaveBeenCalledTimes(3); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(spiedFn).not.toHaveBeenCalledTimes(2); });
                };
                ExpectationTest.prototype.testToHaveBeenCalledLike = function () {
                    var spiedFn = this.createSpy().spiedFn;
                    spiedFn('a');
                    spiedFn('b');
                    var aMatcher = new expectation_2.SpyMatcher(function (args) { return args[0] === 'a'; });
                    var bMatcher = new expectation_2.SpyMatcher(function (args) { return args[0] === 'b'; });
                    var cMatcher = new expectation_2.SpyMatcher(function (args) { return args[0] === 'c'; });
                    this.failIfThrows(function () { return new expectation_2.Expectation(spiedFn).toHaveBeenCalledLike(aMatcher); });
                    this.failIfThrows(function () { return new expectation_2.Expectation(spiedFn).toHaveBeenCalledLike(bMatcher); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(spiedFn).toHaveBeenCalledLike(cMatcher); });
                };
                ExpectationTest.prototype.testNotToHaveBeenCalledLike = function () {
                    var spiedFn = this.createSpy().spiedFn;
                    spiedFn('a');
                    spiedFn('b');
                    var aMatcher = new expectation_2.SpyMatcher(function (args) { return args[0] === 'a'; });
                    var bMatcher = new expectation_2.SpyMatcher(function (args) { return args[0] === 'b'; });
                    var cMatcher = new expectation_2.SpyMatcher(function (args) { return args[0] === 'c'; });
                    this.failIfThrows(function () { return new expectation_2.Expectation(spiedFn).not.toHaveBeenCalledLike(cMatcher); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(spiedFn).not.toHaveBeenCalledLike(aMatcher); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(spiedFn).not.toHaveBeenCalledLike(bMatcher); });
                };
                ExpectationTest.prototype.testToHaveBeenCalledWith = function () {
                    var spiedFn = this.createSpy().spiedFn;
                    spiedFn('a');
                    spiedFn('b');
                    this.failIfThrows(function () { return new expectation_2.Expectation(spiedFn).toHaveBeenCalledWith('a'); });
                    this.failIfThrows(function () { return new expectation_2.Expectation(spiedFn).toHaveBeenCalledWith('b'); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(spiedFn).toHaveBeenCalledWith('c'); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(spiedFn).toHaveBeenCalledWith('a', 'b'); });
                };
                ExpectationTest.prototype.testNotToHaveBeenCalledWith = function () {
                    var spiedFn = this.createSpy().spiedFn;
                    spiedFn('a');
                    spiedFn('b');
                    this.failIfThrows(function () { return new expectation_2.Expectation(spiedFn).not.toHaveBeenCalledWith('c'); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(spiedFn).not.toHaveBeenCalledWith('a'); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(spiedFn).not.toHaveBeenCalledWith('b'); });
                };
                ExpectationTest.prototype.testToBeUndefined = function () {
                    var a, b = 'hi';
                    this.failIfThrows(function () { return new expectation_2.Expectation(a).toBeUndefined(); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(b).toBeUndefined(); });
                };
                ExpectationTest.prototype.testNotToBeUndefined = function () {
                    var a, b = 'hi';
                    this.failIfThrows(function () { return new expectation_2.Expectation(b).not.toBeUndefined(); });
                    this.failIfNotThrows(function () { return new expectation_2.Expectation(a).not.toBeUndefined(); });
                };
                return ExpectationTest;
            }(_simple_test_1["default"]));
            exports_10("default", ExpectationTest);
        }
    };
});
System.register("testing/spy_test", ["testing/spy", "testing/_simple_test", "testing/util"], function (exports_11, context_11) {
    "use strict";
    var spy_5, _simple_test_2, util_3, SpyTest;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (spy_5_1) {
                spy_5 = spy_5_1;
            },
            function (_simple_test_2_1) {
                _simple_test_2 = _simple_test_2_1;
            },
            function (util_3_1) {
                util_3 = util_3_1;
            }
        ],
        execute: function () {
            SpyTest = /** @class */ (function (_super) {
                __extends(SpyTest, _super);
                function SpyTest() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                SpyTest.prototype.createSpy = function (targetFn) {
                    var object = { isASpy: targetFn ? targetFn : function () { } };
                    return { spy: new spy_5.Spy(object, 'isASpy'), spiedFn: object.isASpy };
                };
                SpyTest.prototype.testAssertSpyFailsNonSpies = function () {
                    var object = { notASpy: function () { } };
                    try {
                        spy_5.Spy.assertSpy(object.notASpy);
                        this.fail();
                    }
                    catch (_a) { }
                };
                SpyTest.prototype.testAssertSpyPassesSpies = function () {
                    try {
                        spy_5.Spy.assertSpy(this.createSpy().spiedFn);
                    }
                    catch (_a) {
                        this.fail();
                    }
                };
                SpyTest.prototype.testCallCount = function () {
                    var _a = this.createSpy(), spy = _a.spy, spiedFn = _a.spiedFn;
                    var expectedCount = 4;
                    for (var i = 0; i < expectedCount; i++)
                        spiedFn();
                    if (spy.getCalls().length !== expectedCount)
                        this.fail();
                };
                SpyTest.prototype.testCallArgs = function () {
                    var _a = this.createSpy(), spy = _a.spy, spiedFn = _a.spiedFn;
                    spiedFn(42, 'DiscMage', null);
                    spiedFn(undefined, [1, 5, 9]);
                    spiedFn(0, { a: 'apples', b: 'bananas', c: 'carrots' });
                    var calls = spy.getCalls();
                    if (!util_3["default"].equals(calls[0], [42, 'DiscMage', null]))
                        this.fail();
                    if (!util_3["default"].equals(calls[1], [undefined, [1, 5, 9]]))
                        this.fail();
                    if (!util_3["default"].equals(calls[2], [0, { a: 'apples', b: 'bananas', c: 'carrots' }])) {
                        this.fail();
                    }
                };
                SpyTest.prototype.testReset = function () {
                    var _a = this.createSpy(), spy = _a.spy, spiedFn = _a.spiedFn;
                    spy.reset();
                    try {
                        spy_5.Spy.assertSpy(spiedFn);
                        this.fail();
                    }
                    catch (_b) { }
                };
                SpyTest.prototype.testClearCalls = function () {
                    var _a = this.createSpy(), spy = _a.spy, spiedFn = _a.spiedFn;
                    for (var i = 0; i < 5; i++)
                        spiedFn();
                    spy.clearCalls();
                    if (spy.getCalls().length !== 0)
                        this.fail();
                };
                SpyTest.prototype.testDefaultSpyAction = function () {
                    var name = 'Gandalf the Grey';
                    var upgrade = function () { return name = 'Gandalf the White'; };
                    var _a = this.createSpy(upgrade), spy = _a.spy, spiedFn = _a.spiedFn;
                    spiedFn();
                    if (spy.getCalls().length !== 1)
                        this.fail();
                    if (name !== 'Gandalf the Grey')
                        this.fail();
                };
                SpyTest.prototype.testAndCallThrough = function () {
                    var upgrade = function (color) { return "Gandalf the " + color; };
                    var _a = this.createSpy(upgrade), spy = _a.spy, spiedFn = _a.spiedFn;
                    spy.and.callThrough();
                    var upgraded = spiedFn('White');
                    if (spy.getCalls().length !== 1)
                        this.fail();
                    if (upgraded !== 'Gandalf the White')
                        this.fail();
                };
                SpyTest.prototype.testAndCallFake = function () {
                    var upgrade = function (color) { return "Gandalf the " + color; };
                    var _a = this.createSpy(upgrade), spy = _a.spy, spiedFn = _a.spiedFn;
                    spy.and.callFake(function (color) { return "Saruman the " + color; });
                    var faked = spiedFn('White');
                    if (spy.getCalls().length !== 1)
                        this.fail();
                    if (faked !== 'Saruman the White')
                        this.fail();
                };
                SpyTest.prototype.testAndReturnValue = function () {
                    var name = 'Gandalf the Grey';
                    var getName = function () { return name; };
                    var _a = this.createSpy(getName), spy = _a.spy, spiedFn = _a.spiedFn;
                    spy.and.returnValue('Mithrandir');
                    var retrievedName = spiedFn();
                    if (spy.getCalls().length !== 1)
                        this.fail();
                    if (retrievedName !== 'Mithrandir')
                        this.fail();
                };
                return SpyTest;
            }(_simple_test_2["default"]));
            exports_11("default", SpyTest);
        }
    };
});
System.register("testing/tester_test", ["testing/_simple_test", "testing/tester"], function (exports_12, context_12) {
    "use strict";
    var _simple_test_3, tester_4, TesterTest;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (_simple_test_3_1) {
                _simple_test_3 = _simple_test_3_1;
            },
            function (tester_4_1) {
                tester_4 = tester_4_1;
            }
        ],
        execute: function () {
            TesterTest = /** @class */ (function (_super) {
                __extends(TesterTest, _super);
                function TesterTest() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                TesterTest.prototype.createFail = function () {
                    return function () {
                        throw new Error();
                    };
                };
                TesterTest.prototype.createSuccess = function () {
                    return function () { };
                };
                TesterTest.prototype.callBeforesAndAfters = function (t, getCaller, dPrefix) {
                    t.beforeAll(getCaller(dPrefix + "-ba1"));
                    t.beforeAll(getCaller(dPrefix + "-ba2"));
                    t.beforeEach(getCaller(dPrefix + "-be1"));
                    t.beforeEach(getCaller(dPrefix + "-be2"));
                    t.afterEach(getCaller(dPrefix + "-ae1"));
                    t.afterEach(getCaller(dPrefix + "-ae2"));
                    t.afterAll(getCaller(dPrefix + "-aa1"));
                    t.afterAll(getCaller(dPrefix + "-aa2"));
                };
                // Adds to test units to the Tester's current context. A success and a fail.
                TesterTest.prototype.callIts = function (t, dPrefix) {
                    t.it(dPrefix + "-t1", this.createFail());
                    t.it(dPrefix + "-t2", this.createSuccess());
                };
                /**
                 * Runs a bunch of describe(), it(), before*(), after*() scenarios on a new
                 * Tester, and returns the test result. Also returns a map containing call
                 * counts for before*() and after*() testing.
                 */
                TesterTest.prototype.doAllTestScenarios = function () {
                    var _this = this;
                    var t = new tester_4.Tester();
                    var calls = new Map();
                    var getCaller = function (id) {
                        return function (cid) {
                            if (!calls.get(cid))
                                calls.set(cid, 0);
                            calls.set(cid, calls.get(cid) + 1);
                        }.bind(null, id);
                    };
                    this.callBeforesAndAfters(t, getCaller, 'd0');
                    t.describe('deepy nested describe', function () {
                        _this.callBeforesAndAfters(t, getCaller, 'd1');
                        _this.callIts(t, 'd1');
                        t.describe('d1.1', function () {
                            _this.callBeforesAndAfters(t, getCaller, 'd1.1');
                            _this.callIts(t, 'd1.1');
                            t.describe('d1.1.1', function () {
                                _this.callBeforesAndAfters(t, getCaller, 'd1.1.1');
                                _this.callIts(t, 'd1.1.1');
                            });
                        });
                        t.describe('d1.2', function () {
                            _this.callBeforesAndAfters(t, getCaller, 'd1.2');
                            _this.callIts(t, 'd1.2');
                        });
                    });
                    t.describe('second describe, its defined before befores and afters', function () {
                        _this.callIts(t, 'd2');
                        _this.callBeforesAndAfters(t, getCaller, 'd2');
                    });
                    t.describe('describe with no tests', function () { });
                    t.describe('describe with only grandchild tests', function () {
                        t.describe('d4.1', function () {
                            _this.callIts(t, 'd4.1');
                        });
                    });
                    t.describe('describe with befores and afters and no tests', function () {
                        _this.callBeforesAndAfters(t, getCaller, 'd5');
                    });
                    t.describe('describe with befores and no afters', function () {
                        t.beforeAll(getCaller("d6-ba1"));
                        t.beforeAll(getCaller("d6-ba2"));
                        t.beforeEach(getCaller("d6-be1"));
                        t.beforeEach(getCaller("d6-be2"));
                        _this.callIts(t, 'd6');
                    });
                    t.describe('describe with after and no befores', function () {
                        t.afterEach(getCaller("d7-ae1"));
                        t.afterEach(getCaller("d7-ae2"));
                        t.afterAll(getCaller("d7-aa1"));
                        t.afterAll(getCaller("d7-aa2"));
                        _this.callIts(t, 'd7');
                    });
                    return __assign({ calls: calls }, t.finish());
                };
                TesterTest.prototype.testFinish_stats = function () {
                    var _a = this.doAllTestScenarios(), successCount = _a.successCount, failureCount = _a.failureCount;
                    if (successCount !== 8)
                        this.fail();
                    if (failureCount !== 8)
                        this.fail();
                };
                TesterTest.prototype.testXdescribe = function () {
                    var _this = this;
                    var t = new tester_4.Tester();
                    t.it("1", this.createSuccess());
                    t.it("2", this.createSuccess());
                    t.xdescribe('level1', function () {
                        t.it("1", _this.createFail());
                        t.it("2", _this.createSuccess());
                        t.describe('level2', function () {
                            t.it("1", _this.createFail());
                            t.it("2", _this.createFail());
                        });
                    });
                    var _a = t.finish(), successCount = _a.successCount, failureCount = _a.failureCount;
                    if (successCount !== 2)
                        this.fail();
                    if (failureCount !== 0)
                        this.fail();
                };
                TesterTest.prototype.testBeforeAll = function () {
                    var calls = this.doAllTestScenarios().calls;
                    if (calls.get('d0-ba1') !== 1)
                        this.fail();
                    if (calls.get('d0-ba2') !== 1)
                        this.fail();
                    if (calls.get('d1-ba1') !== 1)
                        this.fail();
                    if (calls.get('d1-ba2') !== 1)
                        this.fail();
                    if (calls.get('d1.1-ba1') !== 1)
                        this.fail();
                    if (calls.get('d1.1-ba2') !== 1)
                        this.fail();
                    if (calls.get('d1.1.1-ba1') !== 1)
                        this.fail();
                    if (calls.get('d1.1.1-ba2') !== 1)
                        this.fail();
                    if (calls.get('d1.2-ba1') !== 1)
                        this.fail();
                    if (calls.get('d1.2-ba2') !== 1)
                        this.fail();
                    if (calls.get('d5-ba1') !== 1)
                        this.fail();
                    if (calls.get('d5-ba2') !== 1)
                        this.fail();
                    if (calls.get('d6-ba1') !== 1)
                        this.fail();
                    if (calls.get('d6-ba2') !== 1)
                        this.fail();
                };
                TesterTest.prototype.testBeforeEach = function () {
                    var calls = this.doAllTestScenarios().calls;
                    if (calls.get('d0-be1') !== 16)
                        this.fail();
                    if (calls.get('d0-be2') !== 16)
                        this.fail();
                    if (calls.get('d1-be1') !== 8)
                        this.fail();
                    if (calls.get('d1-be2') !== 8)
                        this.fail();
                    if (calls.get('d1.1-be1') !== 4)
                        this.fail();
                    if (calls.get('d1.1-be2') !== 4)
                        this.fail();
                    if (calls.get('d1.1.1-be1') !== 2)
                        this.fail();
                    if (calls.get('d1.1.1-be2') !== 2)
                        this.fail();
                    if (calls.get('d1.2-be1') !== 2)
                        this.fail();
                    if (calls.get('d1.2-be2') !== 2)
                        this.fail();
                    if (calls.get('d6-be1') !== 2)
                        this.fail();
                    if (calls.get('d6-be2') !== 2)
                        this.fail();
                };
                TesterTest.prototype.testAfterEach = function () {
                    var calls = this.doAllTestScenarios().calls;
                    if (calls.get('d0-ae1') !== 16)
                        this.fail();
                    if (calls.get('d0-ae2') !== 16)
                        this.fail();
                    if (calls.get('d1-ae1') !== 8)
                        this.fail();
                    if (calls.get('d1-ae2') !== 8)
                        this.fail();
                    if (calls.get('d1.1-ae1') !== 4)
                        this.fail();
                    if (calls.get('d1.1-ae2') !== 4)
                        this.fail();
                    if (calls.get('d1.1.1-ae1') !== 2)
                        this.fail();
                    if (calls.get('d1.1.1-ae2') !== 2)
                        this.fail();
                    if (calls.get('d1.2-ae1') !== 2)
                        this.fail();
                    if (calls.get('d1.2-ae2') !== 2)
                        this.fail();
                    if (calls.get('d7-ae1') !== 2)
                        this.fail();
                    if (calls.get('d7-ae2') !== 2)
                        this.fail();
                };
                TesterTest.prototype.testAfterAll = function () {
                    var calls = this.doAllTestScenarios().calls;
                    if (calls.get('d0-aa1') !== 1)
                        this.fail();
                    if (calls.get('d0-aa2') !== 1)
                        this.fail();
                    if (calls.get('d1-aa1') !== 1)
                        this.fail();
                    if (calls.get('d1-aa2') !== 1)
                        this.fail();
                    if (calls.get('d1.1-aa1') !== 1)
                        this.fail();
                    if (calls.get('d1.1-aa2') !== 1)
                        this.fail();
                    if (calls.get('d1.1.1-aa1') !== 1)
                        this.fail();
                    if (calls.get('d1.1.1-aa2') !== 1)
                        this.fail();
                    if (calls.get('d1.2-aa1') !== 1)
                        this.fail();
                    if (calls.get('d1.2-aa2') !== 1)
                        this.fail();
                    if (calls.get('d5-aa1') !== 1)
                        this.fail();
                    if (calls.get('d5-aa2') !== 1)
                        this.fail();
                    if (calls.get('d7-aa1') !== 1)
                        this.fail();
                    if (calls.get('d7-aa2') !== 1)
                        this.fail();
                };
                TesterTest.prototype.testDescribe_illegalContext = function () {
                    var _this = this;
                    var t = new tester_4.Tester();
                    t.it('t1', function () {
                        _this.failIfNotThrows(function () { return t.describe('t1-d1', function () { }); });
                    });
                };
                TesterTest.prototype.testBeforesAndAfters_illegalContext = function () {
                    var _this = this;
                    var t = new tester_4.Tester();
                    t.it('t1', function () {
                        _this.failIfNotThrows(function () { return t.beforeAll(function () { }); });
                        _this.failIfNotThrows(function () { return t.beforeEach(function () { }); });
                        _this.failIfNotThrows(function () { return t.afterEach(function () { }); });
                        _this.failIfNotThrows(function () { return t.afterAll(function () { }); });
                    });
                };
                TesterTest.prototype.testIt_illegalContext = function () {
                    var _this = this;
                    var t = new tester_4.Tester();
                    t.it('t1', function () {
                        _this.failIfNotThrows(function () { return t.it('t1.1', function () { }); });
                    });
                };
                TesterTest.prototype.testXit = function () {
                    var _this = this;
                    var t = new tester_4.Tester();
                    t.xit("1", this.createSuccess());
                    t.it("2", this.createSuccess());
                    t.describe('level1', function () {
                        t.it("1", _this.createFail());
                        t.xit("2", _this.createSuccess());
                        t.describe('level2', function () {
                            t.xit("1", _this.createFail());
                            t.it("2", _this.createFail());
                        });
                    });
                    var _a = t.finish(), successCount = _a.successCount, failureCount = _a.failureCount;
                    if (successCount !== 1)
                        this.fail();
                    if (failureCount !== 2)
                        this.fail();
                };
                TesterTest.prototype.testSpyOn = function () {
                    var _this = this;
                    var t = new tester_4.Tester();
                    var object = { targetFn: function () { return 'a'; } };
                    if (object.targetFn() !== 'a')
                        this.fail();
                    t.it('t1', function () {
                        t.spyOn(object, 'targetFn').and.returnValue('a1');
                        if (object.targetFn() !== 'a1')
                            _this.fail();
                    });
                    if (object.targetFn() !== 'a')
                        this.fail();
                    t.spyOn(object, 'targetFn').and.returnValue('b');
                    if (object.targetFn() !== 'b')
                        this.fail();
                    t.describe('d', function () {
                        if (object.targetFn() !== 'b')
                            _this.fail();
                        t.it('t2', function () {
                            t.spyOn(object, 'targetFn').and.returnValue('b1');
                            if (object.targetFn() !== 'b1')
                                _this.fail();
                        });
                        if (object.targetFn() !== 'b')
                            _this.fail();
                        t.spyOn(object, 'targetFn').and.returnValue('c');
                        if (object.targetFn() !== 'c')
                            _this.fail();
                    });
                    if (object.targetFn() !== 'b')
                        this.fail();
                    t.finish();
                    if (object.targetFn() !== 'a')
                        this.fail();
                };
                return TesterTest;
            }(_simple_test_3["default"]));
            exports_12("default", TesterTest);
        }
    };
});
System.register("testing/simple_test_runner", ["testing/expectation_test", "testing/spy_test", "testing/tester_test"], function (exports_13, context_13) {
    "use strict";
    var expectation_test_1, spy_test_1, tester_test_1, SimpleTestRunner;
    var __moduleName = context_13 && context_13.id;
    function runFrameworkTests() {
        return SimpleTestRunner.run();
    }
    exports_13("runFrameworkTests", runFrameworkTests);
    return {
        setters: [
            function (expectation_test_1_1) {
                expectation_test_1 = expectation_test_1_1;
            },
            function (spy_test_1_1) {
                spy_test_1 = spy_test_1_1;
            },
            function (tester_test_1_1) {
                tester_test_1 = tester_test_1_1;
            }
        ],
        execute: function () {
            SimpleTestRunner = /** @class */ (function () {
                function SimpleTestRunner() {
                }
                SimpleTestRunner.run = function () {
                    var e_16, _a;
                    var tests = [
                        new expectation_test_1["default"](),
                        new spy_test_1["default"](),
                        new tester_test_1["default"](),
                    ];
                    var output = ['Testing...\n'];
                    var startTime = Date.now();
                    try {
                        for (var tests_2 = __values(tests), tests_2_1 = tests_2.next(); !tests_2_1.done; tests_2_1 = tests_2.next()) {
                            var test = tests_2_1.value;
                            test.run();
                            output.push.apply(output, __spread(test.finish()));
                        }
                    }
                    catch (e_16_1) { e_16 = { error: e_16_1 }; }
                    finally {
                        try {
                            if (tests_2_1 && !tests_2_1.done && (_a = tests_2["return"])) _a.call(tests_2);
                        }
                        finally { if (e_16) throw e_16.error; }
                    }
                    output.push('', "Runtime: " + (Date.now() - startTime) + " ms");
                    return output.join('\n');
                };
                return SimpleTestRunner;
            }());
            exports_13("default", SimpleTestRunner);
        }
    };
});
