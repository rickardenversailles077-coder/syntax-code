"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { loader } from "@monaco-editor/react";
import { codeToHtml } from "shiki";
import { domToPng, domToBlob } from "modern-screenshot";
import { 
  Download, 
  Code2, 
  Copy, 
  Check, 
  Monitor, 
  Smartphone, 
  ListOrdered, 
  Share2, 
  FileCode2 
} from "lucide-react";

// Configurer Monaco pour charger les assets locaux (/public/vs)
loader.config({ paths: { vs: "/vs" } });

const DynamicEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-[350px] w-full flex items-center justify-center text-zinc-500 font-mono text-sm">
      Loading editor...
    </div>
  ),
});

const LANGUAGES = ["typescript", "javascript", "python", "html", "css", "json", "rust", "go", "sql"];

const TEMPLATES: Record<string, { label: string; lang: string; filename: string; code: string }> = {
  welcome: {
    label: "Welcome Snippet",
    lang: "typescript",
    filename: "syntax-code.ts",
    code: `// Welcome to Syntax Code`,
  },
  react: {
    label: "React Component",
    lang: "typescript",
    filename: "Button.tsx",
    code: `import React from 'react';\n\ninterface ButtonProps {\n  label: string;\n  onClick: () => void;\n}\n\nexport const PrimaryButton = ({ label, onClick }: ButtonProps) => (\n  <button \n    onClick={onClick}\n    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-lg transition"\n  >\n    {label}\n  </button>\n);`,
  },
  python: {
    label: "Python API Route",
    lang: "python",
    filename: "app.py",
    code: `from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/api/v1/status")\ndef get_status():\n    return {\n        "status": "online",\n        "uptime": "99.9%",\n        "service": "Syntax Code Engine"\n    }`,
  },
  sql: {
    label: "SQL Query",
    lang: "sql",
    filename: "analytics.sql",
    code: `SELECT \n  date_trunc('month', created_at) AS month,\n  COUNT(id) AS total_users,\n  SUM(mrr) AS recurring_revenue\nFROM subscriptions\nWHERE status = 'active'\nGROUP BY 1\nORDER BY month DESC;`,
  },
  rust: {
    label: "Rust Async Task",
    lang: "rust",
    filename: "main.rs",
    code: `#[tokio::main]\nasync fn main() -> Result<(), Box<dyn std::error::Error>> {\n    let resp = reqwest::get("https://api.syntaxcode.com/v1/health")\n        .await?\n        .text()\n        .await?;\n        \n    println!("Status response: {}", resp);\n    Ok(())\n}`,
  },
};

const BACKGROUND_THEMES = [
  { name: "Dark Velvet", bg: "bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900" },
  { name: "Ocean Breeze", bg: "bg-gradient-to-br from-blue-600 via-teal-500 to-emerald-400" },
  { name: "Sunset Fire", bg: "bg-gradient-to-br from-amber-500 via-rose-500 to-purple-600" },
  { name: "Neon Cyber", bg: "bg-gradient-to-br from-fuchsia-600 to-pink-500" },
  { name: "Minimal Dark", bg: "bg-zinc-900" }
];

const CODE_THEMES = [
  { id: "github-dark", name: "GitHub Dark" },
  { id: "dracula", name: "Dracula" },
  { id: "nord", name: "Nord" },
  { id: "monokai", name: "Monokai" },
];

export default function CodeEditor() {
  const [code, setCode] = useState<string>(TEMPLATES.welcome.code);
  const [language, setLanguage] = useState<string>("typescript");
  const [filename, setFilename] = useState<string>("syntax-code.ts");
  const [bgIndex, setBgIndex] = useState<number>(0);
  const [codeTheme, setCodeTheme] = useState<string>("github-dark");
  const [padding, setPadding] = useState<number>(32);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);
  
  const [shikiHtml, setShikiHtml] = useState<string>("");
  const exportRef = useRef<HTMLDivElement | null>(null);

  // Charger la configuration ou les paramètres d'URL au montage
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const encodedCode = searchParams.get("code");
    
    if (encodedCode) {
      try {
        const decoded = decodeURIComponent(atob(encodedCode));
        setCode(decoded);
        const langParam = searchParams.get("lang");
        if (langParam) setLanguage(langParam);
        const fileParam = searchParams.get("file");
        if (fileParam) setFilename(fileParam);
        return;
      } catch (err) {
        console.error("Failed to parse shared URL state:", err);
      }
    }

    const savedConfig = localStorage.getItem("syntax_code_config");
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.filename) setFilename(parsed.filename);
        if (parsed.bgIndex !== undefined) setBgIndex(parsed.bgIndex);
        if (parsed.codeTheme) setCodeTheme(parsed.codeTheme);
        if (parsed.padding) setPadding(parsed.padding);
        if (parsed.showLineNumbers !== undefined) setShowLineNumbers(parsed.showLineNumbers);
      } catch (err) {
        console.error("Failed to parse local config:", err);
      }
    }
  }, []);

  // Sauvegarder automatiquement les préférences
  useEffect(() => {
    const config = { language, filename, bgIndex, codeTheme, padding, showLineNumbers };
    localStorage.setItem("syntax_code_config", JSON.stringify(config));
  }, [language, filename, bgIndex, codeTheme, padding, showLineNumbers]);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (filename.startsWith("syntax-code.")) {
      const extMap: Record<string, string> = {
        typescript: "ts",
        javascript: "js",
        python: "py",
        html: "html",
        css: "css",
        json: "json",
        rust: "rs",
        go: "go",
        sql: "sql"
      };
      setFilename(`syntax-code.${extMap[newLang] || "txt"}`);
    }
  };

  const applyTemplate = (templateKey: string) => {
    const tmpl = TEMPLATES[templateKey];
    if (tmpl) {
      setCode(tmpl.code);
      setLanguage(tmpl.lang);
      setFilename(tmpl.filename);
    }
  };

  // Partage rapide (Web Share API ou Copie d'URL avec état)
  const shareSnippet = async () => {
    try {
      const encoded = btoa(encodeURIComponent(code));
      const shareUrl = `${window.location.origin}?lang=${language}&file=${encodeURIComponent(filename)}&code=${encoded}`;

      if (navigator.share) {
        await navigator.share({
          title: filename || "Syntax Code Snippet",
          text: "Check out this code snippet generated with Syntax Code!",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  // Highlighting Shiki
  useEffect(() => {
    let isMounted = true;
    async function highlight() {
      try {
        const html = await codeToHtml(code, {
          lang: language,
          theme: codeTheme,
        });
        if (isMounted) {
          setShikiHtml(html);
        }
      } catch (err) {
        console.error("Shiki highlighting error:", err);
      }
    }
    highlight();
    return () => {
      isMounted = false;
    };
  }, [code, language, codeTheme]);

  // Export PNG
  const exportPNG = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);

    try {
      const dataUrl = await domToPng(exportRef.current, { scale: 2 });
      const link = document.createElement("a");
      link.download = filename ? `${filename}.png` : `syntax-code.${language}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export PNG failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Copie Image Presse-papier
  const copyImageToClipboard = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);

    try {
      const blob = await domToBlob(exportRef.current, { scale: 2 });
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Copy image failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-5xl mx-auto p-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 w-full p-4 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl shadow-xl text-white">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-lg text-indigo-400">
            <Code2 className="w-6 h-6" />
            <span>Syntax Code</span>
          </div>

          {/* Selector de Templates */}
          <div className="flex items-center gap-1.5 bg-zinc-800/80 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs">
            <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
            <select
              onChange={(e) => applyTemplate(e.target.value)}
              defaultValue="welcome"
              className="bg-transparent text-zinc-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="" disabled className="bg-zinc-900">Preset Templates...</option>
              {Object.entries(TEMPLATES).map(([key, t]) => (
                <option key={key} value={key} className="bg-zinc-900 text-white">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Langage */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Thème de syntaxe */}
          <select
            value={codeTheme}
            onChange={(e) => setCodeTheme(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
          >
            {CODE_THEMES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Switch Format Desktop / Mobile */}
          <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("desktop")}
              title="Desktop Format"
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                viewMode === "desktop"
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              title="Mobile Format"
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                viewMode === "mobile"
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          {/* Toggle Numéros de ligne */}
          <button
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            title="Toggle Line Numbers"
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              showLineNumbers
                ? "bg-indigo-600/20 border-indigo-500 text-indigo-400"
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white"
            }`}
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          {/* Sélection du fond */}
          <div className="flex items-center gap-1.5">
            {BACKGROUND_THEMES.map((t, idx) => (
              <button
                key={idx}
                onClick={() => setBgIndex(idx)}
                title={t.name}
                className={`w-6 h-6 rounded-full ${t.bg} border-2 transition-all cursor-pointer ${
                  bgIndex === idx
                    ? "border-white scale-110"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              />
            ))}
          </div>

          {/* Slider du Padding */}
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>Padding:</span>
            <input
              type="range"
              min="16"
              max="64"
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className="w-20 accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Bouton Partager (URL avec état) */}
          <button
            onClick={shareSnippet}
            title="Share Snippet Link"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition border border-zinc-700 cursor-pointer"
          >
            {shared ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4 text-indigo-400" />}
            <span>{shared ? "Link Copied!" : "Share"}</span>
          </button>

          {/* Bouton Copier l'image */}
          <button
            onClick={copyImageToClipboard}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition border border-zinc-700 disabled:opacity-50 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? <span className="text-green-400 font-medium">Copied!</span> : <span>Copy</span>}
          </button>

          {/* Bouton Télécharger PNG */}
          <button
            onClick={exportPNG}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {isExporting ? "Exporting..." : "PNG"}
          </button>
        </div>
      </div>

      {/* VUE CLIENT (Monaco Live) */}
      <div
        className={`transition-all duration-300 rounded-2xl ${BACKGROUND_THEMES[bgIndex].bg} shadow-2xl overflow-hidden ${
          viewMode === "mobile" ? "w-[380px]" : "w-full"
        }`}
        style={{ padding: `${padding}px` }}
      >
        <div className="bg-zinc-950/90 rounded-xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>

            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="text-xs font-mono text-zinc-400 bg-transparent text-center focus:outline-none focus:border-b border-zinc-600 px-1 py-0.5 w-36"
              placeholder="filename.ts"
            />

            <div className="w-12" />
          </div>

          <div className="py-2">
            <DynamicEditor
              height="350px"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: showLineNumbers ? "on" : "off",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 12 },
              }}
            />
          </div>
        </div>
      </div>

      {/* VUE EXPORT (Shiki HTML) */}
      <div style={{ position: "fixed", left: "-9999px", top: "-9999px" }} aria-hidden="true">
        <div
          ref={exportRef}
          className={`rounded-2xl ${BACKGROUND_THEMES[bgIndex].bg} ${
            viewMode === "mobile" ? "w-[380px]" : "w-[800px]"
          }`}
          style={{ padding: `${padding}px` }}
        >
          <div className="bg-zinc-950/90 rounded-xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>

              <span className="text-xs font-mono text-zinc-400">
                {filename || `syntax-code.${language}`}
              </span>

              <div className="w-12" />
            </div>

            <div
              className="p-4 font-mono text-sm overflow-x-auto [&_pre]:bg-transparent! [&_code]:bg-transparent!"
              dangerouslySetInnerHTML={{ __html: shikiHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}