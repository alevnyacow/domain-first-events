import { errorNamespace } from '@domain-first/errors';

const Errors = errorNamespace('@domain-first/errors');

export const CriticalHandlerFailedError = Errors.define<{
    label: string;
    payload: unknown;
    metadata: unknown;
    cause: unknown;
}>('CRITICAL_HANDLER_FAILED');
