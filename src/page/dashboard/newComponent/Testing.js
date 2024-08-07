import React, { useContext } from 'react'
import DataContext from '../../../Provider/DataProvider/DataProvider'

export default function Testing() {

    const { dataRetrieved } = useContext(DataContext)

    console.log(dataRetrieved)

    return (
        <div>Testing</div>
    )
}
