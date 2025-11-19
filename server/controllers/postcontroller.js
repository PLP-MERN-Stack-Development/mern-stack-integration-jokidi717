const Post = require('../models/Post');

exports.createPost = async (req,res)=>{
  try {
    const {title, content, image} = req.body;
    const post = new Post({ title, content, image, author: req.user });
    await post.save();
    res.json(post);
  } catch(err){
    console.error(err);
    res.status(500).json({ message:'Server Error' });
  }
};

exports.getPosts = async (req,res)=>{
  try {
    const posts = await Post.find().populate('author','name').sort({createdAt:-1});
    res.json(posts);
  } catch(err){
    res.status(500).json({ message:'Server Error' });
  }
};

exports.getPost = async (req,res)=>{
  try {
    const post = await Post.findById(req.params.id).populate('author','name');
    if(!post) return res.status(404).json({ message:'Post not found' });
    res.json(post);
  } catch(err){
    res.status(500).json({ message:'Server Error' });
  }
};

exports.updatePost = async (req,res)=>{
  try {
    let post = await Post.findById(req.params.id);
    if(!post) return res.status(404).json({ message:'Post not found' });
    if(post.author.toString() !== req.user) return res.status(403).json({ message:'Not allowed' });

    post = await Post.findByIdAndUpdate(req.params.id, req.body, { new:true });
    res.json(post);
  } catch(err){
    res.status(500).json({ message:'Server Error' });
  }
};

exports.deletePost = async (req,res)=>{
  try {
    const post = await Post.findById(req.params.id);
    if(!post) return res.status(404).json({ message:'Post not found' });
    if(post.author.toString() !== req.user) return res.status(403).json({ message:'Not allowed' });

    await post.deleteOne();
    res.json({ message:'Deleted' });
  } catch(err){
    res.status(500).json({ message:'Server Error' });
  }
};
