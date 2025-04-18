import { useState, useMemo } from "react";
import '../stylesheets/Communitypage.css';
import { getLatestCommentDate, formatDate, getNumofCommsofPost, getNumofCommsofPostHelper } from "./utils.js";


export default function Communitypage({ community, linkflairs, posts, comments, goToPostPage }) {
    const [sortOrder, changeOrder] = useState("newest");

    let communityposts = posts.filter((post) => community.postIDs.includes(post._id));

    //useMemo should update sortedposts whenever sortorder changes, or when a new post or comment is created.
    let sortedposts = useMemo(() => {
            const postscopy = [...communityposts];
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
        }, [sortOrder, communityposts, comments, posts]);

    //START

    return (
        <div className="community-page">
            <div className="community-header">
                <h1>{community.name}</h1>
                <div className="post-filters">
                    <button className={sortOrder === "newest" ? "active" : ""} onClick={() => changeOrder("newest")}>Newest</button>
                    <button className={sortOrder === "oldest" ? "active" : ""} onClick={() => changeOrder("oldest")}>Oldest</button>
                    <button className={sortOrder === "active" ? "active" : ""} onClick={() => changeOrder("active")}>Active</button>
                </div>
            </div>

            <div className="community-description">
                <p dangerouslySetInnerHTML={{ __html: community.description }}>

                </p>
            </div>

            <p className="community-age">Created {formatDate(community.startDate)}</p>
            <p className="community-post-count">{communityposts.length} posts | {community.memberCount} members</p>

            <hr className="header-divider" />

            <div className="post-list">
                {sortedposts.map((post) => {
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
                                {post.postedBy} | {formatDate(post.postedDate)}
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

    //END

}