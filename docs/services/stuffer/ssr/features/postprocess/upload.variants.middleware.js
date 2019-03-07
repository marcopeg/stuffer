/**
 * Prepare the file variants meta informations to be stored along with
 * the resource meta.
 * 
 * The task files will be created at a latter stage.
 */

import extend from 'extend'
import { processorIsValid, processorGetFileName } from './processors'
import { hashFileName } from 'lib/hash-file-name'

export default settings => ({
    name: 'postprocess',
    priority: 580,
    handler: (req, res, next) => {
        // walk through every uploaded files
        Object.values(req.data.upload.form.files)
            .map(file => {
                // Compose the postprocess rules for the file
                // - global
                // - space
                // - resouce
                let globalSettings = {}
                let spaceSettings = {}
                let resourceSettings = {}
                try {
                    globalSettings = settings.stuffrc.postprocess
                } catch (err) {}
                try {
                    spaceSettings = settings.stuffrc.spaces[file.space].postprocess
                } catch (err) {}
                try {
                    resourceSettings = req.data.upload.form.fields[`${file.field}_meta`].postprocess
                } catch (err) {}
                const rulesMap = extend(true, {}, globalSettings, spaceSettings, resourceSettings)

                // walk through every applicable rule
                Object.values(rulesMap)
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
