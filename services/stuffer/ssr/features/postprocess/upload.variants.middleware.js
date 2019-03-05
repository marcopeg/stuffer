/**
 * Prepare the file variants meta informations to be stored along with
 * the resource meta.
 * 
 * The task files will be created at a latter stage.
 */

import { processorIsValid, processorGetFileName } from './processors'
import { hashFileName } from 'lib/hash-file-name'

export default settings => ({
    name: 'postprocess',
    priority: 580,
    handler: (req, res, next) => {
        // walk through every uploaded files
        Object.values(req.data.upload.form.files)
            .map(file => {

                // @TODO: postprocess rules can be specified by:
                // - app level
                // - space level
                // - auth token level
                // - file level

                // walk through every applicable rule
                settings.postprocess.rules
                    .filter(rule => processorIsValid(rule.apply))
                    .filter(rule => RegExp(rule.match, 'g').test(file.fileName))
                    .map(rule => {
                        const fileName = processorGetFileName(rule.apply, file)
                        file.variants.push({
                            rule: rule.apply,
                            fileName,
                            fileNameHashed: hashFileName(fileName),
                            options: rule.options,
                        })
                    })
            })

        next()
    },
})
