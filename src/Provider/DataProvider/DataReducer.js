const DataReducer = (state, action) => {
    switch (action.type) {
        case 'RETRIEVE_DATA':
            return {
                ...state,
                dataRetrieved: action.payload
            }
        case 'QUOTA_MAX':
            return {
                ...state,
                quotaMax: action.payload
            }
        case 'Notification-Add':
            return {
                ...state,
                notificationAdd: action.payload
            }
        case 'Notification-Remove':
            return {
                ...state,
                notificationRemove: action.payload
            }
        case 'Notification-Update':
            return {
                ...state,
                notificationUpdate: action.payload
            }
        case 'REQ_STATUS':
            return {
                ...state,
                reqStatus: action.payload
            }
        default:
            return state
    }
}

export default DataReducer