import type {
    DispatchData,
    Handler,
    HandlerRegistrationData,
    HandlerRegistrationMetadata
} from '../types';

export const event = <T>() => {
    const key = Symbol();

    class EventBase {
        constructor(private readonly payload: T) {}

        private readonly occuredAt = Date.now();

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
                failDispatchOnError: metadata?.failDispatchOnError,
                label: metadata?.label
            };
        }
    }

    return EventBase;
};
