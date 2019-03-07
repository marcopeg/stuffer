# Download from Stuffer

When you [upload a file to Stuffer](./upload.md), you will receive the public url
to the newly created resource:

    {
        "files": [
            {
                ...
                "url": {
                    "resource": "http://localhost:8080/public/f2",
                    "original": "http://localhost:8080/public/f2/image.jpg"
                },
                ...
            }
        ],
        "errors": [...]
    }

You can simply copy/paste this url to a browser to get a copy of your resource.

