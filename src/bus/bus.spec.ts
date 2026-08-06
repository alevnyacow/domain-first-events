import { expect, test } from '@rstest/core';
import { event } from '../event/event';
import { Bus } from './bus';

test('sup', async () => {
    const NumericEvent = event<number>();
    const AnotherNumericEvent = event<number>();
    const b = new Bus([
        NumericEvent.register((x) => {
            console.log(x);
        }),
        NumericEvent.register(async (x) => {
            console.log(`SUP ${x}`);
        }),
        AnotherNumericEvent.register(
            (x) => {
                throw x;
            },
            { label: 'sup 2' }
        ),
        AnotherNumericEvent.register(
            (x) => {
                throw x;
            },
            { label: 'sup 1' }
        ),
        AnotherNumericEvent.register((x) => {
            throw x;
        })
    ]);
    await b.dispatch(new NumericEvent(55));
    console.log(await b.dispatch(new AnotherNumericEvent(60)));
    await b.dispatch(new NumericEvent(80));
    expect(true).toBe(true);
});
