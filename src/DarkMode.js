import { CheckCircleIcon, ShareIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
// import "./DarkMode.css";

export default function DarkMode () {
    const setDarkMode = () => {
        document.querySelector('body').setAttribute('data-theme', 'dark');
        localStorage.setItem("selectedTheme", "dark")
    }

    const setLightMode = () => {
        document.querySelector('body').setAttribute('data-theme', 'light');
        localStorage.setItem("selectedTheme", "light")
    }

    const selectedTheme = localStorage.getItem("selectedTheme");

    if(selectedTheme === "dark") {
        setDarkMode();
    }

    const toggleTheme = (e) => {
        if (e.target.checked) setDarkMode();
        else setLightMode()
    }

    return (
        <div style={{position:'fixed', bottom:10, right:10, zIndex: 999}}>
            <input
                id='theme-toggle'
                type='checkbox'
                onChange={toggleTheme}
                defaultChecked={selectedTheme === 'dark'}
                style={{backgroundColor:'red'}}
            />
            <label for='theme-toggle'>
                <CheckCircleIcon />
                <ShareIcon />
            </label>
        </div>
    )
}


    