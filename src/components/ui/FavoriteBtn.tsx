import React from 'react'

function FavoriteBtn() {
    return (
        <button className="bg-white rounded-md px-3 py-2 cursor-pointer hover:bg-gray-400 active:bg-white">
            <img className="w-[20px]" src="./icons/star.png" alt="Favorites Icon" />
        </button>
    )
}

export default FavoriteBtn