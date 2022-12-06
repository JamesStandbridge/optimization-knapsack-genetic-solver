export const bitOperations = {
	int2bin: (int, size) => (int >>> 0).toString(2).padStart(size, "0"),
	generateBit: (size) => Math.floor(Math.random() * (2**size)),
	crossoverBits: (parentA, parentB) => {
		const p = 0.25
		
		const mask1 = ((0xffff >> 16*p) << 16*p)
		const mask2 = 0xffff ^ mask1
		
		return [(parentA & mask1) ^ (parentB & mask2), (parentA & mask2) ^ (parentB & mask1)]
	},
	getRandomInt: (min, max) => {
		min = Math.ceil(min)
		max = Math.floor(max)
		return Math.floor(Math.random() * (max - min + 1)) + min
	},
	mutateBits: (x, size) => {
		const mutateMask = 1 << bitOperations.getRandomInt(1, size)
		return x & ~mutateMask
	}
}
