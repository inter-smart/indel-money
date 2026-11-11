
"use client";
import { motion } from "framer-motion";

function LoadingCircleSpinner({ full = true }) {
    return (
        <div className={full ? "w-[100vw] h-[100vh] bg-white backdrop-blur-3xl flex" : "w-full h-full bg-white/70 flex"}>
            <motion.div
                className="w-[50px] h-[50px] rounded-full border-[4px] border-solid border-base1 border-t-base2 will-change-transform m-auto"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </div>
    )
}

export default LoadingCircleSpinner