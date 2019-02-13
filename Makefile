
#
# Releases the production images to DockerHUB
#
release:
	(cd services/barn && make release)
	(cd services/reaper && make release)
	(cd services/proxy && make release)

#
# If you are about to go for a coffee run this command, it will force
# a full rebuild of the Docker images that are needed to run this project
#
prebuild:
	HUMBLE_ENV=dev humble pull
	HUMBLE_ENV=dev humble build --no-cache barn
	HUMBLE_ENV=dev humble build --no-cache app
	HUMBLE_ENV=dev humble build --no-cache build
	HUMBLE_ENV=dev humble build --no-cache reaper
	HUMBLE_ENV=prod humble build --no-cache reaper
	HUMBLE_ENV=prod humble build --no-cache barn

db:
	HUMBLE_ENV=dev humble up -d postgres



#
# Api App
#

barn: db
	HUMBLE_ENV=dev humble build barn
	HUMBLE_ENV=dev humble up -d barn
	HUMBLE_ENV=dev humble logs -f barn

unbarn:
	HUMBLE_ENV=dev humble stop barn
	HUMBLE_ENV=dev humble rm -f barn

#
# Client App
#

app: db
	HUMBLE_ENV=dev humble build app
	HUMBLE_ENV=dev humble up -d app
	HUMBLE_ENV=dev humble logs -f app

unapp:
	HUMBLE_ENV=dev humble stop app
	HUMBLE_ENV=dev humble rm -f app

build:
	HUMBLE_ENV=dev humble build build
	HUMBLE_ENV=dev humble up build

#
# Daemon App
#

reaper:
	HUMBLE_ENV=dev humble build reaper
	HUMBLE_ENV=dev humble up -d reaper
	HUMBLE_ENV=dev humble logs -f reaper

unreaper:
	HUMBLE_ENV=dev humble stop reaper
	HUMBLE_ENV=dev humble rm -f reaper

#
# Grafana App
#

grafana:
	HUMBLE_ENV=dev humble up -d grafana
	HUMBLE_ENV=dev humble logs -f grafana

ungrafana:
	HUMBLE_ENV=dev humble stop grafana
	HUMBLE_ENV=dev humble rm -f grafana



proxy:
	HUMBLE_ENV=dev humble build barn
	HUMBLE_ENV=dev humble build proxy
	HUMBLE_ENV=dev humble up -d proxy
	HUMBLE_ENV=dev humble logs -f proxy

unproxy:
	HUMBLE_ENV=dev humble stop proxy
	HUMBLE_ENV=dev humble rm -f proxy




#
# Development Commands
#

dev: db
	HUMBLE_ENV=dev humble build barn
	HUMBLE_ENV=dev humble build reaper
	HUMBLE_ENV=dev humble up -d barn
	HUMBLE_ENV=dev humble up -d reaper
	HUMBLE_ENV=dev humble up -d grafana
	HUMBLE_ENV=dev humble up -d proxy
	HUMBLE_ENV=dev humble logs -f barn reaper proxy

undev:
	HUMBLE_ENV=dev humble down


#
# Production Commands
#

build-prod:
	HUMBLE_ENV=prod humble build --no-cache

prod:
	HUMBLE_ENV=prod humble build
	HUMBLE_ENV=prod humble up -d
	HUMBLE_ENV=prod humble logs -f

unprod:
	HUMBLE_ENV=prod humble down

