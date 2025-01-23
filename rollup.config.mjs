import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';

import pkg from './package.json' assert { type: 'json' };

const plugins = (tsconfigOverride, env) => [
    typescript({
        tsconfigOverride,
        // useTsconfigDeclarationDir: true,
    }),
    nodeResolve(),
    commonjs({
        transformMixedEsModules: true,
    }),
    json({
        compact: true,
    }),
    replace({
        'process.env.SDK_ENVIRONMENT': JSON.stringify(env || 'web'),
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment:true,
    }),
];

const banner = `/* @thoughtspot/visual-embed-sdk version ${pkg.version} */`;

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/tsembed.js',
                format: 'umd',
                inlineDynamicImports: true,
                name: 'tsembed',
                banner,
            },
            {
                dir: 'dist',
                format: 'es',
                entryFileNames: 'tsembed.es.js',
                banner,
            },
        ],
        external: [...Object.keys(pkg.peerDependencies || {})],
        plugins: plugins({}, 'web'),
    },
    {
        input: 'src/react/index.tsx',
        output: [
            {
                file: 'dist/tsembed-react.js',
                format: 'umd',
                inlineDynamicImports: true,
                name: 'tsembed',
                banner,
            },
            {
                dir: 'dist',
                format: 'es',
                entryFileNames: 'tsembed-react.es.js',
                banner,
            },
        ],
        external: [...Object.keys(pkg.peerDependencies || {})],
        plugins: plugins({}, 'web'),
    },
    {
        input: 'src/mobile/index.ts',
        output: [
            // {
            //     file: 'dist/index.mobile.js',
            //     format: 'cjs',
            //     sourcemap: true,
            //     banner,
            // },
            // {
            //     file: 'dist/index.mobile.es.js',
            //     format: 'es',
            //     sourcemap: true,
            //     banner,
            // },
            // {
            //     dir: 'dist', // Dir for CJS
            //     format: 'cjs',
            //     entryFileNames: 'tsembed-mobile.js',
            //     sourcemap: true,
            //     banner,
            // },
            // {
            //     dir: 'dist', // Dir for ES
            //     format: 'es',
            //     entryFileNames: 'tsembed-mobile.es.js',
            //     sourcemap: true,
            //     banner,
            // }
            {
                // dir: 'dist/mobile',
                // entryFileNames: 'tsembed-mobile.js',
                file: 'dist/tsembed-mobile.js',
                format: 'cjs',
                inlineDynamicImports: true,
                name: 'tsembed',
            },
            {
                // dir: 'dist/mobile',
                // entryFileNames: 'tsembed-mobile.es.js',
                file: 'dist/tsembed-mobile.es.js',
                format: 'es',
                inlineDynamicImports: true,
            },
        ],
        // external: [
        //     // 'react-native', // Ensuring react-native is external
        //     // 'react-native-url-polyfill', // Ensuring the polyfill is external
        //     ...Object.keys(pkg.peerDependencies || {}).filter(
        //         (dep) => dep !== 'react-dom' // Exclude react-dom for mobile builds
        //     ),
        // ],
        external: (id) => {
            // Mark `mixpanel-service` as external for mobile builds
            return id.includes('mixpanel-service') || Object.keys(pkg.peerDependencies || {}).includes(id);
        },
        plugins: plugins({
            // compilerOptions: {
            //     declaration: true,
            //     jsx: 'react-native',
            //     declarationMap: true,
            //     declarationDir: 'dist',
            //     outDir: 'dist',
            //     rootDir: 'src',
            //     target: 'ES5',
            //     module: 'ESNext',
            //     lib: ['esnext'],
            //     moduleResolution: 'nodenext',
            // },
            // include: ['src/index.mobile.ts'],
        }, 'mobile'),
        treeshake: true,
        
    },
];
