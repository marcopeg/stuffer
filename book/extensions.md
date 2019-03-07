# Extensions

Stuffer is a framework that handles uploads and downloads,
the point is that you can, and should, extend it to suit your needs.

## Core Extensions

Stuffer comes with some **core extensions**. They are basically features that you can
opt-in in your `stuffer-config.json` file:

    ...
    "extensions": [
        "prc-gzip",
        "mod-jimp",
        ...
    ],

[Read more about the Stuffer configuration](./configuration.md)

Then you need to refer to each extension's documentation page to learn how to use it
and how to configure it.

- General
    - [store-s3](./core-extensions/store-s3.md)
    - [cache](./core-extensions/cache.md)
- Modifiers:
    - [mod-jimp](./core-extensions/mod-jimp.md)

## Community Extensions

[[ TBD ]]

## Create Your Extension

[[ TBD ]]
