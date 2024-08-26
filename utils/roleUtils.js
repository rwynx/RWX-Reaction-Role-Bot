module.exports = {
    addRole: async (member, role) => {
        try {
            await member.roles.add(role);
            console.log(`Added role ${role.name} to ${member.user.tag}`);
        } catch (error) {
            console.error(`Failed to add role ${role.name} to ${member.user.tag}:`, error);
        }
    },
    removeRole: async (member, role) => {
        try {
            await member.roles.remove(role);
            console.log(`Removed role ${role.name} from ${member.user.tag}`);
        } catch (error) {
            console.error(`Failed to remove role ${role.name} from ${member.user.tag}:`, error);
        }
    }
};
