class StarNode {
	x: number
	y: number
	g: number = 0
	h: number = 0
	parent?: StarNode
	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}
	get f() {
		return this.g + this.h
	}
}

class aStar {
	openList: StarNode[] = []
	closedList: StarNode[] = []
	nodeGrid: (StarNode | undefined)[][]
	start: StarNode
	end: StarNode
	constructor(start: StarNode | { x: number, y: number }, end: StarNode | { x: number, y: number }, grid: number[][]) {

		this.nodeGrid = grid.map((line, y) => line.map((wall, x) => wall ? undefined : new StarNode(x, y)))
		this.start = start instanceof StarNode ? start : new StarNode(start.x, start.y)
		this.end = end instanceof StarNode ? end : new StarNode(end.x, end.y)
		this.openList.push(this.start)
	}
	getNeighbors(node: StarNode): StarNode[] {
		const neighbors: StarNode[] = [];
		const x = node.x;
		const y = node.y;

		// Check the top, right, bottom, and left neighbors
		if (this.nodeGrid[y - 1]?.[x]) {
			neighbors.push(this.nodeGrid[y - 1][x]!);
		}
		if (this.nodeGrid[y]?.[x + 1]) {
			neighbors.push(this.nodeGrid[y][x + 1]!);
		}
		if (this.nodeGrid[y + 1]?.[x]) {
			neighbors.push(this.nodeGrid[y + 1][x]!);
		}
		if (this.nodeGrid[y]?.[x - 1]) {
			neighbors.push(this.nodeGrid[y][x - 1]!);
		}

		return neighbors;
	}
	findPath(evalutateDistance: (node: StarNode) => number) {
		while (this.openList.length > 0) {

			let lowestIndex = 0;
			for (let i = 0; i < this.openList.length; i++) {
				if (this.openList[i].f < this.openList[lowestIndex].f) {
					lowestIndex = i;
				}
			}
			const currentNode = this.openList[lowestIndex]

			if (currentNode.x === this.end.x && currentNode.y == this.end.y) {
				const path: StarNode[] = []
				let current: StarNode | undefined = currentNode
				while (current) {
					path.push(current)
					current = current.parent
				}
				return path.reverse()
			}

			// Move the current node to the closed list and remove it from the open list
			this.openList.splice(lowestIndex, 1)
			this.closedList.push(currentNode)

			// Get the neighbors of the current node
			const neighbors = this.getNeighbors(currentNode)
			for (const neighbor of neighbors) {
				if (this.closedList.includes(neighbor)) {
					continue
				}

				const gScore = currentNode.g + 1
				const hScore = evalutateDistance(neighbor)
				if (!this.openList.includes(neighbor)) {
					this.openList.push(neighbor)
					neighbor.parent = currentNode
					neighbor.g = gScore
					neighbor.h = hScore
				} else if (gScore < neighbor.g) {
					neighbor.g = gScore
					neighbor.parent = currentNode
				}
			}
		}

		return [];

	}
	manhattan() {
		return this.findPath((node: StarNode) => Math.abs(this.end.x - node.x) + Math.abs(this.end.y - node.y))
	}
	randomisedManhattan() {
		return this.findPath((node: StarNode) => ((Math.abs(this.end.x - node.x) + Math.abs(this.end.y - node.y)) * Math.random()))
	}
}
export { StarNode, aStar }