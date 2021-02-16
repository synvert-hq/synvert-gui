export const sortSnippets = (snippets) =>
    snippets.sort((a, b) => {
        if (`${a.group}/${a.name}` < `${b.group}/${b.name}`) return -1
        if (`${a.group}/${a.name}` > `${b.group}/${b.name}`) return 1
        return 0
    })

export const searchSnippets = (snippets, term) =>
    snippets.filter(snippet => `${snippet.group}/${snippet.name}`.includes(term))