# Cache Extensions

After a file gets through a list of modifiers, the result is persisted to the local
disk with the purpose to speed up the next request to the same resource.

If the service reboots, a new in-memory cache is rebuilt from the informations of
the existing cache files. Files that became to old according to `CACHE_MAX_AGE` will
be deleted during this operation.

## Configuration

It is possible to customize the cache by setting some environmental variables:

#### CACHE_MAX_SIZE

Provide a limit for the amount (in Megabytes) of data that gets stored into the disk.

When the limit is reached, the files that got accessed the least will be removed,
starting from the oldest one. 

#### CACHE_MAX_AGE

Provide a max duration (in Seconds) of a cache file.

If the file gets older, it will be deleted.

#### CACHE_PRUNE_INTERVAL

Set the interval (in Seconds) for the cache to walk through the oldest files and delete them
as regulated by `CACHE_MAX_AGE`.
