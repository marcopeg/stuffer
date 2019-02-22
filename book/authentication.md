# Authentication

The authentication feature uses [JWT](https://jwt.io) to regulate upload and download
capabilities.

## JWT Payload

The JWT payload identifies a **space**:

    {
        "space": "mpeg",
        "exp": 1516239022,
        "iat": 1516239022
    }

## Download

By default anonymous downloads are enabled globally.

If you want to disable this feature you can provide an environment variable:

    AUTH_ENABLE_ANONYMOUS_DOWNLOAD=false

Now you must provide a valid JWT that will allow you to download resources from the
space that is defined in the payload:

    http://stuffer.com/space/uuid/file.jpg?__auth=xxx

**NOTE:** fine grained permissions may be implemented by an __Authorization__ feature.

## Upload

By default you must provide an **Authentication header** with a valid JWT that targets
a specific space for the upload.

    Authentication: Bearer xxx

You can enable anonymous uploads by providing the environment variable:

    AUTH_ENABLE_ANONYMOUS_UPLOAD=true

At that point the resource will be saved into the default space as defined
in the upload feature.
