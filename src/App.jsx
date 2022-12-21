import { useState, useEffect, useRef } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import html2canvas from "html2canvas";

import themes from "./themes";
import _languages from "./languages";

function themesNames(obj) {
    let _names = [];
    for (let [key] of Object.entries(obj)) {
        _names.push(key);
    }
    return _names;
}

const __STORAGE_KEY = "__STORAGE_KEY";

function getSittings(key) {
    let raw_data = localStorage.getItem(__STORAGE_KEY);
    if (!raw_data) return null;
    let data = JSON.parse(raw_data);
    return data[key];
}

export default function App() {
    const [availableTheme] = useState(() => themesNames(themes));
    const [currentTheme, setCurrentTheme] = useState(() => {
        return getSittings("currentTheme") || "anOldHope";
    });
    const [code, setCode] = useState(() => {
        return getSittings("code") || "let x = 'cool';";
    });
    const [showLineNumber, setShowLineNumber] = useState(() => {
        return getSittings("showLineNumber") ?? true;
    });
    const [tabSize, setTabSize] = useState(() => {
        return getSittings("tabSize") || "    ";
    });
    const [language, setLanguage] = useState(() => {
        return getSittings("language") || "javascript";
    });

    const codeBlock = useRef();

    useEffect(() => {
        localStorage.setItem(
            __STORAGE_KEY,
            JSON.stringify({
                currentTheme,
                language,
                tabSize,
                code,
                showLineNumber,
            })
        );
    }, [language, tabSize, code, currentTheme, showLineNumber]);

    function takeSnapShootOfCodeBlok() {
        let block = document.querySelector(".code-box");
        let isEl = block instanceof HTMLElement;
        if (!isEl) return;
        html2canvas(block, {
            allowTaint: true,
            useCORS: true,
        })
            .then((canvas) => {
                let imagePath = canvas.toDataURL("image/png", 1);
                download(imagePath);
            })
            .catch((err) => console.log(err));
    }

    function download(path) {
        let downloadBtn = document.createElement("a");
        downloadBtn.setAttribute("href", path);
        downloadBtn.setAttribute("download", Date.now().toString());
        document.body.appendChild(downloadBtn);
        downloadBtn.click();
        downloadBtn.remove();
    }

    return (
        <div className="wrapper">
            <header className="header">
                <div className="select-group">
                    <label htmlFor="theme">Theme</label>
                    <select
                        id="theme"
                        value={currentTheme}
                        onChange={({ target: { value } }) =>
                            setCurrentTheme(value)
                        }
                    >
                        {availableTheme.map((name, i) => (
                            <option key={i} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="select-group">
                    <label htmlFor="language">Language</label>
                    <select
                        id="language"
                        value={language}
                        onChange={({ target: { value } }) => setLanguage(value)}
                    >
                        {_languages.map((lang, i) => (
                            <option key={i} value={lang}>
                                {lang}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="select-group">
                    <label htmlFor="tab-size">Tab size</label>
                    <select
                        id="tab-size"
                        value={tabSize}
                        onChange={({ target: { value } }) => setTabSize(value)}
                    >
                        <option value="  ">2</option>
                        <option value="    ">4</option>
                        <option value="      ">6</option>
                    </select>
                </div>
                <div className="select-group">
                    <label htmlFor="show-line-number">Show Line Number</label>
                    <input
                        id="show-line-number"
                        type="checkbox"
                        onChange={({ target: { checked } }) =>
                            setShowLineNumber(checked)
                        }
                        checked={showLineNumber}
                    />
                </div>
            </header>
            <textarea
                onKeyDown={(e) => {
                    let t = e.currentTarget;
                    if (e.keyCode === 9) {
                        e.preventDefault();
                        t.setRangeText(
                            tabSize,
                            t.selectionStart,
                            t.selectionStart,
                            "end"
                        );
                    }
                }}
                value={code}
                onInput={(e) => setCode(e.target.value)}
            ></textarea>
            <div
                ref={codeBlock}
                className="code-box"
                style={{
                    margin: "1.5rem 0",
                    // borderRadius: "10px",
                    overflow: "hidden",
                    tabSize: tabSize.length,
                    background: "transparent",
                }}
            >
                <SyntaxHighlighter
                    showLineNumbers={showLineNumber}
                    language={language}
                    style={themes[currentTheme]}
                >
                    {code}
                </SyntaxHighlighter>
            </div>

            <button onClick={takeSnapShootOfCodeBlok}>
                Snap the Code dude 😎
            </button>
        </div>
    );
}
