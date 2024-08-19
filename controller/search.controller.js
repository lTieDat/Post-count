const Post = require('../models/post.model');

// [GET] /search
// using index in mongoDB but not optimized
// module.exports.index = async (req, res) => {
//     const keyword = req.query.query;

//     if (!keyword) {
//         return res.render('pages/search', {
//             keyword: '',
//             totalPosts: 0,
//             userPostCount: {},
//             posts: []
//         });
//     }

//     try {
//         const regexPattern = `\\b${keyword}\\b`; // Word boundary to match exact words
//         const postQuery = await Post.aggregate([
//             {
//                 $match: {
//                     $text: { $search: keyword }
//                 }
//             },
//             {
//                 $addFields: {
//                     score: { $meta: "textScore" },
//                     keywordCount: {
//                         $sum: [
//                             {
//                                 $size: {
//                                     $regexFindAll: {
//                                         input: "$title",
//                                         regex: regexPattern,
//                                         options: "i"
//                                     }
//                                 }
//                             },
//                             {
//                                 $size: {
//                                     $regexFindAll: {
//                                         input: "$body",
//                                         regex: regexPattern,
//                                         options: "i"
//                                     }
//                                 }
//                             }
//                         ]
//                     }
//                 }
//             },
//             {
//                 $sort: { keywordCount: -1, score: -1 }
//             },
//             {
//                 $group: {
//                     _id: "$userId",
//                     posts: { $push: "$$ROOT" },
//                     count: { $sum: 1 }
//                 }
//             },
//             {
//                 $project: {
//                     posts: 1,
//                     count: 1
//                 }
//             }
//         ]);

//         let totalPosts = 0;
//         let userPostCount = {};
//         let posts = [];

//         postQuery.forEach(group => {
//             userPostCount[group._id] = group.count;
//             totalPosts += group.count;
//             posts = posts.concat(group.posts);
//         });

//         res.render('pages/search', {
//             keyword: keyword,
//             totalPosts: totalPosts,
//             userPostCount: userPostCount,
//             posts: posts
//         });

//     } catch (err) {
//         console.error('Error fetching posts:', err);
//         res.status(500).send('Internal Server Error');
//     }
// };

// normal search
module.exports.index = async (req, res) => {
    const keyword = req.query.query;
    let posts = [];
    let totalPosts = 0;
    let userPostCount = {};

    if (keyword) {
        const regex = new RegExp(keyword, "i");

        // Tìm kiếm các bài viết có chứa từ khóa trong title hoặc body
        const postQuery = await Post.find({
            $or: [
                { title: regex },
                { body: regex }
            ]
        });

        // Tính toán tổng số lượng bài viết
        totalPosts = postQuery.length;

        // Tính toán số lượng bài viết theo user
        postQuery.forEach(post => {
            if (!userPostCount[post.userId]) {
                userPostCount[post.userId] = 0;
            }
            userPostCount[post.userId]++;
        });

        // Đếm số lượng từ khóa trong từng bài viết và xác định vị trí của từ khóa (title, body, hoặc cả hai)
        posts = postQuery.map(post => {
            const titleMatch = (post.title.match(regex) || []).length;
            const bodyMatch = (post.body.match(regex) || []).length;

            const keywordCount = titleMatch + bodyMatch;
            let foundIn = [];

            if (titleMatch > 0) foundIn.push('title');
            if (bodyMatch > 0) foundIn.push('body');

            return {
                ...post.toObject(),
                keywordCount,
                foundIn: foundIn.join(', ') // Example: "title, body"
            };
        }).sort((a, b) => b.keywordCount - a.keywordCount);
    }

    // Render kết quả tìm kiếm ra giao diện
    res.render('pages/search', {
        keyword: keyword,
        totalPosts: totalPosts,
        userPostCount: userPostCount,
        posts: posts
    });
};
