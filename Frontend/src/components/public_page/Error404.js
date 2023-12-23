import React from 'react'

const Error404 = () => {
    return (
        <div className="
                flex flex-col h-screen
            ">
                <header className="
                    h-20 bg-amber-700
                "/>
                <div className="
                    flex grow justify-center items-center bg-amber-700
                ">
                    <div className="
                        flex flex-col gap-2
                    ">
                        <p className="
                            text-2xl text-center text-white
                        ">
                            404 Not Found
                        </p>
                        <img src="https://i.imgur.com/qIufhof.png" alt="404" className="w-96 h-96"/>
                    </div>
                </div>
            </div>
    )
}

export default Error404