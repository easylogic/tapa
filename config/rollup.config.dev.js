
// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

import pkg from '../package.json';

const extensions = ['.ts'];

export default {
  input: 'example/main.ts',
  output: [
    {
        file: 'dist/cjs/index.js',
        format: 'umd',
        name: 'Tapa',
    },
    {
        file: 'dist/esm/index.js',
        format: 'es',
        name: 'Tapa',
    },
  ],
  plugins: [
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
    }),
    babel({
        exclude: 'node_modules/**',
        extensions,
    }),
    resolve(),
    commonjs(),
    serve({
        open: true,
        openPage: '/',
        host: 'localhost',
        port: 3003,
        contentBase: ['.', './dist', './example'],
    }),
    livereload({
        watch: ['./example', './dist'],
        exts: ['html', 'js', 'css'],
    }),
  ]
};