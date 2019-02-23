# What is Stuffer?

**Stuffer allows you to upload / download resources.**   
A resource can be any type of file, of any size, up to your limits.

When you access a resource for download, you can apply [modifiers](./book/modifiers.md).
Say you want an image, you can resize it on the fly. Or make it b/w. Or more.

Modifiers are just extensions that you can add to your Stuffer instance. We ship some
[core extensions](./book/core-extensions) that you can quickly enable, but the sky
is the limit when it comes to write your own! In NodeJS.

Stuffer is a file storage framework: **you can extend it with custom features** to make
it do what you need. If you are a good guy, you will share your extensions on NPM or GitHub.

> So far we cover **local cache** for modified resources and **cloud storage with S3**.

You can put a CDN (es. CloudFront) on top of your Stuffer instance/cluster so to optimize
the delivery of the final resources.

**Any resource can be public or protected.**  
We handle basic protection with JWT. It's simple and reliable, but you can override this
with your own implementation. Again, Stuffer is just a framework!

---

## Quick Start

    docker run -p 8080:8080 marcopeg/stuffer

Try to post a file to `http://localhost:8080/upload`:

    curl -X POST http://localhost:8080/upload \
        -F f1_uuid=f1 \
        -F f1_name=image.jpg \
        -F f1=@/Users/marcopeg/Downloads/file.jpg

And then try to retrieve it by surfing to:

    http://localhost:8080/public/f1/image.jpg

---

## Safe Start

This will create a secured instance that persists data in your local folder

    docker run \
      -p 8080:8080 \
      -v ${PWD}/stuffer-data:/var/lib/stuffer \
      -e JWT_SECRET=12345 \
      -e AUTH_ENABLE_ANONYMOUS_UPLOAD=false \
      -e AUTH_ENABLE_ANONYMOUS_DOWNLOAD=false \
      marcopeg/stuffer

Your data will be persisted to a local folder name `stuffer-data`. You should be
able to locate it in the path from where you launched the Stuffer container.

In order to make requests to this instance you will need to authenticate yourself
using a [JWT](./book/authentication.md). I made one that will last for a couple of
decades...

    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzcGFjZSI6InRlc3QiLCJleHAiOjk2MTYyMzkwMjIsImlhdCI6MTUxNjIzOTAyMn0.-x6wWxlq4eK6-My_UvIp-1G2njUeEFw5kaH0fBegXO8

Try to post a file to `http://localhost:8080/upload`:

    curl -X POST http://localhost:8080/upload \
        -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzcGFjZSI6InRlc3QiLCJleHAiOjk2MTYyMzkwMjIsImlhdCI6MTUxNjIzOTAyMn0.-x6wWxlq4eK6-My_UvIp-1G2njUeEFw5kaH0fBegXO8' \
        -F f1_uuid=f1 \
        -F f1_name=image.jpg \
        -F f1=@/Users/marcopeg/Downloads/file.jpg

And then try to retrieve it by surfing to:

    http://localhost:8080/test/f1/image.jpg?__auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzcGFjZSI6InRlc3QiLCJleHAiOjk2MTYyMzkwMjIsImlhdCI6MTUxNjIzOTAyMn0.-x6wWxlq4eK6-My_UvIp-1G2njUeEFw5kaH0fBegXO8
    
---

## Core Functionalities

* [Upload to Stuffer](./book/upload.md)
* [Download from Stuffer](./book/download.md)
* [Modifiers](./book/modifiers.md)
* [Authentication](./book/authentication.md)
* [Configuration](./book/configuration.md)
* [Extensions](./book/extensions.md)

## Core Extensions

* [Cache](./book/core-extensions/cache.md)
* [StoreS3](./book/core-extensions/store-s3.md)
