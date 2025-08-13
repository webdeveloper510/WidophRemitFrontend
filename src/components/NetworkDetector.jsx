import React, { useEffect, useState, useRef } from "react";
import DinoOfflinePage from "./DinoOfflinePage";

export default function NetworkDetector({ children }) {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showChildren, setShowChildren] = useState(navigator.onLine);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const handleOnline = () => {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setIsOnline(true);
                setShowChildren(true);
            }, 500);
        };

        const handleOffline = () => {
            clearTimeout(timeoutRef.current);
            setIsOnline(false);
            setShowChildren(false);
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            clearTimeout(timeoutRef.current);
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (!isOnline) {
        return <DinoOfflinePage />;
    }

    return showChildren ? children : null;
}
