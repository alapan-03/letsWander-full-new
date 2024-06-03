
exports.deleteDoc = Model => {
    return async (req, res, next) => {
        try{
            const doc = await Model.findByIdAndDelete(req.params.id);
    
            res.status(200).json({
                status:"success",
                doc
            })
        }
        catch(err){
            res.status(500).json({
                status: "fail",
                message: "Unable to delete document"
            })
        }   
    }
}


exports.updateDoc = Model => {
    return async (req, res) => {
    try{
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(201).json({
            status: "success",
            doc
        })
    }
    catch(err){
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
}
}


exports.createDoc = Model => {
    return async (req, res) => {
        try{
            let doc = await Model.create(req.body);
    
            res.status(201).json({
                doc
            })
        }
        catch(err){
            console.log(err);
        }
    }
}