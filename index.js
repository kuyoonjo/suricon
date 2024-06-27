#!/usr/bin/env node

const { program } = require('commander');
const sharp = require('sharp');
const { name, version, description } = require('./package.json');

program
    .name(name)
    .usage(`-i <path> -o <path>`)
    .addHelpText('afterAll', `\r\nExample:\r\n ${name} -i input.png -o output.png`)
    .description(description)
    .version(version)
    .option('-i, --input <path>', 'input image file path')
    .option('-o, --output <path>', 'output image file path');

program.parse();
const options = program.opts();

if (options.input && options.output) {
    (async () => {
        const roundedCorners = Buffer.from(
            '<svg><rect x="0" y="0" width="880" height="880" rx="168" ry="168"/></svg>'
        );
        const input = await sharp(options.input)
            .resize(880)
            .composite([{
                input: roundedCorners,
                blend: 'dest-in'
            }])
            .toBuffer();
        sharp({
            create: {
                width: 1024,
                height: 1024,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        })
            .composite([
                { input, gravity: 'center' },
            ])
            .png()
            .toFile(options.output);
    })();


} else {
    program.help();
}
