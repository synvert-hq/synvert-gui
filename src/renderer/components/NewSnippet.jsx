import React, { useState } from 'react'
import { useForm } from "react-hook-form";

export default () => {
    const [inputOutputCount, setInputOutputCount] = useState(1)
    const [snippetContent, setSnippetContent] = useState('')
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const composeNewSnippet = (data, result) => {
        let newSnippet = "Synvert::Rewriter.execute do\n"
        if (data.rubyVersion) {
            newSnippet += `  if_ruby '${data.rubyVersion}'\n`
        }
        if (data.gemVersion) {
            const index = data.gemVersion.indexOf(' ')
            const name = data.gemVersion.substring(0, index)
            const version = data.gemVersion.substring(index+ 1)
            newSnippet += `  if_gem '${name}', '${version}'\n`
        }
        newSnippet += `  within_files '${data.filePattern}' do\n`
        if (result.snippet) {
            newSnippet += "  "
            newSnippet += result.snippet.replace(/\n/g, "\n    ")
            newSnippet += "\n"
        }
        newSnippet += "  end\n"
        newSnippet += "end"
        return newSnippet
    }

    const onSubmit = async(data) => {
        const { inputs, outputs } = data
        const response = await fetch('https://synvert.xinminlabs.com/api/v1/call', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs, outputs })
        })
        const result = await response.json()
        setSnippetContent(composeNewSnippet(data, result))
    }

    const addMoreInputOutput = (e) => {
        e.preventDefault()
        setInputOutputCount(inputOutputCount + 1)
    }

    return (
        <div className="new-snippet container-fluid flex-grow-1">
            <h4 className="text-center">New Snippet</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>File Pattern:</label>
                    <input className="form-control" defaultValue="**/*.rb" {...register("filePattern", { required: true })} />
                </div>
                <div className="form-group">
                    <label>Minimum Ruby Version:</label>
                    <input className="form-control" placeholder="e.g. 2.4.5" {...register("rubyVersion")} />
                </div>
                <div className="form-group">
                    <label>Gem Version:</label>
                    <input className="form-control" placeholder="e.g. rails ~> 5.0.0" {...register("gemVersion")} />
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label>Inputs</label>
                    </div>
                    <div className="form-group col-md-6">
                        <label>Outputs</label>
                    </div>
                </div>
                {
                    [...Array(inputOutputCount)].map((_i, index) => (
                        <div className="form-row" key={index}>
                            <div className="form-group col-md-6">
                                <textarea className="form-control" rows="3" placeholder="FactoryBot.create(:user)" {...register(`inputs.${index}`)}></textarea>
                            </div>
                            <div className="form-group col-md-6">
                                <textarea className="form-control" rows="3" placeholder="create(:user)" {...register(`outputs.${index}`)}></textarea>
                            </div>
                        </div>
                    ))
                }
                <div className="form-group d-flex justify-content-between">
                    <button className="btn btn-link" onClick={addMoreInputOutput}>Add More Input/Output</button>
                    <input className="btn btn-primary" type="submit" value="Generate Snippet" />
                </div>
                <div className="form-group">
                    <textarea className="form-control" rows="5" value={snippetContent} onChange={e => setSnippetContent(e.target.value)}></textarea>
                </div>
            </form>
        </div>
    )
}