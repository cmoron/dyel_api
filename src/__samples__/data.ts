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
        }).catch((err: any) => {
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
                results.push(ex);

                Block.findByIdAndUpdate(blockId, { $push: {'exercises': ex.id}}).catch((err: any) => {
                    console.error("Error adding exercises to block.", err);
                    errors.push(err);
                });
            }).catch((err: any) => {
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
function handleBlock(blockData: any, dbSessionId: string) {
    return new Promise((resolve, reject) => {
        let block = new Block({
            "name": blockData.name,
            "session" : dbSessionId,
            "exercises" : []
        });

        let res = block.save().then((databaseBlock: any) => {
            resolve(databaseBlock);
        })
        .catch((err: any) => {
            console.log("Error saving block. " + res);
            reject(err);
        });
    });
}

/*
 * Handle blocks.
 * Iterate through blocks and save it in database.
 * Returns Promise with saved blocks in array if successful.
 */
async function handleBlocks(sessionData: any, dbSessionId: string) {
    let results: any[] = new Array<any>();
    let errors: any[] = new Array<any>();

    return new Promise(async (resolve, reject) => {
        for (let blockData of sessionData.blocks) {
            await handleBlock(blockData, dbSessionId).then((databaseBlock: any) => {
                if (null != blockData.exercises) {
                    handleExercises(databaseBlock.id, blockData.exercises);
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
            reject("Error saving blocks.");
        }
    });
}

/*
 * Handle group.
 * Save group in database.
 * Returns Promise with saved object if successful.
 */
async function handleGroup(groupData: any) {

    return new Promise((resolve, reject) => {
        let group = new Group({
            "order": groupData.order,
            "repeat": groupData.repeat,
            "blocks" : []
        });

        let res = group.save().then((databaseGroup: any) => {
            resolve(databaseGroup);
        })
        .catch((err: any) => {
            console.log("Error saving group: " + err);
            reject(err);
        });
    });
}

/*
 * Update group with Block name.
 * Add the block to the group in database.
 */
function updateGroupWithBlock(databaseGroup: any, blockName: string, dbSessionId: string) {
    Block.findOne({ name: blockName, session: dbSessionId }).exec( (err, dbBlock) => {
        if (null != dbBlock) {
            databaseGroup.updateOne({ $push: { 'blocks': dbBlock.id }})
                .catch((err: any) => console.error("Group update failed.", err));
        } else {
            console.log("Cannot find " + blockName + " for session " + dbSessionId);
        }
    });
}

/*
 * Update session with group id.
 * Add the group id to the session object in database.
 */
function updateSessionWithGroup(dbSessionId: string, dbGroupId: string) {
    Session.findById(dbSessionId).then(session => {
        if (session) {
            session.updateOne({ $push: { 'groups': dbGroupId }})
                .catch((err: any) => console.error("Session update failed.", err));
        } else {
            console.log("Cannot find sessions with id : " + dbSessionId);
        }
    });
}
/*
 * Handle groups.
 * Iterate through groups and save it in database.
 * Returns Promise with saved groups in array if successful.
 */
async function handleGroups(sessionData: any, dbSessionId: string) {
    let results: any[] = new Array<any>();
    let errors: any[] = new Array<any>();

    return new Promise(async (resolve, reject) => {
        for(let groupData of sessionData.groups) {
            await handleGroup(groupData).then((databaseGroup: any) => {

                /* Add group to session */
                updateSessionWithGroup(dbSessionId, databaseGroup.id);

                /* Iterate through group blobks and add them in database group object. */
                for (let blockName of groupData.blocks) {
                    updateGroupWithBlock(databaseGroup, blockName, dbSessionId);
                }

                results.push(databaseGroup);
            }).catch((err: any) => {
                console.error("Error updating group:", err);
                errors.push(err);
            });
        }

        if (errors.length == 0) {
            resolve(results);
        } else {
            reject("Error saving groups.");
        }
    });
}

/*
 * Samples.
 * Parse sample json data file and register values in database.
 */
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
            "groups": []
        });

        /* Save session into database */
        session.save().then(async (dbSession) => {
            await handleBlocks(sessionData, dbSession.id);
            await handleGroups(sessionData, dbSession.id);
        }).catch(err => {
            console.error("Error saving session.", err);
        });
    }
}

export default samples;
