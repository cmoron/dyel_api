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
 * Returns Promise with saved exercises ids in array if successful.
 */
async function handleExercises(exercises: any) {

    let results: any[] = [];
    let errors: any[] = [];

    return new Promise(async (resolve, reject) => {
        for (let exerciseData of exercises) {
            try {
                let ex: any = await handleExercise(exerciseData);
                results.push(ex.id);
            } catch (error) {
                console.error('Error saving exercise : ' + exerciseData.name, error);
                errors.push(error);
            }
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
//function handleBlock(blockData: any, dbSessionId: string) {
    //return new Promise((resolve, reject) => {
        //let block = new Block({
            //"name": blockData.name,
            //"session" : dbSessionId,
            //"exercises" : []
        //});

        //let res = block.save().then((databaseBlock: any) => {
            //resolve(databaseBlock);
        //})
        //.catch((err: any) => {
            //console.error("Error saving block. " + res);
            //reject(err);
        //});
    //});
//}

/*
 * Handle block.
 * Save block in database.
 * Returns Promise with saved object if successful.
 */
function handleBlock(blockData: any, exercises: any[], dbSessionId: String) {
    return new Promise((resolve, reject) =>  {
        let block = new Block({
            "name": blockData.name,
            "session": dbSessionId,
            "exercises": exercises
        });

        let res = block.save().then((databaseBlock: any) => {
            resolve(databaseBlock);
        }).catch((error: any) => {
            reject(error);
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
            console.log(blockData.name);
            //let databaseBlock: any = await handleBlock(blockData, dbSessionId);
            let exercises = [];
            if (null != blockData.exercises) {
                try {
                    let res = await handleExercises(blockData.exercises);
                    if (res instanceof Array) exercises = res;
                } catch (error) {
                    console.error("Error during exercises save, block data will be corrupted");
                }
            }
            let databaseBlock: any = await handleBlock(blockData, exercises, dbSessionId);
            console.log(databaseBlock.name + ' registered');
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
            console.error("Error saving group: " + err);
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
            console.error("Cannot find " + blockName + " for session " + dbSessionId);
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
            console.error("Cannot find sessions with id : " + dbSessionId);
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

        try {
            /* Save session into database */
            let dbSession: any = await session.save();
            await handleBlocks(sessionData, dbSession.id);
            await handleGroups(sessionData, dbSession.id);
        } catch (error) {
            console.error("Error saving session.", error);
        }

        //session.save().then(async (dbSession) => {
            //await handleBlocks(sessionData, dbSession.id);
            //await handleGroups(sessionData, dbSession.id);
        //}).catch(err => {
            //console.error("Error saving session.", err);
        //});
    }
}

export default samples;
