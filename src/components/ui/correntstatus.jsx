import React from "react";
import Image from "next/image";
import CurrentProject from "../../../public/KrmagsDark.png";

export default function WorkingStatus() {
    return (
        <section className="flex w-full flex-col justify-center rounded-lg bg-black p-4">
            
            <div className="flex flex-col items-center gap-4">
                <div className="flex flex-row ">
                    <h1 className="text-2xl flex font-bold underline underline-offset-8 decoration-[#1ABCFE] ">Current </h1>
                    <p className="text-xl pt-1 mx-2 font-bold text-neutral-500 no-underline">Project </p>
                </div>

                <div className="w-full max-w-2xl rounded-lg bg-white p-1">
                    <Image 
                        src={CurrentProject} 
                        alt="Current Project" 
                        className="w-full h-auto rounded-lg"
                    />
                </div>
            </div>

        </section>
    );
};
