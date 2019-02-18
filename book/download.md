# Download from Stuffer

When you [upload a file to Stuffer](./upload.md), you will receive the public url
to the newly created resource:

    {
        "files": [
            {
                ...
                "url": {
                    "base": "http://localhost:8080/public/f2",
                    "original": "http://localhost:8080/public/f2/image.jpg"
                },
                ...
            }
        ],
        "errors": [...]
    }

You can simply use this url in a browser to get a copy of the resource, unless you set
the upload as private - In that case you need to generate an authenticated url [to be done].

## Modifiers

Stuffer let you apply a list of _modifiers_ that will affect the end result. Those modifiers
can be applied as _url tokens_ or _query parameters_:

    http://localhost:8080/public/f2/size:small/filter:bw/image.jpg

    or

    http://localhost:8080/public/f2/image.jpg?size=small&filter=bw

Modifiers will be applied in the order they appear in the url, so it is always better to apply
a resize that makes the resulting image smaller before to do any other manipulation so to
achieve a better memory managemement.

Modifiers do not only apply to images, in fact you could write a modifier that compress a file
to a ZIP archive before sending it out.

## Permissions

[to be done]


