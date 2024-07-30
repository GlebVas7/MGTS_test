import {afterEach} from "vitest";
import {cleanup} from "@testing-library/react";
import "@testing-library/jest-dom/vitest"

window.matchMedia = window.matchMedia || (() => {
    return {
        matches: false,
        addListener: () => {},
        removeListener: () => {}
    };
});

afterEach(()=>{
    cleanup()
})