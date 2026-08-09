import { withRslibConfig } from '@rstest/adapter-rslib';
import { defineConfig } from '@rstest/core';

export default defineConfig({
    extends: withRslibConfig(),
    coverage: {
        enabled: true,
        exclude: ['**/index.ts'],
        thresholds: {
            statements: 95,
            branches: 85,
            functions: 100,
            lines: 90
        }
    }
});
