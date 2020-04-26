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

async function handleBlocks(sessionData: any, dbSessionId: string) {
    for (let blockData of sessionData.blocks) {

        let block = new Block({
            "name": blockData.name,
            "exercises" : [],
            "session": dbSessionId
        });

        block.save()
        .then(dbBlock => {
            if (null != blockData.exercises) {
                handleExercises(dbBlock.id, blockData.exercises);
            }
        })
        .catch((err: any) => {
            console.error("Error saving Block.", err);
        });
    }
}

async function handleGroups(sessionData: any, dbSessionId: string) {

    for(let groupData of sessionData.groups) {
        let group = new Group({
            "repeat": groupData.repeat,
            "blocks": [],
            "session": dbSessionId
        });

        group.save()
        .then(dbGroup => {
            for (let blockName of groupData.blocks) {
                Block.findOne({ name: blockName, session: dbSessionId }).exec( (err, dbBlock) => {
                    if (null != dbBlock) {
                        dbGroup.updateOne({ $push: { 'blocks': dbBlock.id }})
                        .catch( err => console.error("Group update failed.", err));
                    } else {
                        console.log("Cannot find " + blockName + " for session " + sessionData.name);
                    }
                });
            }
        })
        .catch(err => { console.error("Error saving group.", err)});
    }
}

async function samples() {
    console.log("Create sample data");


    /* Clear database */
    await Session.deleteMany({}, () => { console.log("Sessions cleared")});
    await Group.deleteMany({}, () => { console.log("Groups cleared")});
    await Block.deleteMany({}, () => { console.log("Blocks cleared")});
    await Exercise.deleteMany({}, () => { console.log("Exercises cleared")});

    /* Read sessions from json */
    for (let sessionData of data.sessions) {
        let session = new Session({
            "name": sessionData.name,
        });

        session.save()
        .then(dbSession => {

            /* Use async/await : see https://blog.engineering.publicissapient.fr/2017/11/14/asyncawait-une-meilleure-facon-de-faire-de-lasynchronisme-en-javascript/ */

            if (null != sessionData.blocks) {
                handleBlocks(sessionData, dbSession.id);
            }
            if (null != sessionData.groups) {
                handleGroups(sessionData, dbSession.id);
            }
        })
        .catch(err => {
            console.error("Error saving session.", err);
        });
    }
}

export default samples;
