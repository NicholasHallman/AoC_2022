import {World} from 'quecs/dist/index.js';
import fs from 'fs';
import { Types } from 'quecs/dist/types.js';

const world = new World();

const data = fs.readFileSync('./inputs/day1.txt', 'utf8');

const elvesFood = data.split("\n\n");

const Calories = world.defineComponent({
    values: [Types.ui16, 100],
    sum: Types.ui32
})

let i = 0;
while(i < elvesFood.length) {
    const {id: eid} = world.addEntity()
        .addComponent(Calories);

    elvesFood[i].split('\n').forEach((calories, j) => {
        if(j > 100) {console.log("too many food items!")}
        Calories.values[eid][j] = Number(calories);
    });
    i++;
}

const caloryQuery = world.defineQuery(Calories);

const sumCalories = world => {
    const eids = caloryQuery();
    for(const eid of eids) {
        let sum = 0;
        let i = 0;
        let value = Calories.values[eid][i];
        while(value !== 0) {
            sum += value;
            i++;
            value = Calories.values[eid][i];
        }
        Calories.sum[eid] = sum;
    }
    return world;
}

const findHighestEid = world => {
    const eids = [...caloryQuery()];
    let highest = [eids[0], Calories.sum[eids[0]]];
    for (const eid of eids) {
        if(highest[1] < Calories.sum[eid]) {
            highest[0] = eid;
            highest[1] = Calories.sum[eid];
        }
    }
    console.log(highest);
    return world;
}

world.createPhase('run')
    .addSystem(sumCalories)
    .addSystem(findHighestEid);

world.runPhase('run');