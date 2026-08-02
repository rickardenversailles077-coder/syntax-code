import CodeEditor from "@/components/CodeEditor";
import { Sparkles, Image, Palette, Code, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="flex flex-col items-center pt-16 pb-12 px-6">
        {/* Launch Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Syntax Code v1.0 is Live</span>
        </div>

        {/* Hero Title */}
        <div className="text-center max-w-3xl mb-8">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 leading-tight">
            Create Beautiful Code Snippets in Seconds
          </h1>
          <p className="mt-4 text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto">
            Transform your source code into stunning high-resolution images for blogs, social media, and documentation.
          </p>
        </div>

        {/* Main Editor Component */}
        <div className="w-full">
          <CodeEditor />
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-zinc-900 w-full">
        <h2 className="text-center text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-8">
          Why Use Syntax Code
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 bg-zinc-900/40 border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg w-fit text-indigo-400 mb-4">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-1">Custom Themes</h3>
            <p className="text-zinc-400 text-sm">
              Choose from curated gradient backgrounds and popular code syntax highlighting themes.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-zinc-900/40 border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition">
            <div className="p-2.5 bg-pink-500/10 border border-pink-500/20 rounded-lg w-fit text-pink-400 mb-4">
              <Image className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-1">High-Res Export</h3>
            <p className="text-zinc-400 text-sm">
              Export pixel-perfect PNG images or copy directly to your clipboard instantly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-zinc-900/40 border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition">
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-lg w-fit text-purple-400 mb-4">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-1">Monaco Editor</h3>
            <p className="text-zinc-400 text-sm">
              Powered by VS Code&apos;s editor core for full auto-formatting, syntax support, and keyboard shortcuts.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 px-6 text-center text-sm text-zinc-500">
        <p>© {new Date().getFullYear()} Syntax Code. Built for modern developers.</p>
      </footer>
    </main>
  );
}