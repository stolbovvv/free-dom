import nodePath from 'node:path';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import { rollup } from 'rollup';
import { config } from '../config.mjs';
import { globSync } from 'glob';
import chalk from 'chalk';

let cache;

export const handleScripts = async () => {
	const plugins = [nodeResolve(), commonjs()];

	if (config.mode.prod) {
		plugins.push(
			babel({
				babelHelpers: 'bundled',
				exclude: ['node_modules/**'],
			}),
		);
	}

	let bundle;

	try {
		bundle = await rollup({
			input: getEntries(config.path.src.scripts),
			cache,
			plugins,
		});
	} catch (error) {
		handleError(error);
		return;
	}

	try {
		await bundle.write({
			dir: config.path.dest.scripts,
			format: 'es',
			sourcemap: config.mode.dev,
			entryFileNames: `[name].js`,
			chunkFileNames: `[name].js`,
		});

		if (config.mode.prod) {
			await bundle.write({
				dir: config.path.dest.scripts,
				format: 'es',
				sourcemap: false,
				entryFileNames: `[name].min.js`,
				chunkFileNames: `[name].min.js`,
				plugins: [terser()],
			});
		}
	} catch (error) {
		handleError(error);
		return;
	}
};

function getEntries(glob) {
	const entries = {};

	globSync(glob, { ignore: ['**/_*'] }).forEach((path) => {
		const { name } = nodePath.parse(path);
		entries[name] = path;
	});

	return entries;
}

function handleError(error) {
	const name = chalk.bold.red(config.name);

	console.log(`[${name}] ${chalk.bold.red('Rollup error:')}`, chalk.red(error.message));
}
