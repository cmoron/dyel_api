import Block from './../models/block'
import Exercise from './../models/exercise'
import Group from './../models/group'
import Session from './../models/session'
import User from './../models/user'
import data from './wodz.json'
import bcrypt from 'bcryptjs'
import { loggerFactory } from './../config/configuration'

const logger = loggerFactory.getLogger('__samples__/data.ts')

/*
 * Handle exercise :
 * Save exercise in database.
 * Returns Promise with saved object if successful.
 */
async function handleExercise(exerciseData: any) {
    return new Promise((resolve, reject) => {
        const exercise = new Exercise({
            'name': exerciseData.name,
            'repeat': exerciseData.repeat
        })

        exercise.save().then((dbExercise: any) => {
            resolve(dbExercise)
        }).catch((error: any) => {
            reject(error)
        })
    })
}

/*
 * Handle exercises :
 * Iterate through exercises and save it in database.
 * Returns Promise with saved exercises ids in array if successful.
 */
async function handleExercises(exercises: any) {

    const results: string[] = []
    const errors: any[] = []

    return new Promise(async (resolve, reject) => {
        for (const exerciseData of exercises) {
            try {
                const dbExercise: any = await handleExercise(exerciseData)
                results.push(dbExercise.id)
            } catch (error) {
                logger.error('Error saving exercise : ' + exerciseData.name, error)
                errors.push(error)
            }
        }

        if (errors.length === 0) {
            resolve(results)
        } else {
            reject(errors)
        }
    })
}

/*
 * Handle block.
 * Save block in database.
 * Returns Promise with saved object if successful.
 */
function handleBlock(blockData: any, exercises: any[], dbSessionId: string) {
    return new Promise((resolve, reject) =>  {
        const block = new Block({
            'name': blockData.name,
            'session': dbSessionId,
            'exercises': exercises
        })

        const res = block.save().then((databaseBlock: any) => {
            resolve(databaseBlock)
        }).catch((error: any) => {
            reject(error)
        })
    })
}

/*
 * Handle blocks.
 * Iterate through blocks and save it in database.
 * Returns Promise with saved blocks ids in array if successful.
 */
async function handleBlocks(sessionData: any, dbSessionId: string) {
    const results: string[] = []
    const errors: any[] = []

    return new Promise(async (resolve, reject) => {
        for (const blockData of sessionData.blocks) {
            const exercises: any[] = []

            if (blockData.exercises) {
                try {
                    const res = await handleExercises(blockData.exercises)
                    if (res instanceof Array) {
                        exercises.push(...res)
                    }
                } catch (error) {
                    logger.error('Error during exercises save, block data will be corrupted')
                }
            }

            const databaseBlock: any = await handleBlock(blockData, exercises, dbSessionId)
            results.push(databaseBlock.id)
        }

        if (errors.length === 0) {
            resolve(results)
        } else {
            reject('Error saving blocks.')
        }
    })
}

/*
 * Handle group.
 * Save group in database.
 * Returns Promise with saved object if successful.
 */
async function handleGroup(groupData: any) {

    return new Promise((resolve, reject) => {
        const group = new Group({
            'order': groupData.order,
            'repeat': groupData.repeat,
            'blocks' : []
        })

        const res = group.save().then((databaseGroup: any) => {
            resolve(databaseGroup)
        })
        .catch((err: any) => {
            logger.error('Error saving group: ' + err)
            reject(err)
        })
    })
}

/*
 * Update group with Block name.
 * Add the block to the group in database.
 */
function updateGroupWithBlock(databaseGroup: any, blockName: string, dbSessionId: string) {
    Block.findOne({ name: blockName, session: dbSessionId }).exec( (findError, dbBlock) => {
        if (dbBlock) {
            databaseGroup.updateOne({ $push: { 'blocks': dbBlock.id }})
                .catch((updateError: any) => logger.error('Group update failed.', updateError))
        } else {
            logger.error('Cannot find ' + blockName + ' for session ' + dbSessionId)
        }
    })
}

/*
 * Update session with group id.
 * Add the group id to the session object in database.
 */
function updateSessionWithGroup(dbSessionId: string, dbGroupId: string) {
    Session.findById(dbSessionId).then(session => {
        if (session) {
            session.updateOne({ $push: { 'groups': dbGroupId }})
                .catch((err: any) => logger.error('Session update failed.', err))
        } else {
            logger.error('Cannot find sessions with id : ' + dbSessionId)
        }
    })
}
/*
 * Handle groups.
 * Iterate through groups and save it in database.
 * Returns Promise with saved groups ids in array if successful.
 */
async function handleGroups(sessionData: any, dbSessionId: string) {
    const results: string[] = []
    const errors: any[] = []

    return new Promise(async (resolve, reject) => {
        if (sessionData.groups) {
            for(const groupData of sessionData.groups) {
                /* Await needed to update session in good order. */
                await handleGroup(groupData).then((databaseGroup: any) => {

                    /* Add group to session */
                    updateSessionWithGroup(dbSessionId, databaseGroup.id)

                    /* Iterate through group blobks and add them in database group object. */
                    for (const blockName of groupData.blocks) {
                        updateGroupWithBlock(databaseGroup, blockName, dbSessionId)
                    }

                    results.push(databaseGroup)
                }).catch((error: any) => {
                    logger.error('Error updating group:', error)
                    errors.push(error)
                })
            }
        }

        if (errors.length === 0) {
            resolve(results)
        } else {
            reject('Error saving groups.')
        }
    })
}

/*
 * createUsers
 * Create samples users for developpment purpose.
 */
async function createUsers() {
    return new Promise((resolve, reject) => {

        const SALT_ROUNDS = 10
        const pass : string = bcrypt.hashSync('user', SALT_ROUNDS)

        const user = new User({
            name: 'user',
            username: 'user',
            email: 'user@gmail.com',
            password: pass,
        })

        user.save().then(res => {
            resolve(res)
        })
        .catch(err => {
            reject(err)
        })
    })
}

/*
 * Samples.
 * Parse sample json data file and register values in database.
 */
async function samples() {

    logger.info('Create sample data.')

    /* Clear database sequentially */
    await Session.deleteMany({}, () => { logger.info('Sessions cleared')})
    await Group.deleteMany({}, () => { logger.info('Groups cleared')})
    await Block.deleteMany({}, () => { logger.info('Blocks cleared')})
    await Exercise.deleteMany({}, () => { logger.info('Exercises cleared')})
    await User.deleteOne({name: 'user'}, () => { logger.info('User named user cleared')})

    createUsers().then(() => {
        logger.info('Sample users created.')
    })

    /* Read sessions from json */
    for (const sessionData of data.sessions) {
        const session = new Session({
            'name': sessionData.name,
            'groups': []
        })

        try {
            /* Save session into database */
            const dbSession: any = await session.save()
            await handleBlocks(sessionData, dbSession.id)
            await handleGroups(sessionData, dbSession.id)
        } catch (error) {
            logger.error('Error saving session.', error)
        }
    }
}

export default samples
