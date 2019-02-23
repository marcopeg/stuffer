# Store S3 Extension

Moves the resources to an S3 bucket and keeps a local copy for the most accessed
resources.

#### S3 Authentication

    STORE_S3_KEY=xxx
    STORE_S3_SECRET=xxx
    STORE_S3_BUCKET=xxx
    STORE_S3_REGION=eu-west-1

#### STORE_S3_MAX_SIZE

Provide a limit for the amount (in Megabytes) of data that gets stored into the disk.

When the limit is reached, the files that got accessed the least will be removed,
starting from the oldest one. 

#### STORE_S3_MAX_AGE

Provide a max duration (in Seconds) of a cache file.

If the file gets older, it will be deleted.

#### STORE_S3_PRUNE_INTERVAL

Set the interval (in Seconds) for the cache to walk through the oldest files and delete them
as regulated by `CACHE_MAX_AGE`.

## Sync Strategy

Both files and meta informations are uploaded to S3 as soon they are
available, but the meta informations are left intact in the local storage and are
necessary to validate the existance of a specific resource.

We have plans to introduce a way to automatically restore a local database from a
remote one, the intention is to be able to run multiple Stuffer nodes that get
eventually in sync with a reduced latency, but without the need to introduce new
components to the stack to handle real-time communications.
