import React from "react";
import Link from "next/link";
import WorkTogetherIcon from "../../../public/icons/worktogether";
import LinkdinLogo from "../../../public/icons/linkedin";
import Instagram from "../../../public/icons/instagram";
import Watsapp from "../../../public/icons/watsapp";
import Tweeter from "../../../public/icons/tweeter";
import CopyToClickboard from "@/hooks/copyToClickboard";

export default function WrokTogether() {
  return (
    <section className="flex w-full flex-col justify-center rounded-lg bg-black p-4">
      <div className="flex items-center justify-center">
        <WorkTogetherIcon className="h-16 w-16 rounded-full bg-slate-900 px-4 py-4" />
      </div>

      <div className="mt-2 flex flex-col items-center justify-center">
        <div className="flex w-full flex-col">
          <h1 className="flex w-full justify-center px-2 text-center text-2xl">
            Let&apos;s Work Together
          </h1>
          <p className="flex w-full justify-center px-2 text-center text-neutral-500">
            Let&apos;s make your ideas come to reality
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center justify-center gap-4 p-4">
          <Link
            href="https://www.linkedin.com/in/md-kamran-247154246/"
            target="_blink"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <LinkdinLogo />
          </Link>

          <Link
            href="https://www.instagram.com/mdkamran_25/"
            target="_blink"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <Instagram />
          </Link>

          <Link 
            href="https://wa.me/+918368458839" 
            target="_blink" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <Watsapp />
          </Link>

          <Link 
            href="https://x.com/mdkamran_25" 
            target="_blink" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <Tweeter />
          </Link>
        </div>

        <div className="flex w-full flex-wrap justify-center p-4">
          <p className="flex justify-center gap-3 break-all rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-thin text-neutral-500">
            2022540866.mohammad@ug.sharda.ac.in
            <CopyToClickboard />
          </p>
        </div>
      </div>
    </section>
  );
}
