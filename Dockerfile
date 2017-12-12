FROM centos:7
MAINTAINER Karl Stoney <me@karlstoney.com>

RUN groupadd ideaboard && \
    useradd -g ideaboard ideaboard

# Get nodejs repos
RUN curl --silent --location https://rpm.nodesource.com/setup_7.x | bash -

RUN yum -y -q update && \
    yum -y -q remove iputils && \
    yum -y -q install wget epel-release openssl openssl-devel tar unzip \
							libffi-devel python-devel redhat-rpm-config git-core \
							gcc gcc-c++ make zlib-devel pcre-devel ca-certificates \
              ruby rubygemsi nodejs && \
    yum -y -q clean all

# Install ideaboard
RUN mkdir -p /app
WORKDIR /app
EXPOSE 9000
CMD ["npm", "run", "start"]

COPY package.json /app

RUN cd /app && \
    npm install --quiet

COPY ./ /app

RUN chown ideaboard:ideaboard /app

RUN npm run assets
RUN find . -type d \( -path ./node_modules \) -prune -o -exec chown ideaboard:ideaboard {} \;
USER ideaboard
