import React, { useContext, useState, useEffect } from 'react'
import {useOutletContext} from 'react-router-dom'

const DashboardPage = () => {
    const user = useOutletContext();

    return (
        <div class="flex flex-col p-8 gap-8">
            <div class="bg-amber-500 w-post h-post rounded-lg"/>
            <div class="bg-amber-500 w-post h-post rounded-lg"/>
            <div class="bg-amber-500 w-post h-post rounded-lg"/>
            <div class="bg-amber-500 w-post h-post rounded-lg"/>
            <div class="bg-amber-500 w-post h-post rounded-lg"/>
            <div class="bg-amber-500 w-post h-post rounded-lg"/>
        </div>
        
    )
}

export default DashboardPage