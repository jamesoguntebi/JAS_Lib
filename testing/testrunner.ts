import {Tester} from './tester';

export function runTests(tests: Test[], options: TestRunnerOptions) {
  TestRunner.run(tests, options);
  return Logger.getLog();
}

export class TestRunner {
  static run(tests: Test[], {
    suppressLogs = true,
    showSuccesses = true,
    testerClass = Tester,
  }: TestRunnerOptions) {
    // Suppress logs inside tests.
    const storedLogFn = Logger.log;
    if (suppressLogs) {
      Logger.log = (_: any): typeof Logger => {
        return Logger;
      };
    }

    let successTotal = 0;
    let failureTotal = 0;
    const outputTotal = ['Testing...\n'];
    const startTime = Date.now();

    for (const test of tests) {
      const testStartTime = Date.now();
      const tester = new testerClass(showSuccesses);
      test.run(tester);
      const {successCount, failureCount, output} = tester.finish();
      successTotal += successCount;
      failureTotal += failureCount;
      const runTime = `(in ${Date.now() - testStartTime} ms)`;
      if (!failureCount) {
        outputTotal.push(`${test.constructor.name} ✓ ${runTime}`);
      } else {
        outputTotal.push(
            `${test.constructor.name} - ${failureCount} failures ${runTime}`);
      }
      if (failureCount || showSuccesses) outputTotal.push(...output, '');
    }

    outputTotal.push('');
    outputTotal.push(
        `Total -- ${TestRunner.getStats(successTotal, failureTotal)} ` +
        `(in ${Date.now() - startTime} ms)`);
    outputTotal.push('');

    if (suppressLogs) Logger.log = storedLogFn;

    if (outputTotal.length < 100) {
      Logger.log(outputTotal.join('\n'));
    } else {
      const pages = Math.ceil(outputTotal.length / 100);
      let page = 1;
      while (outputTotal.length) {
        Logger.log([
          `Testing ... page ${page++}/${pages}`, ...outputTotal.splice(0, 100)
        ].join('\n'));
      }
    }
  }

  private static getStats(success: number, failure: number): string {
    return `${success + failure} run, ${success} pass, ${failure} fail`;
  }
}

export interface Test {
  run: (t: Tester) => void;
}

export interface TestRunnerOptions {
  suppressLogs?: boolean;
  showSuccesses?: boolean;
  testerClass?: typeof Tester;
}
