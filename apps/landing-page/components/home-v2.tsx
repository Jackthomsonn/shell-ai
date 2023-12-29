import { Toaster } from "@/components/ui/sonner";
import { ArrowLeftIcon, ArrowLeftRightIcon, ArrowRightIcon, ArrowUpIcon, MouseIcon, PointerIcon, TerminalIcon } from "lucide-react";
import Link from "next/link";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "./ui/carousel";
import { useEffect, useState } from "react";

export function HomeV2() {
  const [api, setApi] = useState<CarouselApi>();
  const [background, setBackground] = useState<string>("bg-indigo-50");
  const [foreground, setForeground] = useState<string>("text-indigo-900 subpixel-antialiased");

  const colours = {
    0: "bg-indigo-50",
    1: "bg-slate-200",
  }

  useEffect(() => {
    if (!api) return

    api.on("select", (a, b) => {
      const selected = a.selectedScrollSnap();
      setBackground(colours[selected as keyof typeof colours]);
      setForeground(selected === 0 ? "text-indigo-900" : "text-slate-900");
    })
  }, [api])

  return (
    <div className="flex min-h-screen md:max-h-screen bg-slate-900">
      <div className="m-2 md:m-8 flex flex-col md:flex-row gap-2">
        <section className="flex justify-center items-center w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-xl">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-4">
                <h1 className={`text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white subpixel-antialiased`}>
                  Shell AI
                </h1>
                <p className="mx-auto max-w-[700px] text-white md:text-xl subpixel-antialiased">
                  Your Personal Command Line Assistant
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
                  <div className="inline-flex h-full items-center justify-center rounded-md bg-white px-4 py-2 text-sm text-indigo-900 shadow font-bold">
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

        <section className={`w-full py-12 transition-all rounded-xl ${background} cursor-pointer`}>
          <h3 className={`${foreground} flex flex-row justify-center items-center font-bold subpixel-antialiased gap-6`}>
            <ArrowLeftIcon />
            Swipe below to see more
            <ArrowRightIcon />

          </h3>
          <Carousel className="py-12 container" setApi={setApi}>
            <CarouselContent>
              <CarouselItem>
                <div className="px-4 md:px-6">
                  <div className="grid items-center gap-6 justify-center">
                    <div className="flex flex-col justify-center space-y-4">
                      <div className="space-y-4">
                        <div className={`inline-block rounded-lg px-3 py-1 text-sm bg-green-200 font-bold ${foreground} subpixel-antialiased`}>Introduction</div>
                        <h2 className={`text-3xl font-bold tracking-tighter sm:text-5xl ${foreground} subpixel-antialiased`}>Power at Your Fingertips</h2>
                        <p className={`max-w-[600px] ${foreground} subpixel-antialiased md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed`}>
                          Shell AI revolutionizes your terminal experience by bringing the power of artificial intelligence directly to your command line interface. With Shell AI, you have a virtual assistant at your fingertips, ready to assist with tasks, provide information, and streamline your workflow — all without leaving your terminal window.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link
                          className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-indigo-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-950 disabled:pointer-events-none disabled:opacity-50"
                          href="#"
                        >
                          Contact Sales
                        </Link>
                        <Link
                          className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                          href="#"
                        >
                          Tour the Platform
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="px-4 md:px-6">
                  <div className="grid items-center gap-6 justify-center">
                    <div className="flex flex-col justify-center space-y-4">
                      <div className="space-y-4">
                        <div className="inline-block rounded-lg px-3 py-1 text-sm bg-green-200 font-bold text-green-900 subpixel-antialiased">How to use</div>
                        <h2 className={`text-3xl font-bold tracking-tighter sm:text-5xl ${foreground}`}>Lets get started</h2>
                        <p className={`max-w-[600px] ${foreground} md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed`}>
                          Experience the convenience of having an intelligent assistant right in your terminal. With Shell AI, unleash the potential of your command line interface and accomplish tasks more efficiently than ever before.
                        </p>
                        <div className="space-y-6">
                          <div className="flex items-center gap-2">
                            <Badge className="text-md font-semibold hover:bg-green-500 bg-green-500 text-green-900 h-6 w-6 flex items-center justify-center rounded-full">
                              1
                            </Badge>
                            <h3 className="font-semibold text-md text-slate-800 ml-2">Step 1: npx shell-ai login</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="text-md font-semibold hover:bg-green-500 bg-green-500 text-green-900 h-6 w-6 flex items-center justify-center rounded-full">
                              2
                            </Badge>
                            <h3 className="font-semibold text-md text-slate-800 ml-2">Step 2: npx shell-ai subscribe</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="text-md font-semibold hover:bg-green-500 bg-green-500 text-green-900 h-6 w-6 flex items-center justify-center rounded-full">
                              3
                            </Badge>
                            <h3 className="font-semibold text-md text-slate-800 ml-2">Step 3: npx shell-ai suggest</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </section>
      </div>
      <Toaster duration={2_000} />
    </div >
  )
}