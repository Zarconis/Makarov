# Makarov

## Intoduction
Correlation Engine on top of graph

## Table of contents
 - [Graph Database Abstraction](#Graph-Database-Abstraction)
 - [Flavours](#Flavours)
 - [Features](#Features)

## Graph Database Abstraction
Makarov runs on top of graph database and provide abstractions to the graph in [Gremlin](http://arxiv.org/abs/1508.03843) interface. On top of it the plans are to:

 - Implement a correlation engine to provide insights on top of this data.
 - Make this engine extensible
 - Learning based model?

Planning to use following tools:
 - [Azure Cosmos DB - Graph](https://docs.microsoft.com/en-us/azure/cosmos-db/graph-introduction) - It has inbuilt support for:
    - [Gremlin](http://tinkerpop.apache.org/docs/current/reference/#graph-traversal-steps) interface for querying
    - [Apache TinkerPop](http://tinkerpop.apache.org/) Graph Engine

## Flavours
Flavours are complex queries that can be run against various datasources to enrich data at hand to perform correlation tasks. The primary goal of Makarov is to add support for generic and custom flavours to build an extensible correlation engine on top of knowledge bases.

### Architecture
To be added

## Features
 - [ ] Abstraction on top of Azure Cosmos Graph DB
    - [x] Add Entities & Relationships
    - [ ] Fetch Entities & Relationships
 - [ ] Support for flavours
    - [ ] Definition of flavours

