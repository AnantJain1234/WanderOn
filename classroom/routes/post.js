const express = require("express");
const router = express.Router();

//posts
//index -
router.get("/",(req,res)=>{
    res.send("GET for show posts");
});

//show
router.get("/:id",(req,res)=>{
    res.send("GET for posts id");
});

//post
router.post("/",(req,res)=>{
    res.send("POST for posts");
});

//DELETE 
router.delete("/:id",(req,res)=>{
    res.send("DELETE for postsid");
});

module.exports = router;