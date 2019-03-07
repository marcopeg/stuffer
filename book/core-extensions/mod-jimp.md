# mod-jimp

This extension provides image resize and filtering modifiers.

## resize

How to use it:

    http://stuffer.com/space/uuid/image.jpg?resize=small
    http://stuffer.com/space/uuid/image.jpg?resize=big

Configuration:

    ...
    "modifiers": {
        "resize": {
            "small": [ 150, "auto", 60 ],
            "thumb": [ 80, 80, 80, "cover" ],
            "square": [ 500, 500, 80, "contain"]
        }
    }

## filter

How to use it:

    http://stuffer.com/space/uuid/image.jpg?filter=bw

Configuration:

    ...
    "modifiers": {
        "filter": [ "bw" ]
    }

Supported filters:

    - bw (black and white)
