#!/usr/bin/env node

import yargs from 'yargs/yargs';
import findUp from 'find-up';
import fs from 'fs-extra';

const packageJson = require(findUp.sync('package.json', { cwd: __dirname }));

interface Args {
    config?: string;
    files?: string[];
    byDate?: boolean;
}


yargs(process.argv.slice(2)).command<Args>('$0', 'reorder pages', yargv => {
    yargv.version(packageJson.version);

    yargv.option('config', {
        type: 'string',
        alias: 'c',
        describe: 'config file listing file names'
    });

    yargv.option('files', {
        type: 'array',
        alias: 'f',
        describe: 'file to sort'
    });

    yargv.option('by-date', {
        type: 'boolean',
        alias: 'd',
        describe: 'sort files by date'
    });

}, async argv => {
    let files: string[] = [];

    if (argv.config)
        files.push(... (await fs.readFile(argv.config, 'utf8')).split(/\s*\n\s*/).map(f => f.trim()).filter(f => !!f));

    if (argv.files)
        files.push(...argv.files);

    if (argv.byDate) {
        files = await Promise.all(
            files.map(async file => ({ file, stat: await fs.stat(file) }))
        ).then(stats => stats
            .sort((s1, s2) => s1.stat.mtime.getTime() - s2.stat.mtime.getTime())
            .map(({ file }) => file)
        );
    }

    // console.log(files);
    console.log(merge(files).join(' '));

}).argv;


function merge(files: string[]) {
    const n2 = files.length / 2;

    const even = files.slice(0, n2); // n2 exlucded
    const odd = files.slice(n2).reverse();

    const isMoreOdd = odd.length - even.length;
    console.assert(isMoreOdd <= 1, 'odd/even diff must be 0 or 1');

    if (isMoreOdd === 1)
        even.push(undefined);

    const merged = odd.reduce((merge, oddI, i) => merge.concat([ oddI, even[ i ] ].filter(v => !!v)), []);

    return merged;
}
