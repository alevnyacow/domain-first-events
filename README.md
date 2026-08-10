<p align="center">
    <picture>
        <img src='https://raw.githubusercontent.com/alevnyacow/domain-first-events/refs/heads/main/logo.svg?sanitize=true'>
    </picture>
</p>

<p align="center">
    Lightweight domain event bus with fully typed events and handlers.
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/%40domain-first%2Fevents" alt="version">
  <img src='https://img.shields.io/badge/test%20coverage-100%25-brightgreen'>
  <img src="https://img.shields.io/badge/TypeScript-ready-3178C6?logo=typescript&logoColor=white?style=for-the-badge" alt="size">
  <img src="https://img.shields.io/npm/l/%40domain-first%2Fevents" alt="license">
</p>

# Installation

```
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
    NumericEvent.register(
        async (payload) => {
            throw payload;
        },
        // Optional handler registration metadata.
        {
            // Used to identify the handler error
            // in the dispatch result.
            label: "HANDLER WITH ERROR",
            // If true, dispatch throws when this
            // handler fails.
            // Otherwise, the error is included in
            // the returned error map.
            failDispatchOnError: false,
        },
    ),
]);

const sendNumericEvent = async () => {
    // `Number: 10` in the console
    const result = await bus.dispatch(new NumericEvent(10));
    // Map(1) { 'HANDLER WITH ERROR': 10 }
    console.log(result.errors);
};
```
