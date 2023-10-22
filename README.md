# Kamu x Lilypad
Verifiable and Reproducable database amalgamation is critical to the enablement of decentralized AI/ML pipelines.  We need a system that can provide the streaming of a variety of a databases together and provide version control.  [Kamu.dev](https://www.kamu.dev/) is within the decentralized science ecosystem that provides such functionality through p2p sql streaming.  By packaging Kamu as an edge compute job through lilypad we can conduct SQL streaming over edge compute networks, we can produce kamu manifests that declare from where to pull data, and how to marshal it into well structured data that can be consumed by LLM models.  It provides streaming capability so every time the job is called it will get the latest data from all sources, creating an environment where fine tuning of a model can happen in real time.  In the future, if lilypad supports Bacalhau's new Daemon job, this can stream together dbs in real time, providing near real time data aggregation for AI/ML compute pipelines.

## Lilypad job spec
https://github.com/polus-arcticus/lilypad-module-kamu

## Build locally
`docker compose up`
