import { describe, expect, test } from '@rstest/core';
import dayjs from 'dayjs';
import { event } from './event';

describe('numeric event', () => {
    const Event = event<number>();

    test('can be instantiated', () => {
        const event = new Event(0);
        expect(event).toEqual(expect.any(Event));
    });

    describe('dispatch data', () => {
        test.each([-100, 0, 100])('has correct payload of %s', (value) => {
            const event = new Event(value);
            expect(event.dispatchData.payload).toBe(value);
        });

        describe('key', () => {
            test('is a symbol', () => {
                const event = new Event(0);
                expect(event.dispatchData.key).toEqual(expect.any(Symbol));
            });

            test('is consistent between instances', () => {
                const event = new Event(0);
                const event2 = new Event(10);
                expect(event.dispatchData.key).toEqual(event2.dispatchData.key);
            });
        });

        describe('occuredAt', () => {
            test('is the same day as today', async () => {
                const event = new Event(0);
                const {
                    metadata: { occuredAt }
                } = event.dispatchData;
                expect(dayjs(occuredAt).isSame(dayjs(), 'date')).toBe(true);
            });

            test('two instantiated events occured at the same day', async () => {
                const event = new Event(0);
                const event2 = new Event(10);
                expect(
                    dayjs(event.dispatchData.metadata.occuredAt).isSame(
                        dayjs(event2.dispatchData.metadata.occuredAt),
                        'date'
                    )
                ).toBe(true);
            });
        });
    });

    describe('registration logic', async () => {
        let counter = 0;
        const registrationData = Event.register(
            (payload) => {
                counter += payload;
            },
            { failDispatchOnError: false, label: 'Increase counter' }
        );

        const payloadData = Math.ceil(Math.random() * 1000);
        const event = new Event(payloadData);

        test('registration data content', () => {
            expect(registrationData.failDispatchOnError).toBe(false);
            expect(registrationData.label).toBe('Increase counter');
            expect(registrationData.key).toEqual(event.dispatchData.key);
        });

        test('handlers', async () => {
            const iterations = Math.ceil(Math.random() * 100);
            for (let i = 0; i < iterations; i++) {
                await registrationData.handler(
                    event.dispatchData.payload,
                    event.dispatchData.metadata
                );
            }
            expect(counter).toBe(payloadData * iterations);
        });
    });
});
