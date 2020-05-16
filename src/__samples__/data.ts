import Block from "./../models/block";
import Exercise from "./../models/exercise";
import Group from "./../models/group";
import Session from "./../models/session";
import data from './wodz.json';

/*
 * Handle exercise :
 * Save exercise in database.
 * Returns Promise with saved object if successful.
 */
async function handleExercise(exerciseData: any) {
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

/*
 * Handle exercises :
 * Iterate through exercises and save it in database.
 * Returns Promise with saved exercises in array if successful.
 */
async function handleExercises(blockId: String, exercises: any) {

    let results: any[] = new Array<any>();
    let errors: any[] = new Array<any>();

    return new Promise(async (resolve, reject) => {
        for (let exerciseData of exercises) {
            await handleExercise(exerciseData).then((ex: any) => {
                console.log("Successfuly register exercise : " + ex.id);
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

        if (errors.length == 0) {
            resolve(results);
        } else {
            reject(errors);
        }
    });
}

/*
 * Handle block.
 * Save block in database.
 * Returns Promise with saved object if successful.
 */
function handleBlock(blockData: any) {
    return new Promise((resolve, reject) => {
        let block = new Block({
            "name": blockData.name,
            "exercises" : []
        });

        let res = block.save().then((databaseBlock: any) => {
            resolve(databaseBlock);
        })
        .catch((err: any) => {
            reject(err);
        });
    });
}

/*
 * Handle blocks.
 * Iterate through blocks and save it in database.
 * Returns Promise with saved blocks in array if successful.
 */
function handleBlocks(sessionData: any, dbSessionId: string) {
    let results: any[] = new Array<any>();
    let errors: any[] = new Array<any>();

    return new Promise(async (resolve, reject) => {
        for (let blockData of sessionData.blocks) {
            await handleBlock(blockData).then((databaseBlock: any) => {
                if (null != blockData.exercises) {
                    handleExercises(databaseBlock.id, blockData.exercises)
                        .then((res: any) => {
                            console.log("Successfuly register block " + databaseBlock.name + " with " + res.length + " exercises.");
                        });
                }
                results.push(databaseBlock);
            }).catch(err => {
                console.error("Error saving Block.", err);
                errors.push(err);
            });
        }

        if (errors.length == 0) {
            resolve(results);
        } else {
            reject(errors);
        }
    });
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

    /* Clear database sequentially */
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
                    //handleGroups(sessionData, dbSession.id);
                    //console.log(groups);
                }
            })
            .catch(err => {
                console.error("Error saving session.", err);
            });
    }
}

export default samples;
