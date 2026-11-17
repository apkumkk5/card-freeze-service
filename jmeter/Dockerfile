FROM eclipse-temurin:21-jre
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/* \
 && curl -fsSL https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-5.6.3.tgz | tar -xz -C /opt
ENV PATH="/opt/apache-jmeter-5.6.3/bin:${PATH}"
WORKDIR /tests
ENTRYPOINT ["jmeter"]