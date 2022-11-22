import React, { useContext, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import AppContext from "../context";
import { baseUrl, log } from '../utils'
import { SET_LOADING, SET_GENERATED_SNIPPET } from "../constants";
import { useEffect } from "react";

export default () => {
  const { dispatch, snippetCode } = useContext(AppContext);
  const [code, setCode] = useState("")
  const [snippetError, setSnippetError] = useState("");
  const { register, control, handleSubmit, formState: { errors } } = useForm({ defaultValues: { inputs_outputs: [{ input: '', output: '' }] } });
  const { fields, append, remove } = useFieldArray({ control, name: 'inputs_outputs' });

  useEffect(() => {
    setCode(snippetCode);
  }, [snippetCode])

  const composeGeneratedSnippet = (data, result) => {
    let generatedSnippet = "Synvert::Rewriter.new 'group', 'name' do\n";
    if (data.rubyVersion) {
      generatedSnippet += `  if_ruby '${data.rubyVersion}'\n`;
    }
    if (data.gemVersion) {
      const index = data.gemVersion.indexOf(" ");
      const name = data.gemVersion.substring(0, index);
      const version = data.gemVersion.substring(index + 1);
      generatedSnippet += `  if_gem '${name}', '${version}'\n`;
    }
    generatedSnippet += `  within_files '${data.filePattern}' do\n`;
    if (result.snippet) {
      generatedSnippet += "    ";
      generatedSnippet += result.snippet.replace(/\n/g, "\n    ");
      generatedSnippet += "\n";
    }
    generatedSnippet += "  end\n";
    generatedSnippet += "end";
    return generatedSnippet;
  };

  const updateSnippetCode = (snippetCode) => {
    dispatch({
      type: SET_GENERATED_SNIPPET,
      snippetCode,
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
        updateSnippetCode('');
      } else if (!result.snippet) {
        setSnippetError('Failed to generate snippet');
        updateSnippetCode('');
      } else {
        setSnippetError('');
        updateSnippetCode(composeGeneratedSnippet(data, result));
      }
    } catch {
      setSnippetError('Failed to send request, please check your network setting.');
      updateSnippetCode('');
    }
    dispatch({ type: SET_LOADING, loading: false });
  };

  return (
    <div className="snippet-form">
      <div className="new-snippet container-fluid flex-grow-1">
        <h4 className="text-center">Generate Snippet</h4>
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
            <div className="form-row" key={item.id}>
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
            <div>
              <button type="button" className="btn btn-link" onClick={() => append({ input: '', output: '' })}>
                Add More Input/Output
              </button>
              <button type="button" className="btn btn-link" onClick={() => remove(fields.length - 1)}>
                Remove Last Input/Output
              </button>
            </div>
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
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onBlur={(e) => updateSnippetCode(e.target.value)}
            ></textarea>
          </div>
        </form>
      </div>
    </div>
  );
};
