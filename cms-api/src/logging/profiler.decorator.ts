import { performance } from "perf_hooks";
import { logger } from "./logger";

/**
 * The decorator to capture the time a method takes to execute
 * @param outputConsole The first parameter will tell if we want to display in the console the performance.
 * @param thresholdToDisplayErrorInMs (default: 1000ms) The second parameter is when to change the log into an error. 
 * It’s the threshold in millisecond of when it’s too long for the method.
 */
export function Profiler(outputConsole: boolean, thresholdToDisplayErrorInMs: number = 1000) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        // Ensure we have the descriptor that might been overriden by another decorator
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        }

        if (!descriptor || (typeof descriptor.value !== 'function')) {
            throw new TypeError(`Only methods can be decorated with @Profiler. <${propertyKey}> is not a method!`);
        }

        const originalMethod = descriptor.value;
        // Redefine the method to this new method who will call the original method
        // Use the function's this context instead of the value of this when log is called (no arrow function)
        descriptor.value = async function (...args: any[]) {
            //Error Converting circular structure when using JSON.stringify(request)
            //const parametersAsString = args.filter(param => typeof param !== 'function').map((param) => JSON.stringify(param)).join(",");
            const parametersAsString = '...';
            const startTime = performance.now();

            const result = await originalMethod.apply(this, args); // Call the original method
            const stringResult = JSON.stringify(result)
            const endTime = performance.now();
            const timeSpan = endTime - startTime;
            const message = "Call [" + timeSpan.toFixed(3) + "ms]: " + propertyKey + "(" + parametersAsString + ") => " + stringResult;
            if (timeSpan < thresholdToDisplayErrorInMs) {
                if (outputConsole) console.log(message);
                logger.info(message);
            } else {
                if (outputConsole) console.error(message);
                logger.error(message);
            }
            return result;
        };
    };
}