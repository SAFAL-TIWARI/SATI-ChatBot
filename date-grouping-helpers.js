/**
 * Date Grouping Helpers
 * Helper functions for grouping conversations by date
 */

// Function to format date grouping header
function getDateGrouping(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time components for accurate date comparison
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const n = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const y = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (d.getTime() === n.getTime()) {
        return 'Today';
    } else if (d.getTime() === y.getTime()) {
        return 'Yesterday';
    } else {
        const daysDifference = Math.floor((n - d) / (1000 * 60 * 60 * 24));

        if (daysDifference <= 7) {
            return 'Previous 7 Days';
        } else if (daysDifference <= 30) {
            return 'Previous 30 Days';
        } else {
            const months = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            return `${months[date.getMonth()]} ${date.getFullYear()}`;
        }
    }
}

// Function to group conversations by date period
function groupConversationsByDate(conversations) {
    const groups = {};

    conversations.forEach(conversation => {
        // Use updatedAt or createdAt, default to now if missing
        const dateStr = conversation.updatedAt || conversation.createdAt || new Date().toISOString();
        const groupName = getDateGrouping(dateStr);

        if (!groups[groupName]) {
            groups[groupName] = [];
        }

        groups[groupName].push(conversation);
    });

    return groups;
}

// Make functions available globally
window.getDateGrouping = getDateGrouping;
window.groupConversationsByDate = groupConversationsByDate;

console.log('✅ Date grouping helpers loaded');
