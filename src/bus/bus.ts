import { CriticalHandlerFailedError } from '../errors';
import type { DispatchData, HandlerRegistrationData } from '../types';

export class Bus {
    constructor(private readonly rules: HandlerRegistrationData<any>[]) {}

    dispatch = async <Payload>(event: {
        dispatchData: DispatchData<Payload>;
    }): Promise<{ errors: Map<string, unknown[]> }> => {
        const errors: Map<string, unknown[]> = new Map();
        const { key, metadata, payload } = event.dispatchData;
        const accordingHandlers = this.rules.filter((x) => x.key === key);

        const criticalHandlers = accordingHandlers.filter(
            (x) => !!x.failDispatchOnError
        );

        for (const { handler, label } of criticalHandlers) {
            try {
                await handler(payload, metadata);
            } catch (e: unknown) {
                throw new CriticalHandlerFailedError(
                    {
                        label: label || '',
                        payload,
                        metadata,
                        cause: e
                    },
                    { cause: e }
                );
            }
        }

        const nonCriticalHandlers = accordingHandlers.filter(
            (x) => !x.failDispatchOnError
        );

        for (const { handler, label } of nonCriticalHandlers) {
            try {
                await handler(payload, metadata);
            } catch (e) {
                errors.set(
                    label || '',
                    (errors.get(label || '') ?? []).concat(e)
                );
            }
        }

        return { errors };
    };
}
