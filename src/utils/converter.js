export const convertYYYYMMDDHHmmToReadable = (date) => {

    const formattedStr = `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}T${date.substring(8, 10)}:${date.substring(10, 12)}`;
    const dateObj = new Date(formattedStr);

    // Convert to a human-readable format
    const humanReadable = dateObj.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
    });

    return humanReadable
}