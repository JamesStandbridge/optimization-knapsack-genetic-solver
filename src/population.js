import { bitOperations } from "./bitOperations.js"

class Population {
	constructor(maxIterationWithSameResult, size, maxWeight, items) {
		this.items = items
		this.size = size
		this.maxWeight = maxWeight
		this.chromosomes = []
		this.currentSolutionIteration = 0
		this.currentSolution = null
		this.maxIterationWithSameResult = maxIterationWithSameResult
	}
	
	genesis() {
		this.chromosomes = []
		for(let i = 0; i < this.size; i++) 
			this.chromosomes.push({solution: bitOperations.generateBit(this.items.length), fitness: 0})
	}
	
	evaluate() {
		for(let i = 0; i < this.chromosomes.length; i++) {
			let weight = 0, value = 0
			const bin = bitOperations.int2bin(this.chromosomes[i].solution, this.items.length)
			for(let j = 0; j < bin.length; j++) {
				const qty = bin.charAt(j)
				weight += parseInt(qty) * this.items[j].weight
				value += parseInt(qty) * this.items[j].value
			}
			if(weight > this.maxWeight)
				value /= this.items.length
			this.chromosomes[i].fitness = Math.floor(value)
		}
	}
	
	select() {
		this.chromosomes = this.chromosomes.sort((a, b) => b.fitness - a.fitness)
	}
	
	crossover() {
		const newChromosomes = []
		const medianIndex = Math.floor(this.chromosomes.length * 0.3)
		
		while(newChromosomes.length < this.size) {
			const parentA = this.chromosomes[bitOperations.getRandomInt(0, medianIndex)].solution
			const parentB = this.chromosomes[bitOperations.getRandomInt(medianIndex, this.chromosomes.length - 1)].solution
			const childs = bitOperations.crossoverBits(parentA, parentB)
			
			newChromosomes.push({solution: childs[0], fitness: 0})
			newChromosomes.push({solution: childs[1], fitness: 0})
		}
		
		this.chromosomes = newChromosomes
	}
	
	mutate(chance) {
		for(let i = 0; i < this.chromosomes.length; i++) {
			if(Math.random() < chance)
				this.chromosomes[i].solution = bitOperations.mutateBits(this.chromosomes[i].solution, this.items.length)
		}
	}
	
	nextGeneration() {
		this.evaluate()
		this.select()
		
		if(this.currentSolution === this.chromosomes[0].solution) {
			this.currentSolutionIteration++
			if(this.currentSolutionIteration === this.maxIterationWithSameResult)
				return true
		} else {
			this.currentSolutionIteration = 0
			this.currentSolution = this.chromosomes[0].solution
			this.crossover()
			this.mutate(0.1)
			return false
		}
	}
}

export const getSolutionMetrics = (sol, items) => {
	const bin = bitOperations.int2bin(sol, items.length)
	let weight = 0, value = 0, objects = []
	
	for(let j = 0; j < bin.length; j++) {
		const qty = bin.charAt(j)
		weight += parseInt(qty) * items[j].weight
		value += parseInt(qty) * items[j].value
		if(qty > 0)
			objects.push(items[j].name)
	}
	return { weight, value, objects: objects.join("-") }
}

export default Population