import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function DocumentationSlide() {
    return (
      <div className="min-h-screen bg-[#111111] bg-opacity-100 text-white p-4 md:p-6 z-40">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Code Editor Panel */}
          <div className="space-y-4">
            <Card className="bg-[#1a1b26] border-none text-white p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <button className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">Delete</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <pre className="font-mono text-sm">
                <code className="text-gray-300">
                  <span className="text-purple-400">from</span> <span className="text-blue-400">manim</span>{" "}
                  <span className="text-purple-400">import</span> *{"\n\n"}
                  <span className="text-red-400">config.media_width</span> = <span className="text-green-400">"75%"</span>
                  {"\n"}
                  <span className="text-red-400">config.verbosity</span> ={" "}
                  <span className="text-green-400">"CRITICAL"</span>
                  {"\n"}
                  <span className="text-red-400">config.background_color</span> ={" "}
                  <span className="text-green-400">"#111111"</span>
                  {"\n"}
                  <span className="text-red-400">config.progress_bar</span> ={" "}
                  <span className="text-green-400">'none'</span>
                </code>
              </pre>
            </Card>
  
            <Card className="bg-[#1a1b26] border-none text-white p-4">
              <pre className="font-mono text-sm">
                <code className="text-gray-300">
                  ManiBooks have all the basic features of a book{"\n\n"}
                  <span className="text-green-400"># This is a heading</span>
                  {"\n"}
                  <span className="text-green-400">## This is a subheading</span>
                  {"\n"}
                  <span className="text-green-400">### This is a subsubheading</span>
                  {"\n\n"}
                  <span className="text-green-400">#### *and so on*</span>
                  {"\n\n"}
                  ~Every~ (more than every) feature for text formatting **is present**{"\n\n"}
                  For example,{"\n"}- this{"\n"}- is{"\n"}- an{"\n"}- unordered{"\n"}- list{"\n\n"}
                  But you can still do much more . . .
                </code>
              </pre>
            </Card>
          </div>
  
          {/* Content Panel */}
          <div className="space-y-6">
            <Image
              src="/promo.png"
              alt="Documentation diagram"
              width={400}
              height={200}
              className="w-full object-contain"
            />
  
            <div className="space-y-4">
              <p className="text-gray-400">And keep playing with it . . .</p>
              <h1 className="text-4xl font-bold">Advanced Manimations</h1>
              <p className="text-gray-400">And you can go crazier still . . .</p>
            </div>
          </div>
        </div>
      </div>
    )
  }