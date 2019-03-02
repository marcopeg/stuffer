/**
 * Keeps track of the processors that are defined in the system.
 */

const state = {
    rules: [], // keep track of the registered names, for fast search
    processors: {}, // map a processor's name to its handler
}

export const registerProcessor = (processor) => {
    state.rules.push(processor.name)
    state.processors[processor.name] = processor
}

export const processorIsValid = name => state.rules.includes(name)

export const processorGetFileName = (name, file) =>
    state.processors[name].fileName(file)
