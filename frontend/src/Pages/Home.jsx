import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="relative mx-auto flex flex-col w-11/12 items-center text-white justify-between">
        {/* section one */}
        <div>
            <Link to={"/signup"}>
                <div>
                    <div>
                        <p>Become an Instructor</p>
                        <FaArrowRight />
                    </div>
                </div>
            </Link>
        </div>
        
        {/* section two */}
        
        {/* section three */}
        
        {/* footer */}
        </div>
    )
}
export default Home;