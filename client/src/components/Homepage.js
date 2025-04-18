import { useState, useMemo } from "react";
import '../stylesheets/Homepage.css';
import { getLatestCommentDate, formatDate, getNumofCommsofPost, getNumofCommsofPostHelper } from "./utils.js";

export default function Homepage({ communities, linkflairs, posts, comments, goToPostPage }) {
    const [sortOrder, changeOrder] = useState("newest");

    /*
    let postnewest = [...posts].sort((a, b) => b.postedDate - a.postedDate);
    let postoldest = [...posts].sort((a, b) => a.postedDate - b.postedDate);
    let postactive = [...posts].sort((a, b) => {
        const latestCommentA = getLatestCommentDate(a, comments);
        const latestCommentB = getLatestCommentDate(b, comments);
        return latestCommentB - latestCommentA;
    });
    */

    //useMemo should update sortedposts whenever sortorder changes, or when a new post or comment is created.
    let sortedposts = useMemo(() => {
        const postscopy = [...posts];
        if (sortOrder === "newest") {
            postscopy.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

        }
        else if (sortOrder === "oldest") {
            postscopy.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
        }
        else if (sortOrder === "active") {
            
            postscopy.sort((a, b) => {
                const latestCommentA = getLatestCommentDate(a, comments);
                const latestCommentB = getLatestCommentDate(b, comments);
                return latestCommentB - latestCommentA;
            })
            
            //postscopy.sort((a, b) => a.postedDate - b.postedDate);
        }
        return postscopy;
    }, [sortOrder, posts, comments]);

    
    return (
        <div className="home-page">
            <div className="home-header">
                <h1>All Posts</h1>
                <div className="post-filters">
                    <button className={sortOrder === "newest" ? "active" : ""} onClick={() => changeOrder("newest")}>Newest</button>
                    <button className={sortOrder === "oldest" ? "active" : ""} onClick={() => changeOrder("oldest")}>Oldest</button>
                    <button className={sortOrder === "active" ? "active" : ""} onClick={() => changeOrder("active")}>Active</button>
                </div>
            </div>

            <p className="post-count">{posts.length} posts</p>

            <hr className="header-divider" />

            <div className="post-list">
                {sortedposts.map((post) => {
                    const comm = communities.find(c => c.postIDs.includes(post._id));
                    const flair = linkflairs.find(f => f._id === post.linkFlairID);
                    const flairsection = (f) => {
                        if (f) {
                            return (
                                <div className="post-flair">
                                    {f.content}
                                </div>
                            );
                        }
                        else {
                            return (<div />);
                        }

                    };

                    return (
                        <a key={post._id} className="post-listing" onClick={() => goToPostPage(post)} href="#">
                            <div className="post-meta">
                                {comm ? comm.name : "Unknown Community"} | {post.postedBy} | {formatDate(post.postedDate)}
                            </div>

                            <h2>
                                {post.title}
                            </h2>

                            {flairsection(flair)}

                            <div className="post-content">
                                {post.content.substring(0, 80)}...
                            </div>

                            <div className="view-comment-count">
                                {post.views} views | {getNumofCommsofPost(post, comments)} comments
                            </div>

                            <hr className="header-divider"></hr>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
