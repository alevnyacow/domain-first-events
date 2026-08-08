import type { DispatchData, HandlerRegistrationData } from '../types';

export class Bus {
    constructor(private readonly rules: HandlerRegistrationData<any>[]) {}

    dispatch = async <Payload>(event: {
        dispatchData: DispatchData<Payload>;
    }): Promise<{ errors: Map<string, unknown[]> }> => {
        const errors: Map<string, unknown[]> = new Map();
        const { key, metadata, payload } = event.dispatchData;
        const accordingHandlers = this.rules.filter((x) => x.key === key);

        for (const {
            handler,
            label,
            failDispatchOnError
        } of accordingHandlers) {
            try {
                await handler(payload, metadata);
            } catch (e: unknown) {
                if (failDispatchOnError) {
                    throw e;
                }

                errors.set(
                    label || '',
                    (errors.get(label || '') ?? []).concat(e)
                );
            }
        }

        return { errors };
    };
}
