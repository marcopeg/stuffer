# Writing Extensions

You can use this folder to work on extension.

## Dev Extensions

Whatever you write in `./dev` will not run in production.  
Use this folder to work on an extension using the reaper in development mode.

If you are working on a **core extension** you can enjoy any flavour of ES6
and can reference other files around the project.

If you are working on a **community extension** you should provide a NodeJS 10.x
compatible syntax, or you should transpile your extension.

## Core Extensions

If you contribute with a **core extension**, users all around the planet will
be able to activate it with an environment variable:

    EXTENSIONS=foo|another|your-extension

_Core extensions are shipped with the public Docker image._

## Community Extensions

People can run the official Docker image and still add custom made extensions
by mapping a volume in:

    /var/lib/pigtail/extensions

Extensions in this folder should be NodeJS 10.x compatible, you'd better transpile
your community extension.

## Extension's Structure

An extension should look like the "./dev/_foo" extension here provided.  

## Disabled Extensions

Prefix an extension's folder with `_` to disable it.

