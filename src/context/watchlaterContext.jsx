import { createContext, useContext, useEffect, useState } from "react";

const WatchLaterContext = createContext();

export const useWatchLater = () => {
    return useContext(WatchLaterContext);
};

export const WatchLaterProvider = ({ children }) => {

    const [watchLater, setWatchLater] = useState(() => {

        const stored = localStorage.getItem("watchLater");

        return stored ? JSON.parse(stored) : [];

    });


    // Save whenever watchLater changes
    useEffect(() => {

        localStorage.setItem(
            "watchLater",
            JSON.stringify(watchLater)
        );

    }, [watchLater]);


    // Add
    const addToWatchLater = (media) => {

        setWatchLater(prev => {

            const exists = prev.some(
                item =>
                    item.id === media.id &&
                    item.media_type === media.media_type
            );

            if (exists) {
                return prev;
            }

            return [media, ...prev];

        });

    };


    // Remove
    const removeFromWatchLater = (id, mediaType) => {

        setWatchLater(prev =>
            prev.filter(
                item =>
                    !(
                        item.id === id &&
                        item.media_type === mediaType
                    )
            )
        );

    };


    // Check if saved
    const isWatchLater = (id, mediaType) => {

        return watchLater.some(
            item =>
                item.id === id &&
                item.media_type === mediaType
        );

    };


    return (
        <WatchLaterContext.Provider
            value={{
                watchLater,
                addToWatchLater,
                removeFromWatchLater,
                isWatchLater
            }}
        >
            {children}
        </WatchLaterContext.Provider>
    );
};