# Modifiers

Stuffer let you apply a list of _modifiers_ that will affect the fetched resource. 
Those modifiers can be applied as _url tokens_ or _query parameters_:

    http://localhost:8080/public/f2/size:small/filter:bw/image.jpg

    or

    http://localhost:8080/public/f2/image.jpg?size=small&filter=bw

> **Modifiers are applied in the order they appear in the url**, so it is always better to apply
> a resize that makes the resulting image smaller before to do any other manipulation so to
> achieve a better memory and CPU managemement.

Modifiers do not only apply to images, in fact you could write a modifier that compress a file
to a ZIP archive before sending it out.

#### Core Modifiers

Stuffer ships with some basic modifiers that can handle image resize or filtering
requests. They are packaged as [extensions](./extensions.md) and you can read about
them in the Core Extensions section.

---

# Create Your Modifier

A _Modifier_ is basically a function that receives a [buffer](https://nodejs.org/api/buffer.html)
and alter it to produce a change in the original file.

We package this function within a Node module so that you can implement some other
methods and produce a high quality piece of logic that is both perfromant and safe.

## API

A modifier should expose the following methods:

    export default {
        parse: (value, options, req, res) => value,
        validate: (value, options, req, res) => true,
        cacheName: (value, options, req, res) => 'foo',
        handler: async (buffer, value, options, req, res) => buffer
    }

## Methods

#### `any:parse(rawValue, options, req, res)`

_SYNC_ - takes in the raw value as passed in the _URL_ and should return the internal
value as it may be used by the other methods.

#### `bool:validate(parsedValue, options, req, res)`

_SYNC_ - uses the parsed value and the available options to stop unrightful requests.

You must return `true` for the validation to pass.

Else you can either return `false` or `throw new Error()`.

#### `string:cacheName(parsedValue, options, req, res)`

_SYNC_ - returns a string that will contribute in composing the cache file name

#### `async handler(buffer, parsedValue, req, res)`

_ASYNC_ - uses the buffer to apply a transormation. 

It must return or resolve with the new buffer.

## Arguments

#### value

It is the value assigned to the modifier in the url:

    ...image.jpg?resize=small&filter=bw

In the above example "small" and "bw" are the values.

After the `parse()` method is applied the value may be transformed into something
more refined. The idea with `parse()` is that a modifier parameter may contain
_json_  or _base64 encoded_  data that need to be transformed (parsed) before use.

#### options

It is an object `{}` that contains the server-side settings for the modifier.
It is usually used by `validate()` to verify that the request matches the capabilities
of a modifier, and by `handler()` to fetch data that may affect the resulting buffer.

In my way of thinking when you use a modifier in a url, you pass a value that is simply
a keyword reference to a piece of information that is available in the options. I call
this a *policy* and I believe is a good way to limit the side effects of modifiers.

As example the "resize" modifier accepts only a small string as value:

    ...?image.jpg?resize=thumb

That `thumb` keyword need to be available into the modifier options for the modifier
to validate, and need to have a specific set of data for the modifier to work properly:

    {
        "resize": {
            "small": [ 50, 'auto', 60 ],
            "thumb": [ 90, 90, 60 ]
        }
    }

This way you can only ask for a "small" or "thumb" version of a specific image, any other
modifier values will end up in a request error.

The idea is to protect the image service from an indiscriminate amount of requests that may
fill up the disk space or kill the process due to RAM problems.

The options may be defined by:

1. the system
2. the space (to be done)
3. the file

Each level extends the previous one and overrides seamless keywords.

#### buffer

A [NodeJS buffer](https://nodejs.org/api/buffer.html)

#### req, res

You can access `req.data.download` to see all the available informations regarding the current
download request.

