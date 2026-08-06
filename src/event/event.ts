import type {
    DispatchData,
    Handler,
    HandlerRegistrationData,
    HandlerRegistrationMetadata
} from '../types';

export const event = <T>() => {
    const key = Symbol();

    class EventBase {
        constructor(public readonly payload: T) {}

        public readonly occuredAt = Date.now();

        get dispatchData(): DispatchData<T> {
            return {
                key,
                payload: this.payload,
                metadata: { occuredAt: this.occuredAt }
            };
        }

        static register(
            handler: Handler<T>,
            metadata?: HandlerRegistrationMetadata
        ): HandlerRegistrationData<T> {
            return {
                handler,
                key,
                isCritical: metadata?.isCritical,
                label: metadata?.label
            };
        }
    }

    return EventBase;
};
