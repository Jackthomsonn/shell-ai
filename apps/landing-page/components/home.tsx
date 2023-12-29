
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { ArrowUpIcon, TerminalIcon } from "lucide-react";
import Link from "next/link";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from "sonner";

export function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-indigo-500 to-indigo-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white subpixel-antialiased">
                  Shell AI
                </h1>
                <p className="mx-auto max-w-[700px] text-white md:text-xl subpixel-antialiased">
                  A game-changing product that boosts your productivity and streamlines your workflow.
                </p>
              </div>
              <div className="space-x-4">
                <CopyToClipboard text='npx shell-ai suggest "Write terraform import command for bigquery resource"' onCopy={() => toast("Copied to clipboard", {
                  description: "You can now paste this command in your terminal",
                  position: "bottom-center",
                  action: {
                    label: "Close",
                    onClick: () => toast.dismiss(),
                  },
                  actionButtonStyle: {
                    background: "#4C1D95",
                  },
                })}>
                  <div className="inline-flex h-full items-center justify-center rounded-md bg-white px-4 py-2 text-sm text-indigo-900 shadow font-bold cursor-pointer">
                    <>
                      <TerminalIcon />
                      <span className="ml-2 cursor-pointer">npx shell-ai suggest "your command"</span>
                    </>

                  </div>
                </CopyToClipboard>
              </div>
              <div>
                <h1 className="text-white flex font-extrabold flex-col items-center">
                  <ArrowUpIcon />
                  Click me to copy
                </h1>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-900">
          <div className="flex flex-col justify-center space-y-4 container">
            <div className="space-y-4">
              <div className="inline-block rounded-lg px-3 py-1 text-sm bg-green-200 font-bold text-slate-900">Getting started</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">How to get started</h2>
              <p className="max-w-[600px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Follow these steps to get started with Shell AI.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-2 cursor-pointer">
                <Badge className="text-md font-semibold bg-green-500 text-white h-6 w-6 flex items-center justify-center rounded-full">
                  1
                </Badge>
                <h3 className="font-semibold text-md text-white ml-2">Step 1: npx shell-ai login</h3>
              </div>
              <div className="flex items-center gap-2 cursor-pointer">
                <Badge className="text-md font-semibold bg-green-500 text-white h-6 w-6 flex items-center justify-center rounded-full">
                  2
                </Badge>
                <h3 className="font-semibold text-md text-white ml-2">Step 2: npx shell-ai subscribe</h3>
              </div>
              <div className="flex items-center gap-2 cursor-pointer">
                <Badge className="text-md font-semibold bg-green-500 text-white h-6 w-6 flex items-center justify-center rounded-full">
                  3
                </Badge>
                <h3 className="font-semibold text-md text-white ml-2">Step 3: npx shell-ai suggest "your command"</h3>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <img
                alt="Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="310"
                src="/placeholder.jpg"
                width="550"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <div className="inline-block rounded-lg px-3 py-1 text-sm bg-green-200 font-bold text-slate-900">Features</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">Power at Your Fingertips</h2>
                  <p className="max-w-[600px] text-slate-900 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Experience an all-in-one solution with our SAAS product. From project management to real-time
                    collaboration, we've got you covered.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    href="#"
                  >
                    Contact Sales
                  </Link>
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    href="#"
                  >
                    Tour the Platform
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Toaster />

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© SAAS Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div >
  )
}