import * as EventEmitter from 'events';

/**
 * A function type that takes an arbitrary number of arguments and returns anything (including void)
 */
export type CallbackFunction = (...args: any[]) => any;

export abstract class EventProvider {
    /**
     * Adds the listener function to the end of the listeners array for the event named eventName
     * @param eventName 
     * @param listener The event handler function
     */
    abstract on(eventName: string, listener: CallbackFunction);

    /**
     * Register a listener that the EventEmitter calls not more than once for a particular event
     * @param eventName 
     * @param listener The event handler function
     */
    abstract once(eventName: string, listener: CallbackFunction);

    /**
     * Remove the listener from a particular event.
     * 
     * If you added more than one instance of a listener, you need to remove it more than once to get rid of it
     * @param eventName 
     * @param listener The event handler function
     */
    abstract remove(eventName: string, listener: CallbackFunction);

    /**
     * Remove all listeners for a particular event
     * 
     * @param eventName 
     */
    abstract removeAll(eventName: string);

    /**
     * Emits an event
     * @param eventName 
     * @param args 
     */
    abstract emit(eventName: string, ...args: any[]);
}

export class NodeEventEmitterProvider implements EventProvider {
    private readonly event = new EventEmitter();
    on(eventName: string, listener: CallbackFunction) {
        this.event.on(eventName, listener);
    }
    once(eventName: string, listener: CallbackFunction) {
        this.event.once(eventName, listener);
    }
    remove(eventName: string, listener: CallbackFunction) {
        this.event.removeListener(eventName, listener);
    }
    removeAll(eventName: string) {
        this.event.removeAllListeners(eventName);
    }
    emit(eventName: string, ...args: any[]) {
        this.event.emit(eventName, ...args);
    }
}