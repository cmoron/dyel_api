import Block from "./../models/block";
import Exercise from "./../models/exercise";
import Group from "./../models/group";
import Session from "./../models/session";
import data from './wodz.json';

async function handleExercises(blockId: String, exercises: any) {
    for (let exerciseData of exercises) {
        let exercise = new Exercise({
            "name": exerciseData.name,
            "repeat": exerciseData.repeat
        });

        let id = exercise.save().then(ex => {
            //console.log(ex._id);
            Block.findByIdAndUpdate(blockId, { $push: {'exercises': ex._id}})
            .catch((err: any) => {
                console.error("Error adding exercises to block.", err);
            });
        })
        .catch((err: any) => {
            console.error("Error saving Exercise.", err);
        });
    }
}

async function handleBlocks(blocks: any) {
    for (let blockData of blocks) {

        let block = new Block({
            "name": blockData.name,
            "exercises" : []
        });

        block.save()
            .then(b => {
                if (null != blockData.exercises) {
                    handleExercises(b._id, blockData.exercises);
                }
            })
            .catch((err: any) => {
                console.error("Error saving Block.", err);
            });
    }
}

const samples = async function() {
    console.log("Create sample data");

    /* Clear database */
    await Exercise.deleteMany({}, () => { console.log("Exercises  cleared")});
    await Block.deleteMany({}, () => { console.log("Blocks  cleared")});

    /* Read sessions from json */
    for (let sessionData of data.sessions) {
        //console.log(sessionData);

        if (null != sessionData.blocks) {
            handleBlocks(sessionData.blocks);
        }

        //if (null != sessionData.groups) {
        //for (let group of sessionData.groups) {
        //console.log(group);
        //}
        //}

        let session = new Session({
            "name": sessionData.name,
            "groups": []
        });

        session.save();
    }

    //await Exercise.find((err: any, exercises: any) => {
        //console.log(exercises);
        //if (err) console.error(err);
        //else {
            //for (let ex of exercises) {
                //console.log(ex);
            //}
        //}
    //});

}

export default samples;
