# Configuration

Most of the Stuffer's features can be fine tuned via environment variables.
Here is a comprehensive list of what you can define.

## Environment Variables

Most of the Stuffer behaviours can be customized at boot time through the
definition of environment variables that you normally add to your
docker-compose file.

###### LOG_LEVEL

Regulates the amount of logging that Stuffer generates: 

    LOG_LEVEL=error

Possible values: error|info|verbose|debug

###### STUFFER_DATA

Defines a writeable disk location where Stuffer will store its data.

    STUFFER_DATA=/var/lib/stuffer/data

###### STUFFER_CONFIG

Path to a `.stufferc` configuration file.

    STUFFER_CONFIG=/var/lib/stuffer/stuffer-config.json

###### JWT_SECRET

Secret used to validate JWTs

    JWT_SECRET=stuffer

###### UPLOAD_MOUNT_POINT

    UPLOAD_MOUNT_POINT=/upload

###### UPLOAD_PUBLIC_SPACE

    UPLOAD_PUBLIC_SPACE=public
    
###### UPLOAD_BUFFER_SIZE

In bits

    UPLOAD_BUFFER_SIZE=2097152
    (2Mbit)

###### UPLOAD_MAX_SIZE

In bytes

    UPLOAD_MAX_SIZE=1048576000
    (1Gb)

###### UPLOAD_MAX_FILE_SIZE

In bytes

    UPLOAD_MAX_FILE_SIZE=1048576000
    (1Gb)

###### UPLOAD_MAX_FIELD_SIZE

In bytes

    UPLOAD_MAX_FIELD_SIZE=5120

###### UPLOAD_MAX_FILES

    UPLOAD_MAX_FILES=10

###### UPLOAD_MAX_FIELDS

    UPLOAD_MAX_FIELDS=30

###### DOWNLOAD_BASE_URL

    DOWNLOAD_BASE_URL=http://localhost:8080

###### DOWNLOAD_MOUNT_POINT

    DOWNLOAD_MOUNT_POINT=/

###### AUTH_ENABLE_ANONYMOUS_UPLOAD

    AUTH_ENABLE_ANONYMOUS_UPLOAD=true

###### AUTH_ENABLE_ANONYMOUS_DOWNLOAD

    AUTH_ENABLE_ANONYMOUS_DOWNLOAD=true

###### AUTH_ENABLE_CROSS_SPACE_DOWNLOAD

    AUTH_ENABLE_CROSS_SPACE_DOWNLOAD=false

###### STUFFER_COMMUNITY_EXTENSIONS

    STUFFER_COMMUNITY_EXTENSIONS=/var/lib/stuffer/extensions

## stuffer-config.json

We are in the process of migrating some configuration into a JSON file.
The idea is let you write configurations that can be extended and detailed by:

    - stuffer instance
    - space
    - uuid

As an example you can define define the available sizes for the modifier "resize"
for any image in a stuffer instance, but then you can override the configuration
for a specific space.

Here is an example of a `stuffer-config.json`:

    {
        "extensions": [
            "prc-gzip",
            "mod-jimp",
            "#cache"
        ],

        "postprocess": {
            "gzip": {
                "match": "(.*).pdf",
                "apply":"gzip",
                "options": {}
            }
        },

        "modifiers": {
            "resize": {
                "small": [256, "auto", 80],
                "medium": [512, "auto", 80],
            }
        },

        "spaces": {
            "public": {
                "modifiers": {
                    "resize": {
                        "small": [150, 150, 60, "contain"],
                        "thumb": [150, 150, 60, "cover"]
                    }
                },
            }
        }
    }

First thing we list which **core extensions** are enabled. `prc-gzip` and `mod-jimp` 
are active, but `cache` is not. That's because of the `#` prefix. You can consider
the `#` as commenting the extension out.

Then we create a global configuration for the `postprocess` and `modifiers`. This
will apply to any resource in this Stuffer instance.

As instance we will always be able to download a "small" image as:  

    http://stuffer-instance.com/space/uuid/image.jpg?resize=small

The only thing is that if you download from the space `public` you will get a
resized image of 150x150 with the original image inside this area, any other space
will give you an image of 256px width that respect the original ratio.

**NOTE:** Future releases will increment the capabilities of `stuffer-config.json`

If you use Stuffer via Docker you can provide your own configuration as volume:

    docker run --rm \
      -p 8080:8080 \
      -v ${PWD}/stuffer-data:/var/lib/stuffer/data \
      -v ${PWD}/stuffer-config.json:/var/lib/stuffer/stuffer-config.json \
      marcopeg/stuffer



