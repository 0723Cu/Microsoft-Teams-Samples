const { BotFrameworkAdapter, TurnContext, TeamsInfo } = require('botbuilder');
const { BotActivityHandler } = require('../bot/botActivityHandler');
const storeService = require('../services/storageService');

const adapter = new BotFrameworkAdapter({
    appId: process.env.BotId,
    appPassword: process.env.BotPassword
});

adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. server insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       serverlication insights.
    console.error(`\n [onTurnError] unhandled error: ${ error }`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

// Create bot handlers
const botActivityHandler = new BotActivityHandler();
const botHandler = (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        // Process bot activity
        if (context.activity.serviceUrl){
            storeService.storeSave("serviceurl", context.activity.serviceUrl);
        }
        if (context.activity.conversation.id){
            storeService.storeSave("conversationid", context.activity.conversation.id);
        }
        // console.log(context);
        await botActivityHandler.run(context);
    });
}

module.exports = botHandler;