import React, { useState } from 'react'

export default () => {
    const [filePattern, setFilePattern] = useState('**/*.rb')
    const [rubyVersion, setRubyVersion] = useState('')
    const [gemVersion, setGemVersion] = useState('')
    const [inputOutputCount, setInputOutputCount] = useState(1)
    const [inputs, setInputs] = useState([''])
    const [outputs, setOutputs] = useState([''])
    const [snippetContent, setSnippetContent] = useState('')

    const addMoreInputOutput = () => {
        setInputOutputCount(inputOutputCount + 1)
    }

    const setInput = (index, value) => {
        inputs[index] = value
        setInputs([...inputs])
    }

    const setOutput = (index, value) => {
        outputs[index] = value
        setOutputs([...outputs])
    }

    const generateSnippet = async () => {
        const response = await fetch('https://synvert.xinminlabs.com/api/v1/call', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs, outputs })
        })
        const result = await response.json()
        let newSnippet = "Synvert::Rewriter.execute do\n"
        if (result.snippet) {
            newSnippet += "  "
            newSnippet += result.snippet.replace(/\n/g, "\n  ")
            newSnippet += "\n"
        }
        newSnippet += "end"
        setSnippetContent(newSnippet)
        return false
    }

    return (
        <div className="new-snippet container-fluid">
            <h4 className="text-center">New Snippet</h4>
            <form onSubmit={e => e.preventDefault()}>
                <div className="form-group">
                    <label>File Pattern:</label>
                    <input className="form-control" value={filePattern} onChange={e => setFilePattern(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Ruby Version:</label>
                    <input className="form-control" value={rubyVersion} placeholder=">= 2.4.5" onChange={e => setRubyVersion(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Gem Version:</label>
                    <input className="form-control" value={gemVersion} placeholder="rails ~> 5.0.0" onChange={e => setGemVersion(e.target.value)} />
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
                                <textarea className="form-control" rows="3" placeholder="FactoryBot.create(:user)" onChange={e => setInput(index, e.target.value)} value={inputs[index]}></textarea>
                            </div>
                            <div className="form-group col-md-6">
                                <textarea className="form-control" rows="3" placeholder="create(:user)" onChange={e => setOutput(index, e.target.value)} value={outputs[index]}></textarea>
                            </div>
                        </div>
                    ))
                }
                <div className="form-group d-flex justify-content-between">
                    <button className="btn btn-link" onClick={addMoreInputOutput}>Add More Input/Output</button>
                    <button className="btn btn-primary" onClick={generateSnippet}>Generate Snippet</button>
                </div>
                <div className="form-group">
                    <textarea className="form-control" rows="5" value={snippetContent} onChange={e => setSnippetContent(e.target.value)}></textarea>
                </div>
            </form>
        </div>
    )
}