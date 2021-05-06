/**
 * Create and export environment variables
 */

const environments = {};

// Local (default) environment
environments.local = {
    port: 3131,
    env_name: "local",
    hashing_secret: "buPOqiis2k0jaxJXvsennrXPTMr8H6dalJNqguILPGkYaFHhbW",
    jwt_secret: "51IRzdnEaR0svykjLZmXtJ1l1SCbfeA71b35d7e"
};

// Production environment
environments.production = {
    port: 3232,
    env_name: "production",
    hashing_secret: "BncoGpC9mosMjJOKYN4IxBsrDTOlkOfTXIqrOvYeqb0KyQzlGH",
    jwt_secret: "51IRzdnEaR0svykjLZuTvGkBdn771b35d7e"
};

const current_environment =
    typeof process.env.NODE_ENV === "string"
        ? process.env.NODE_ENV.toLowerCase()
        : "";

const environment =
    typeof environments[current_environment] !== "undefined"
        ? environments[current_environment]
        : environments.local;

module.exports = environment;