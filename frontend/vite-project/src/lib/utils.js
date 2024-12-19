export const formatMessageTime = (date) => {

    const time = new Date(date).toLocaleDateString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    const [messageDate, messageTime] = time.split(", ");
    if (messageDate == new Date().toLocaleDateString()){
        return messageTime;
    } else {
        return time;
    }
};