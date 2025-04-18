import { useState, useMemo } from "react";
import '../stylesheets/Searchpage.css';
import { getLatestCommentDate, formatDate, getNumofCommsofPost } from "./utils.js";

export default function Searchpage({ communities, linkflairs, posts, comments, goToPostPage, searchcontent }) {
    const [sortOrder, changeOrder] = useState("newest");

    const terms = searchcontent.split(' ').filter(term => term.length > 0);
    let searchposts = [];
    posts.forEach(post => {
        const titleMatch = terms.some(term => post.title.includes(term));
        const contentMatch = terms.some(term => post.content.includes(term));
        const commentMatch = post.commentIDs.some(commentId => {
            const comment = comments.find(c => c.commentID === commentId);
            return comment && terms.some(term => comment.content.includes(term));
          });

        if (titleMatch || contentMatch || commentMatch) {
            searchposts.push(post);
        }
    });
    //posts.filter((post) => community.postIDs.includes(post.postID));

    //useMemo should update sortedposts whenever sortorder changes, or when a new post or comment is created.
    let sortedposts = useMemo(() => {
            const postscopy = [...searchposts];
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
        }, [sortOrder, searchposts, comments, posts]);

    //START

    return (
        <div className="search-page">
            <div className="search-header">
                {
                    sortedposts.length > 0 ? 
                    (<h1>Results for: "{searchcontent}"</h1>) :
                    (<h1>No results for: "{searchcontent}"</h1>)
                }
                <div className="post-filters">
                    <button className={sortOrder === "newest" ? "active" : ""} onClick={() => changeOrder("newest")}>Newest</button>
                    <button className={sortOrder === "oldest" ? "active" : ""} onClick={() => changeOrder("oldest")}>Oldest</button>
                    <button className={sortOrder === "active" ? "active" : ""} onClick={() => changeOrder("active")}>Active</button>
                </div>
            </div>

            <p className="search-post-count">{sortedposts.length} posts found</p>

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
                        <a key={post.postID} className="post-listing" onClick={() => goToPostPage(post)} href="#">
                            <div className="post-meta">
                                {comm.name} | {post.postedBy} | {formatDate(post.postedDate)}
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


            {sortedposts.length === 0 && (
                <p>Things went wrong. Please try again.</p>
            )}
        </div>
    );

}