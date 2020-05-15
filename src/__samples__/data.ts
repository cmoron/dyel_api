import Block from "./../models/block";
import Exercise from "./../models/exercise";
import Group from "./../models/group";
import Session from "./../models/session";
import data from './wodz.json';

/*
** Handle exercise :
** Save exercise in database.
*/
function handleExercise(exerciseData: any) {
    return new Promise((resolve, reject) => {
        let exercise = new Exercise({
            "name": exerciseData.name,
            "repeat": exerciseData.repeat
        });

        exercise.save().then((ex: any) => {
            resolve(ex);
        })
        .catch((err: any) => {
            reject(err);
        });
    });
}

function handleExercises(blockId: String, exercises: any) {

    let results: any[] = new Array<any>();
    let errors: any[] = new Array<any>();

    for (let exerciseData of exercises) {
        handleExercise(exerciseData).then((ex: any) => {
            console.log("Successfuly register exercise : " + ex.id);
            console.log(results);
            results.push(ex);

            Block.findByIdAndUpdate(blockId, { $push: {'exercises': ex.id}})
            .catch((err: any) => {
                console.error("Error adding exercises to block.", err);
                errors.push(err);
            });
        })
        .catch((err: any) => {
            console.log("Error registering exercise: " + err);
            errors.push(err);
        });
    }

    return new Promise((resolve, reject) => {
        if (errors.length == 0) {
            resolve(results);
        } else {
            reject(errors);
        }
    });
}

function handleBlocks(sessionData: any, dbSessionId: string) {
    for (let blockData of sessionData.blocks) {

        let block = new Block({
            "name": blockData.name,
            "exercises" : [],
        });

        let res = block.save()
        .then(dbBlock => {
            console.log("Successfuly register block: " + dbBlock.id + " with name: " + blockData.name);
            if (null != blockData.exercises) {
                handleExercises(dbBlock.id, blockData.exercises)
                .then((res: any) => {
                    console.log("Successfuly register blocks exercises.");
                });
            }
        })
        .catch((err: any) => {
            console.error("Error saving Block.", err);
        });
    }
}

function handleGroups(sessionData: any, dbSessionId: string) {
    for(let groupData of sessionData.groups) {
        let group = new Group({
            "repeat": groupData.repeat,
            "blocks": [],
            "session": dbSessionId
        });

        let res = group.save()
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

            if (null != sessionData.blocks && null != sessionData.groups) {
                handleBlocks(sessionData, dbSession.id);
                //console.log(blocks);
                handleGroups(sessionData, dbSession.id);
                //console.log(groups);
            }
        })
        .catch(err => {
            console.error("Error saving session.", err);
        });
    }
}

export default samples;
