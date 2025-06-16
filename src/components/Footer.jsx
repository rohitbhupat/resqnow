import React from 'react'

const Footer = () => {
    return (
        <>
            <div className="text-center py-6 text-sm text-gray-500">
                Designed & Developed by <span className="text-red-600 font-medium"><b><a href="https://www.linkedin.com/in/rohit-bhupat-554325237/">Rohit Bhupat</a></b></span> <br />
                © {new Date().getFullYear()} ResQNow. All rights reserved.
            </div>
        </>
    )
}

export default Footer