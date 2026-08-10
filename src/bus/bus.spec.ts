import { describe, expect, test } from '@rstest/core';
import { event } from '../event/event';
import { Bus } from './bus';

describe('event bus', () => {
    const NumericEvent = event<number>();

    const BooleanEventForException = event<boolean>();
    const BooleanEventForCriticalException = event<boolean>();

    const BooleanEventForCriticalExceptionWithoutLabel = event<boolean>();

    const numbers: Array<number> = [];

    const labelForExceptionHandler = Math.random().toString();
    const labelForCriticalExceptionHandler = Math.random().toString();

    const bus = new Bus([
        NumericEvent.register(async (x) => {
            numbers.push(x);
        }),
        BooleanEventForException.register(
            (x) => {
                throw x;
            },
            { label: labelForExceptionHandler }
        ),
        BooleanEventForException.register((x) => {
            throw x;
        }),
        BooleanEventForCriticalException.register(
            (x) => {
                throw x;
            },
            {
                label: labelForCriticalExceptionHandler,
                failDispatchOnError: true
            }
        ),
        BooleanEventForCriticalExceptionWithoutLabel.register(
            (x) => {
                throw x;
            },
            { failDispatchOnError: true }
        )
    ]);

    test('numeric events', async () => {
        const localNumbers: Array<number> = [];
        for (let i = 0; i < 100; i++) {
            const randomNumber = Math.ceil(Math.random() * 10000);
            localNumbers.push(randomNumber);
            const { errors } = await bus.dispatch(
                new NumericEvent(randomNumber)
            );
            expect(errors.size).toBe(0);
        }
        expect(numbers).toEqual(localNumbers);
    });

    test('events for exception', async () => {
        for (let i = 0; i < 100; i++) {
            const flag = Math.random() > 0.5;
            const { errors } = await bus.dispatch(
                new BooleanEventForException(flag)
            );
            expect(errors.size).toBe(2);
            expect(Array.from(errors.keys())).toEqual([
                labelForExceptionHandler,
                ''
            ]);
            for (const key of [labelForExceptionHandler, '']) {
                const currentErrors = errors.get(key);
                expect(currentErrors).toBeTruthy();
                if (currentErrors) {
                    expect(currentErrors.length).toBe(1);
                }
                const [currentErrorFlag] = currentErrors!;
                expect(currentErrorFlag).toBe(flag);
            }
        }
    });

    describe('critical exceptions', () => {
        test('with label', async () => {
            for (let i = 0; i < 100; i++) {
                const flag = Math.random() > 0.5;
                const dispatchWithCriticalError = async () =>
                    await bus.dispatch(
                        new BooleanEventForCriticalException(flag)
                    );

                await expect(dispatchWithCriticalError).rejects.toMatchObject({
                    cause: flag,
                    details: {
                        label: labelForCriticalExceptionHandler,
                        payload: flag
                    }
                });
            }
        });

        test('without label', async () => {
            for (let i = 0; i < 100; i++) {
                const flag = Math.random() > 0.5;
                const dispatchWithCriticalError = async () =>
                    await bus.dispatch(
                        new BooleanEventForCriticalExceptionWithoutLabel(flag)
                    );

                await expect(dispatchWithCriticalError).rejects.toMatchObject({
                    cause: flag,
                    details: {
                        label: '',
                        payload: flag
                    }
                });
            }
        });
    });
});
