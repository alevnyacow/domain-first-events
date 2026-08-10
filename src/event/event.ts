import type {
    DispatchData,
    Handler,
    HandlerRegistrationData,
    HandlerRegistrationMetadata
} from '../types';

export const event = <T>() => {
    const key = Symbol();

    class EventBase {
        public readonly dispatchData: DispatchData<T>;
        constructor(payload: T) {
            this.dispatchData = {
                key,
                metadata: { occuredAt: Date.now() },
                payload
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
