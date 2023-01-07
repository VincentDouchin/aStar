<template>
  <div style="display:grid;gap:0.5rem;place-items: center;">
    <div style="display:flex;gap:0.5rem;justify-content:center">
      <div>
        <span>X</span><input type="number" name="x" v-model="x" style="width:50px">
      </div>
      <div>
        <span>Y</span> <input type="number" name="y" v-model="y" style="width:50px">
      </div>
    </div>
    <select v-model="algo" style="width:fit-content">
      <option v-for="[val, name] of Object.entries(algos)" :value="val">{{ name }}</option>
    </select>
    <div style="display:flex;gap:0.5rem;justify-content: center;">
      <button @click="setStart = !setStart">Set Start</button>
      <button @click="setEnd = !setEnd">Set End</button>
      <button @click="walls = []">Reset Walls</button>
    </div>

    <div style="width: fit-content; margin: auto;">
      <div v-for="line, y  in matrix" class="line">
        <div v-for="node, x of line" @click="setNode({x,y}) "
          :class="{ node: true, full: isWall({ x, y }), start: isNode(start)({ x, y }), end: isNode(end)({ x, y }), path: isPath({ x, y }) }">
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import { aStar, StarNode } from './astar'
import { reactive, computed, ref, watchEffect, watch } from 'vue';

interface node {
  x: number
  y: number
}
const isNode = (node: node) => (otherNode: node) => node.x == otherNode.x && node.y == otherNode.y
const isNodeInArray = (array: node[]) => (node: node) => array.some(arrNode => arrNode.x == node.x && arrNode.y == node.y)
const useStorage = (key: string, val: any) => {
  const existingVal = localStorage.getItem(key)
  const storedVal = ref(existingVal ? JSON.parse(existingVal) : val)
  watch(
    storedVal,
    () => localStorage.setItem(key, JSON.stringify(storedVal.value))
  )
  return storedVal
}
const algo = ref('manhattan')
const algos = ref({
  manhattan: 'Manhattan',
  randomisedManhattan: 'Random Manhattan'
})
const walls = useStorage('walls', [] as node[])
const isWall = (node: node) => isNodeInArray(walls.value)(node)
const setStart = ref(false)
const setEnd = ref(false)

const x = useStorage('x', 8)
const y = useStorage('y', 5)

const matrix = computed(() => new Array(x.value).fill(new Array(y.value).fill(0)).map((line, y) => line.map((node, x) => isWall({ x, y }) ? 1 : 0)))
const start = useStorage('start', { x: 2, y: 0 })
const end = useStorage('end', { x: 2, y: 7 })

const path = computed(() => new aStar(start.value, end.value, matrix.value)[algo.value]())

const isPath = (node: node) => isNodeInArray(path.value)(node)
const setNode = ({ x, y }: node) => {
  if (setStart.value) {
    start.value = { x, y }
    setStart.value = false
    return
  }
  if (setEnd.value) {
    end.value = { x, y }
    setEnd.value = false
    return
  }

  walls.value = isWall({ x, y }) ? walls.value.filter(wall => !isNode(wall)({ x, y })) : [...walls.value, { x, y }]
}
</script>


<style scoped>
.node {
  width: 1em;
  height: 1em;
  border: solid 1px black;
  background: white;
  position: relative;
}

.node:hover:after {
  content: "";
  position: absolute;
  inset: 0;
  background-color: lightgray;
  opacity: 0.5;
}

.line {
  display: flex;
}

.path {
  background: blue;
}

.start {
  background: #33CC33;
}

.end {
  background: red;
}

.full {
  background: black;
}
</style>
