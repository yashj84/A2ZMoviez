// src/hooks/useTVNavigation.js

import { useEffect } from "react";

function useTVNavigation() {

    useEffect(() => {

        function handleKeyDown(event) {

            const key = event.key;

            const allowedKeys = [
                "ArrowUp",
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight",
                "Enter"
            ];

            if (!allowedKeys.includes(key)) {
                return;
            }

            /*
             * Don't interfere with typing in the search box
             * or using select controls.
             */

            const target = event.target;

            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT"
            ) {
                return;
            }


            const focused =
                document.activeElement;


            /*
             * Only handle navigation when an element
             * marked for TV navigation is focused.
             */

            if (
                !focused ||
                !focused.classList.contains(
                    "tv-focusable"
                )
            ) {
                return;
            }


            const focusable =
                Array.from(
                    document.querySelectorAll(
                        ".tv-focusable"
                    )
                );


            const currentIndex =
                focusable.indexOf(focused);


            if (currentIndex === -1) {
                return;
            }


            /*
             * Enter / OK
             */

            if (key === "Enter") {

                event.preventDefault();

                focused.click();

                return;
            }


            /*
             * Get current card position
             */

            const currentRect =
                focused.getBoundingClientRect();


            let bestElement = null;

            let bestScore = Infinity;


            focusable.forEach(
                (element, index) => {

                    if (
                        index === currentIndex
                    ) {
                        return;
                    }


                    const rect =
                        element.getBoundingClientRect();


                    let valid = false;

                    let score = Infinity;


                    /*
                     * RIGHT
                     */

                    if (
                        key === "ArrowRight" &&
                        rect.left >=
                            currentRect.right - 5
                    ) {

                        const verticalDistance =
                            Math.abs(
                                rect.top -
                                currentRect.top
                            );

                        const horizontalDistance =
                            rect.left -
                            currentRect.right;


                        score =
                            verticalDistance * 10 +
                            horizontalDistance;

                        valid = true;
                    }


                    /*
                     * LEFT
                     */

                    if (
                        key === "ArrowLeft" &&
                        rect.right <=
                            currentRect.left + 5
                    ) {

                        const verticalDistance =
                            Math.abs(
                                rect.top -
                                currentRect.top
                            );

                        const horizontalDistance =
                            currentRect.left -
                            rect.right;


                        score =
                            verticalDistance * 10 +
                            horizontalDistance;

                        valid = true;
                    }


                    /*
                     * DOWN
                     */

                    if (
                        key === "ArrowDown" &&
                        rect.top >=
                            currentRect.bottom - 5
                    ) {

                        const horizontalDistance =
                            Math.abs(
                                rect.left -
                                currentRect.left
                            );

                        const verticalDistance =
                            rect.top -
                            currentRect.bottom;


                        score =
                            horizontalDistance * 10 +
                            verticalDistance;

                        valid = true;
                    }


                    /*
                     * UP
                     */

                    if (
                        key === "ArrowUp" &&
                        rect.bottom <=
                            currentRect.top + 5
                    ) {

                        const horizontalDistance =
                            Math.abs(
                                rect.left -
                                currentRect.left
                            );

                        const verticalDistance =
                            currentRect.top -
                            rect.bottom;


                        score =
                            horizontalDistance * 10 +
                            verticalDistance;

                        valid = true;
                    }


                    if (
                        valid &&
                        score < bestScore
                    ) {

                        bestScore = score;

                        bestElement =
                            element;
                    }

                }
            );


            if (bestElement) {

                event.preventDefault();

                bestElement.focus();

                bestElement.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "nearest"
                });

            }

        }


        window.addEventListener(
            "keydown",
            handleKeyDown
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, []);

}

export default useTVNavigation;