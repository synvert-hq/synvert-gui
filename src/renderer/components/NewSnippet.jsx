import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import AppContext from "../context";
import { host, log } from '../utils'
import { SET_LOADING, SET_NEW_SNIPPET } from "../constants";

export default () => {
  const { dispatch } = useContext(AppContext);
  const [inputOutputCount, setInputOutputCount] = useState(1);
  const [snippetContent, setSnippetContent] = useState("");
  const [snippetError, setSnippetError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const composeNewSnippet = (data, result) => {
    let newSnippet = "Synvert::Rewriter.execute do\n";
    if (data.rubyVersion) {
      newSnippet += `  if_ruby '${data.rubyVersion}'\n`;
    }
    if (data.gemVersion) {
      const index = data.gemVersion.indexOf(" ");
      const name = data.gemVersion.substring(0, index);
      const version = data.gemVersion.substring(index + 1);
      newSnippet += `  if_gem '${name}', '${version}'\n`;
    }
    newSnippet += `  within_files '${data.filePattern}' do\n`;
    if (result.snippet) {
      newSnippet += "    ";
      newSnippet += result.snippet.replace(/\n/g, "\n    ");
      newSnippet += "\n";
    }
    newSnippet += "  end\n";
    newSnippet += "end";
    return newSnippet;
  };

  const updateNewSnippet = (snippetContent) => {
    setSnippetContent(snippetContent);
    dispatch({
      type: SET_NEW_SNIPPET,
      newSnippet: snippetContent,
    });
  }

  const onSubmit = async (data) => {
    dispatch({ type: SET_LOADING, loading: true, loadingText: "Submitting..." });
    const { inputs, outputs } = data;
    try {
      const response = await fetch(`${host()}/api/v1/call`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs, outputs }),
      });
      const result = await response.json();
      if (result.error) {
        setSnippetError('Failed to generate snippet');
        log(result.error);
        updateNewSnippet('');
      } else if (!result.snippet) {
        setSnippetError('Failed to generate snippet');
      } else {
        setSnippetError('');
        updateNewSnippet(composeNewSnippet(data, result));
      }
    } catch (error) {
      setSnippetError('Failed to generate snippet');
      log(error.message);
      updateNewSnippet('');
    }
    dispatch({ type: SET_LOADING, loading: false });
  };

  const addInputOutput = (e) => {
    e.preventDefault();
    setInputOutputCount(inputOutputCount + 1);
  };

  const removeInputOutput = (e) => {
    e.preventDefault();
    setInputOutputCount(inputOutputCount - 1);
  };

  return (
    <div className="new-snippet container-fluid flex-grow-1">
      <h4 className="text-center">New Snippet</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>File Pattern:</label>
          <input
            className={`form-control ${errors.filePattern && "is-invalid"}`}
            defaultValue="**/*.rb"
            {...register("filePattern", { required: true })}
          />
          {errors.filePattern && (
            <div className="invalid-feedback">required</div>
          )}
        </div>
        <div className="form-group">
          <label>Minimum Ruby Version:</label>
          <input
            className={`form-control ${errors.rubyVersion && "is-invalid"}`}
            placeholder="e.g. 2.4.5"
            {...register("rubyVersion", { pattern: /\d\.\d\.\d/ })}
          />
          {errors.rubyVersion && (
            <div className="invalid-feedback">format is incorrect</div>
          )}
        </div>
        <div className="form-group">
          <label>Gem Version:</label>
          <input
            className={`form-control ${errors.gemVersion && "is-invalid"}`}
            placeholder="e.g. rails ~> 5.0.0"
            {...register("gemVersion", { pattern: /\w+\ / })}
          />
          {errors.gemVersion && (
            <div className="invalid-feedback">format is incorrect</div>
          )}
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label>Inputs</label>
          </div>
          <div className="form-group col-md-6">
            <label>Outputs</label>
          </div>
        </div>
        {[...Array(inputOutputCount)].map((_i, index) => (
          <div className="form-row" key={index}>
            <div className="form-group col-md-6">
              <textarea
                className="form-control"
                rows="3"
                placeholder="FactoryBot.create(:user)"
                {...register(`inputs.${index}`)}
              ></textarea>
            </div>
            <div className="form-group col-md-6">
              <textarea
                className="form-control"
                rows="3"
                placeholder="create(:user)"
                {...register(`outputs.${index}`)}
              ></textarea>
              {index > 0 && (<button className="btn btn-link float-right" onClick={removeInputOutput}>x</button>)}
            </div>
          </div>
        ))}
        <div className="form-group d-flex justify-content-between">
          <button className="btn btn-link" onClick={addInputOutput}>
            Add More Input/Output
          </button>
          <input
            className="btn btn-primary"
            type="submit"
            value="Generate Snippet"
          />
        </div>
        <div className="form-group">
          {snippetError.length > 0 && (<div className="text-danger">{snippetError}</div>)}
          <textarea
            className="form-control"
            rows="10"
            value={snippetContent}
            onChange={(e) => setSnippetContent(e.target.value)}
            onBlur={(e) => updateNewSnippet(e.target.value)}
          ></textarea>
        </div>
      </form>
    </div>
  );
};
