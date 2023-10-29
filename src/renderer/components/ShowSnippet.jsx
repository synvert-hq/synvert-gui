import React, { useContext, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";

import ShowCodeModal from "./ShowCodeModal";
import AppContext from "../context";
import { SET_SHOW_FORM } from "../constants";

const CodeBlock = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" {...props}>
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

export default () => {
  const [showCode, setShowCode] = useState(false);
  const { language, snippetsStore, currentSnippetId, dispatch } = useContext(AppContext);

  const snippet = snippetsStore[currentSnippetId];

  if (!snippet) return null;

  const close = () => {
    setShowCode(false);
  };

  const edit = () => {
    dispatch({ type: SET_SHOW_FORM, showForm: true });
  };

  return (
    <>
      <div className="snippet-show container-fluid flex-grow-1">
        <button className="btn btn-primary float-right" onClick={() => setShowCode(true)}>
          Show Source Code
        </button>
        <button className="btn btn-primary float-right mr-2" onClick={edit}>
          Edit
        </button>
        <h2>{snippet.id}</h2>
        <div className="float-right">
          {snippet.ruby_version && <span className="badge badge-info">ruby {snippet.ruby_version}</span>}
          {snippet.gem_spec && (
            <span className="badge badge-info">
              {snippet.gem_spec.name} {snippet.gem_spec.version}
            </span>
          )}
        </div>
        <div>
          <ReactMarkdown rehypePlugins={[rehypeRaw]} components={CodeBlock}>
            {snippet.description}
          </ReactMarkdown>
        </div>
        <ul>
          {snippet.sub_snippets.map((subSnippet) => {
            const snippet = snippetsStore[`${subSnippet.group}/${subSnippet.name}`];
            return (
              <li key={snippet.id}>
                <h4>{snippet.id}</h4>
                <div>
                  <ReactMarkdown rehypePlugins={[rehypeRaw]} components={CodeBlock}>
                    {snippet.description}
                  </ReactMarkdown>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      {showCode && <ShowCodeModal snippet={snippet} language={language} close={close} />}
    </>
  );
};
