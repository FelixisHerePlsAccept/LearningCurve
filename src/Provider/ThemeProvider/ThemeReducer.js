const ThemeReducer = (state, action) => {
    switch (action.type) {
        case 'LIGHT':
            return {
                currentTheme: 'light'
            }
        case 'DARK':
            return {
                currentTheme: 'dark'
            }
        default: 
            return state
    }
}

export default ThemeReducer