
export const uploadRoute = options => (req, res) => {
    console.log(req.data.upload)
    res.send(req.data.upload)
}
