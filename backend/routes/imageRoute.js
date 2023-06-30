const router = require('express').Router();
const Image = require("../module/image");
const cloudinary = require('../config/cloudinary');
// const Image = require('../module/image');

router.get('/',(req,res)=>{
    Image.find().then((img)=>{
        res.json(img)
    }).catch((err)=>{
        res.status(500).json({error:"error"});
    })
})

router.post('/addImage',async (req,res)=>{
    const {image} = req.body;
try {
    
       const result = await cloudinary.uploader.upload(image,{
        folder:'gamindu'
       })
    //    .then((res)=>{
    
    //     const newImage = await new Image({url:result.secure_url});
    //    const imageResult=Image.findOneAndUpdate({ $set: { url: result.secure_url } });
       
    //    .then((img)=>{

    //    })
        const deletDoc = await Image.deleteMany();

        const newImage = await Image.create({
                url: result.secure_url
        });
        res.status(201).json(newImage);
} catch (error) {
    console.log(error)
    res.status(500).json({error:"error"})
}

    // newImage.save()
//     .then((respon)=>{
//         res.status(201).json(newImage)
//     }).catch((err)=>{
//         res.status(500).json({error:"error"});
//     })
//    }).catch((errr)=>{
//     res.status(500).json({error:"error"});
//    });

})

module.exports =router;