import { useEffect } from "react";
import '../stylesheets/Postpage.css';
import { formatDate, getNumofCommsofPost } from "./utils.js";

export default function Postpage({ post, communities, linkflairs, comments, increaseviewcount, goToNewCommentPage }) {
    console.log(post.commentIDs);
    //automatically increases view count when componenet is mounted
    useEffect(() => {
        increaseviewcount(post);
    }, []);

    const postcomments = [];
    for (const comID of post.commentIDs) {
        const temp = comments.find(c => c._id.toString() === comID);
        if (temp) {
            postcomments.push(temp);
        }
    }
    postcomments.sort((a,b) => new Date(b.commentedDate) - new Date(a.commentedDate));

    const flair = linkflairs.find(f => f.linkFlairID === post.linkFlairID);
    const community = communities.find(c => c.postIDs.includes(post._id));

    return (
        <div className="post-page">
            <div className="post-community-time">
                {community ? community.name : "Unknown"}   |   {formatDate(post.postedDate)}
            </div>

            <div className="post-username">
                Posted by {post.postedBy}
            </div>

            <h1 className="post-title">
                {post.title}
            </h1>

            {flair && <div className="post-link-flair">{flair.content}</div>}

            <p className="post-content" >
                {post.content}
            </p>

            <div className="post-num-viewscomms">
                Views: {post.views} | Comments: {getNumofCommsofPost(post, comments)}
            </div>

            <button className="comment-button" onClick={() => goToNewCommentPage(post._id, "false", post)}>
                Comment
            </button>

            <hr className="post-delimiter" />

            <div className="comment-list">
                {postcomments.map(comm => 
                    <Comment key={comm.commentID} comment={comm} comments={comments} level={0} goToNewCommentPage={goToNewCommentPage} post={post}/>
                )}
            </div>
        </div>
    );
}

function Comment({ comment, comments, goToNewCommentPage, level, post }) {
    const replies = [];
    for (const comID of comment.commentIDs) {
        const temp = comments.find(c => c._id.toString() === comID);
        if (temp) {
            replies.push(temp);
        }
    }
    replies.sort((a,b) => new Date(b.commentedDate) - new Date(a.commentedDate));

    return (
        <div className="comment-format" style={{ marginLeft: `${level * 30}px` }}>
            <div className="comment-header">
                {comment.commentedBy} | {formatDate(comment.commentedDate)}
            </div>

            <div className="comment-content">
                {comment.content}
            </div>

            <button className="reply-button" onClick={() => goToNewCommentPage(comment._id, "true", post)}>
                Reply
            </button>

            <hr />

            {replies.map(reply => 
                <Comment key={reply.commentID} comment={reply} comments={comments} goToNewCommentPage={goToNewCommentPage} level={level + 1} post={post}/>
            )}

        </div>
    );
}