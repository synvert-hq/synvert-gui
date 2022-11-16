import React, { useContext, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import AppContext from "../context";
import { baseUrl, log } from '../utils'
import { SET_LOADING, SET_CUSTOM_SNIPPET } from "../constants";

export default () => {
  const { dispatch, snippetsStore, currentSnippetId, form } = useContext(AppContext);
  const snippet = currentSnippetId ? snippetsStore[currentSnippetId] : {};
  console.log('snippet', snippet)
  const [snippetError, setSnippetError] = useState("");
  const { register, control, handleSubmit, formState: { errors } } = useForm({ defaultValues: { inputs_outputs: [{ input: '', output: '' }] } });
  const { fields, append, remove } = useFieldArray({ control, name: 'inputs_outputs' });

  const composeCustomSnippet = (data, result) => {
    let customSnippet = "Synvert::Rewriter.execute do\n";
    if (data.rubyVersion) {
      customSnippet += `  if_ruby '${data.rubyVersion}'\n`;
    }
    if (data.gemVersion) {
      const index = data.gemVersion.indexOf(" ");
      const name = data.gemVersion.substring(0, index);
      const version = data.gemVersion.substring(index + 1);
      customSnippet += `  if_gem '${name}', '${version}'\n`;
    }
    customSnippet += `  within_files '${data.filePattern}' do\n`;
    if (result.snippet) {
      customSnippet += "    ";
      customSnippet += result.snippet.replace(/\n/g, "\n    ");
      customSnippet += "\n";
    }
    customSnippet += "  end\n";
    customSnippet += "end";
    return customSnippet;
  };

  const updateCustomSnippet = (snippetContent) => {
    setSnippetContent(snippetContent);
    dispatch({
      type: SET_CUSTOM_SNIPPET,
      customSnippet: snippetContent,
    });
  }

  const onSubmit = async (data) => {
    dispatch({ type: SET_LOADING, loading: true, loadingText: "Submitting..." });
    const { inputs_outputs } = data;
    const inputs = inputs_outputs.map(input_output => input_output.input);
    const outputs = inputs_outputs.map(input_output => input_output.output);
    try {
      const response = await fetch(`${baseUrl()}/generate-snippet`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-SYNVERT-TOKEN": window.electronAPI.getToken(),
          "X-SYNVERT-PLATFORM": "gui",
        },
        body: JSON.stringify({ inputs, outputs }),
      });
      const result = await response.json();
      if (result.error) {
        setSnippetError(result.error);
        log(result.error);
        updateCustomSnippet('');
      } else if (!result.snippet) {
        setSnippetError('Failed to generate snippet');
        updateCustomSnippet('');
      } else {
        setSnippetError('');
        updateCustomSnippet(composeCustomSnippet(data, result));
      }
    } catch {
      setSnippetError('Failed to send request, please check your network setting.');
      updateCustomSnippet('');
    }
    dispatch({ type: SET_LOADING, loading: false });
  };

  const title = form === "new" ? "New Snippet" : "Edit Snippet";

  return (
    <>
      <div className="new-snippet container-fluid flex-grow-1">
        <h4 className="text-center">{title}</h4>
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
              <a href="https://synvert.net/how_to_write_inputs_outputs" className="float-right" target="_blank">How to write inputs/outpus?</a>
              <label>Outputs</label>
            </div>
          </div>
          {fields.map((item, index) => (
            <div className="form-row position-relative" key={item.id}>
              {index > 0 && (<button type="button" className="btn btn-link remove-btn position-absolute" onClick={() => remove(index)}>x</button>)}
              <div className="form-group col-md-6">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="FactoryBot.create(:user)"
                  {...register(`inputs_outputs.${index}.input`)}
                ></textarea>
              </div>
              <div className="form-group col-md-6">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="create(:user)"
                  {...register(`inputs_outputs.${index}.output`)}
                ></textarea>
              </div>
            </div>
          ))}
          <div className="form-group d-flex justify-content-between">
            <button type="button" className="btn btn-link" onClick={() => append({ input: '', output: '' })}>
              Add More Input/Output
            </button>
            <input
              className="btn btn-primary"
              type="submit"
              value="Generate Snippet"
            />
          </div>
          <div className="form-group">
            {snippetError !== '' && (<span className="text-danger">{snippetError}</span>)}
            <textarea
              className="form-control"
              rows="10"
              value={snippet.source_code}
              onChange={(e) => setSnippetContent(e.target.value)}
              onBlur={(e) => updateCustomSnippet(e.target.value)}
            ></textarea>
          </div>
        </form>
      </div>
    </>
  );
};
