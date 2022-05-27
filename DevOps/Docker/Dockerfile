ARG BUILD_IMAGE_TAG
ARG RUN_IMAGE_TAG
FROM hseeberger/scala-sbt:${BUILD_IMAGE_TAG} as build

RUN mkdir -p /opt/app/.aws/

WORKDIR /opt/app

# init system/process is needed to a) reap zombie processes b) signals forwarding to app
# Docker now natively supports init system via docker run --init
# However, k8s doesn't have an equivalent and hence we need to install tini as a supplement
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /usr/local/bin/tini
RUN chmod +x /usr/local/bin/tini

COPY docker-entrypoint.sh ./docker-entrypoint.sh

FROM openjdk:${RUN_IMAGE_TAG}-slim as bake

ARG AWS_CLI_VERSION=2.7.2

RUN apt update && \
    apt install --yes --no-install-recommends \
      curl \
      unzip && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-${AWS_CLI_VERSION}.zip" --output "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm awscliv2.zip && \
    apt remove --yes \
      curl \
      unzip && \
    apt --yes autoremove && \
    rm -rf /var/lib/apt/lists/* && \
    aws --version

ENV APP_DIRECTORY=/opt/app

WORKDIR /opt/app

ENV DEPLOY_TARGET=${DEPLOY_TARGET}

RUN useradd --user-group --system --home-dir /opt/app --shell /bin/bash app

# don't use chown cmd which might not work.
COPY --chown=app:app --from=build /opt/app/docker-entrypoint.sh ./docker-entrypoint.sh
# if chown not set, ownership defaults to current user - root in this case
COPY --from=build /usr/local/bin/tini /usr/local/bin/tini
COPY --chown=app:app --from=build "${APP_DIRECTORY}"/target/xxx.jar .
COPY --chown=app:app --from=build /opt/app/.aws ./.aws

USER app

ENTRYPOINT ["tini",  "--", "./docker-entrypoint.sh"]
CMD ["java", "-jar", "xxx.jar"]
