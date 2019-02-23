# Configuration

Most of the Stuffer's features can be fine tuned via environment variables.
Here is a comprehensive list of what you can define.

### LOG_LEVEL

Regulates the amount of logging that Stuffer generates: 

    LOG_LEVEL=error

Possible values: error|info|verbose|debug

### STUFFER_DATA

Defines a writeable disk location where Stuffer will store its data.

    STUFFER_DATA=/var/lib/stuffer

### STUFFER_CORE_EXTENSIONS

    STUFFER_CORE_EXTENSIONS=---

### JWT_SECRET

Secret used to validate JWTs

    JWT_SECRET=stuffer

### UPLOAD_MOUNT_POINT

    UPLOAD_MOUNT_POINT=/upload

### UPLOAD_PUBLIC_SPACE

    UPLOAD_PUBLIC_SPACE=public
    
### UPLOAD_BUFFER_SIZE

In bits

    UPLOAD_BUFFER_SIZE=2097152
    (2Mbit)

### UPLOAD_MAX_SIZE

In bytes

    UPLOAD_MAX_SIZE=1048576000
    (1Gb)

### UPLOAD_MAX_FILE_SIZE

In bytes

    UPLOAD_MAX_FILE_SIZE=1048576000
    (1Gb)

### UPLOAD_MAX_FIELD_SIZE

In bytes

    UPLOAD_MAX_FIELD_SIZE=5120

### UPLOAD_MAX_FILES

    UPLOAD_MAX_FILES=10

### UPLOAD_MAX_FIELDS

    UPLOAD_MAX_FIELDS=30

### DOWNLOAD_BASE_URL

    DOWNLOAD_BASE_URL=http://localhost:8080

### DOWNLOAD_MOUNT_POINT

    DOWNLOAD_MOUNT_POINT=/

### AUTH_ENABLE_ANONYMOUS_UPLOAD

    AUTH_ENABLE_ANONYMOUS_UPLOAD=true

### AUTH_ENABLE_ANONYMOUS_DOWNLOAD

    AUTH_ENABLE_ANONYMOUS_DOWNLOAD=true

### AUTH_ENABLE_CROSS_SPACE_DOWNLOAD

    AUTH_ENABLE_CROSS_SPACE_DOWNLOAD=false

### STUFFER_COMMUNITY_EXTENSIONS

    STUFFER_COMMUNITY_EXTENSIONS=/var/lib/stuffer/extensions
