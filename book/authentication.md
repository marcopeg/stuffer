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

## JWT Expiry Setting

It is quite important that you always generate JWTs with the shortest possible lifespan,
so even if they are shared in the Internet, nobody will actually be able to access
Stuffer's files.

Long term read-only JWTs may be produced for sharing a specific resource. This is a feature
that is not yet available.

## Download

By default anonymous downloads are enabled globally.

If you want to disable this feature you can provide an environment variable:

    AUTH_ENABLE_ANONYMOUS_DOWNLOAD=false

Now you must provide a valid JWT that will allow you to download resources from the
space that is defined in the payload:

    http://stuffer.com/space/uuid/file.jpg?__auth=xxx

**NOTE:** fine grained permissions may be implemented by an __Authorization__ feature.

When the anonymous download is disable the download is automatically scoped to the
space defined in the JWT. If you want to enable cross-space downloads you can set:

    AUTH_ENABLE_CROSS_SPACE_DOWNLOAD=true

This way you can generate a generic (and short living) JWT that grants download access
to the whole Stuffer instance.

## Upload

By defaul anyone can upload stuff in Stuffer. The resource end up in a default space
that you can customize in the [upload feature](./upload.md).

You can restrict uploads to authenticated requests by setting the evironment variable:

    AUTH_ENABLE_ANONYMOUS_UPLOAD=false

With that configuration active, a user must provide an **Authentication header** with a
valid JWT that targets a specific space for the upload.

    Authentication: Bearer xxx

