export type Handler<Payload> = (
    payload: Payload,
    metadata: { occuredAt: number }
) => Promise<void> | void;

export type DispatchData<Payload> = {
    key: Symbol;
    payload: Payload;
    metadata: { occuredAt: number };
};

export type HandlerRegistrationMetadata = {
    label?: string;
    isCritical?: boolean;
};

export type HandlerRegistrationData<Payload> = HandlerRegistrationMetadata & {
    key: Symbol;
    handler: Handler<Payload>;
};
