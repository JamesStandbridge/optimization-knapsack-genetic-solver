import { createRequire } from "module"
import Population, { getSolutionMetrics } from "./src/population.js"

const require = createRequire(import.meta.url)
const config = require("./data/input.json")
const { performance } = require("perf_hooks")

const pop = new Population(100, 1000, config.maxWeight, config.items)

const startTime = performance.now()

pop.genesis()

while(!pop.nextGeneration()) {}

pop.evaluate()
pop.select()

const endTime = performance.now()

console.table(getSolutionMetrics(pop.chromosomes[0].solution, config.items))
console.log(`Execution time ${endTime - startTime} milliseconds`)