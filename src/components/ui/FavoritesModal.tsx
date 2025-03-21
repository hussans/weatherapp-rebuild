'use client';
import React from 'react';

interface WeatherLocation {
    name: string;
    lat: number;
    lon: number;
    state?: string;
    country: string;
}

interface FavoritesModalProps {
    favorites: WeatherLocation[];
    isOpen: boolean;
    onClose: () => void;
    onSelectFavorite: (favorite: WeatherLocation) => void;
    onRemoveFavorite?: (favorite: WeatherLocation) => void;
    bgColor?: string;
}

function FavoritesModal({ favorites, isOpen, onClose, onSelectFavorite, onRemoveFavorite, bgColor }: FavoritesModalProps) {
    if (!isOpen) {
        return null;
    }

    if (!bgColor) {
        bgColor = "#0F1014";
    }

    return (
        <div className="absolute top-0 right-0 w-full h-full z-10" style={{ backgroundColor: bgColor }}>
            <div className="p-10 h-full relative">
                <div className="flex justify-between items-center">
                    <div></div>
                    <button onClick={onClose} className="text-white p-2 hover:bg-[#FFFFFF13] rounded-full transition-colors cursor-pointer" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="w-[100%] h-[calc(100%-80px)] bg-[#FFFFFF03] border-1 border-[#FFFFFF13] rounded-2xl mt-9 p-6">
                    <div className="font-[Inter-Medium]">
                        <p> FAVORITES </p>
                    </div>

                    <div>
                        {favorites.length === 0 && (
                            <p className="text-white mt-6"> No favorite locations saved yet. </p>
                        )}

                        {favorites.length > 0 && (
                            <div className="mt-10 space-y-5">
                                {favorites.map(function (favorite, index) {
                                    let locationText = favorite.name;

                                    if (favorite.state) {
                                        locationText = locationText + ", " + favorite.state;
                                    } else {
                                        locationText = locationText + ", ";
                                    }

                                    locationText = locationText + favorite.country;

                                    return (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center p-4 bg-[#FFFFFF09] hover:bg-[#FFFFFF15] active:bg-[#FFFFFF05] rounded-lg transition-colors"
                                        >
                                            <p
                                                className="text-white font-[Inter-Medium] cursor-pointer hover:text-gray-300 flex-grow"
                                                onClick={function () { onSelectFavorite(favorite); }}
                                            >
                                                {locationText}
                                            </p>
                                            {onRemoveFavorite && (
                                                <button
                                                    onClick={function () {
                                                        if (onRemoveFavorite) {
                                                            onRemoveFavorite(favorite);
                                                        }
                                                    }}
                                                    className="text-white hover:text-red-400 cursor-pointer"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FavoritesModal;