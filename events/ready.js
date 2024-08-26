module.exports = (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(client.config.activity, { type: client.config.activityType });
};
