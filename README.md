<p align="center">
    <picture>
        <img src='https://raw.githubusercontent.com/alevnyacow/domain-first-events/refs/heads/main/logo.svg?sanitize=true'>
    </picture>
</p>

<p align="center">
    Lightweight domain event bus with fully typed events and handlers.
</p>

# Installation

```bash
npm i @domain-first/events
```

# Quick Start

```ts
import { event, Bus } from "@domain-first/events";

const NumericEvent = event<number>();

const bus = new Bus([
    NumericEvent.register(async (payload) => {
        console.log(`Number: ${payload}`);
    }),
]);

const sendNumericEvent = async () => {
    // `Number: 10` in console
    await bus.dispatch(new NumericEvent(10));
};
```
