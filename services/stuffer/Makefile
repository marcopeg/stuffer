#
# Simple interface to run Docker!
#


# Running container's name
organization?=marcopeg
name?=stuffer
version:= $(shell node -p "require('../../package.json').version")

# Docker image tag name
tag?=${organization}/${name}

# Mish
port?=8080
loglevel?=info
jwts?=stuffer
ext?=cache
url?=https://marcopeg.ngrok.io

# Build the project using cache
image:
	docker build -t ${tag} -t ${tag}:${version} .
	
# Spins up a container from the latest available image
# this is useful to test locally
run:
	docker run \
		--rm \
		--name ${name} \
		-p ${port}:8080 \
		-e LOG_LEVEL=${loglevel} \
		-e JWT_SECRET=${jwts} \
		-e STUFFER_CORE_EXTENSIONS=${ext} \
		-e DOWNLOAD_BASE_URL=${url} \
		${tag}

stop:
	docker stop ${name}

remove:
	docker rm ${name}

# Like start, but in background
# classic way to launch it on a server
boot:
	docker run \
		-d \
		--name ${name} \
		-p 8080:8080 \
		${name}

down: stop remove

# Gain access to a running container
ssh:
	docker exec \
		-it \
		${name} \
		/bin/sh

publish:
	docker tag ${tag}:${version} ${tag}:${version}
	docker tag ${tag}:${version} ${tag}:latest
	docker push ${tag}:${version}
	docker push ${tag}:latest

release: image publish
