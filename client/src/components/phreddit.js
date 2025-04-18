import {useState, useEffect} from 'react';
import axios from 'axios';
import Banner from './Banner.js';
import NavBar from './NavBar.js';
import Homepage from './Homepage.js';
import Communitypage from './Communitypage.js';
import Searchpage from './Searchpage.js';
import Postpage from './Postpage.js';
import NewCommunitypage from './NewCommunitypage.js';
import NewPostpage from './NewPostpage.js';
import NewCommentpage from './NewCommentpage.js';

// export default function Phreddit() {
//     const [msg, setMsg] = useState("");
    
//     useEffect(() => {
//         axios.get("http://127.0.0.1:8000/")
//         .then((res) => {
//             setMsg(res.data);
//         })
//         .catch((err) => {
//             console.log("Request failed");
//         });
//     }, []);
    
//     /* 
//     home-page
//     search-page
//     community-page
//     post-page
//     new-post-page
//     new-community-page
//     new-comment-page
//     */

//   return (
//     <h1> {msg} </h1>
//   );
// }

//REMINDER EVERYTHING BELOW *will not* WORK BECAUSE ITS RUNNING ON AN INSTANCE OF Model(), WHICH DOES NOT EXIST HERE
//EVEYRYTHING BELOW HAS TO BE MODIFIED TO FIT DATABASE RETRIEVALS AND DATABASE PUSHES

export default function Phreddit() {

  //CHANGE VERY SINGLE MODEL.DATA TO A STATE VERSION, DO IT FOR COMMENTS, POSTS, AND LINKFLAIRS, AND CHANGE THE INSERITON FOR THESE THINGS
  //using state on model so that react rerender whenever something new is added
  //when we connect to mongoose/databases, we're going to have to rewrite eveyrthing related to 'data', especially pushing new things into the arrays

  const [dataCommunities, setCommunities] = useState([]);
  const [dataPosts, setPosts] = useState([]);
  const [dataComments, setComments] = useState([]);
  const [dataLinkflairs, setLinkflairs] = useState([]);
  const [currentview, setview] = useState({ view: 'home' });
   //fetch data
   useEffect(() => {
    const fetchData = async () => {
      try {
        const [commsRes, postsRes, commentsRes, flairsRes] = await Promise.all([
          axios.get('http://localhost:8000/communities'),
          axios.get('http://localhost:8000/posts'),
          axios.get('http://localhost:8000/comments'),
          axios.get('http://localhost:8000/linkflairs')
        ]);
        setCommunities(commsRes.data);
        setPosts(postsRes.data);
        setComments(commentsRes.data);
        setLinkflairs(flairsRes.data);
      } catch (err) {
        console.error('Error fetching data: ', err);
      }
    };
    fetchData();
   }, []);

   const goingtoPostPage = (post) => {
    setview({view: 'post', post });
  };

  const goingtoCommunityPage = (community) => {
    setview({view: 'community', community});
  };

  // const increaseViewCount = (post) => {
  //   let updatedposts = [...dataPosts];
  //   updatedposts = updatedposts.filter(p => p.postID !== post.postID);
  //   post.views++;
  //   updatedposts.push(post);
  //   setPosts(updatedposts);
  //   setview({...currentview});
  // }

  const increaseViewCount = (post) => {
    const updatedposts = dataPosts.map(p => {
      if (p.postID === post.postID || p._id === post._id) {
        return { ...p, views: p.views + 1 };
      }
      return p;
    });
    setPosts(updatedposts);
    setview({ ...currentview });
  };
  
  const goingtoNewCommentPage = (parentID, isReplyToComment, sourcepost) => {
    setview({view: 'new-comment', parentID, isReplyToComment, sourcepost});
  };

  const submittingPost = (newpost, newflair, selectedcommunity) => {
    //model.data.posts.push(newpost);
    let updatedposts = [...dataPosts, newpost];
    setPosts(updatedposts);
    let commu = dataCommunities.find(c => c.name === selectedcommunity);
    let updatedcommunities = [...dataCommunities];
    updatedcommunities = updatedcommunities.filter(c => c.name !== selectedcommunity);
    if (commu) {
      commu.postIDs.push(newpost.postID);
      updatedcommunities.push(commu);
      setCommunities(updatedcommunities);
    }
    if (newflair) {
      const updatedlf = [...dataLinkflairs, newflair];
      setLinkflairs(updatedlf);
      //model.data.linkFlairs.push(newflair);
    }
    setview({view: 'home'});
  };

  const submittingcommunity = (newcommunity) => {
    //model.data.communities.push(newcommunity);
    const updattedcommunities = [...dataCommunities, newcommunity];
    setCommunities(updattedcommunities);
    setview({view: 'community', community: newcommunity});
  };
  
  let submittingcomment = (newcomment, parentID, isreplyToComment, sourcepost) => {
    //const updatedcomments = [...dataComments, newcomment];
    let pcomm = dataComments.find(c => c.commentID === parentID);
    let ppost = dataPosts.find(p => p.postID === parentID);

    if (pcomm) { //THIS MEANS THAT YOU ARE REPLYING TO A COMMENT
      console.log('parentcomment');
      let parentcomment = dataComments.find(c => c.commentID === parentID);
      if (!parentcomment) {
        console.log('parentcomment');
        return
      };
      let updatecomments = [...dataComments];
      updatecomments = updatecomments.filter(c => c.commentID !== parentID);
      parentcomment.commentIDs.push(newcomment.commentID);
      updatecomments.push(parentcomment);
      updatecomments.push(newcomment);

      setComments(updatecomments);
      setview({ view: 'post', post: sourcepost });
    }
    if (ppost) { //THIS MEANS THAT YOU ARE COMMENTING ON A POST
      console.log('parentpost');
      let parentpost = dataPosts.find(p => p.postID === parentID);
      if (!parentpost) {
        console.log('parentpost');
        return
      };
      let updatedposts = [...dataPosts];
      updatedposts = updatedposts.filter(p => p.postID !== parentID);
      parentpost.commentIDs.push(newcomment.commentID);
      updatedposts.push(parentpost);

      setPosts(updatedposts);

      let updatecomments = [...dataComments];
      updatecomments.push(newcomment);

      setComments(updatecomments);
      setview({ view: 'post', post: parentpost });
    }
    
  };
  
  const gotoSearchpage = (searchquery) => {
    setview({view: 'search', searchquery });
  };

  const gotoNewPostpage = () => {
    setview({view: 'new-post'});
  }

  const goingtoHomePage = () => {
    setview({view: 'home'});
  }

  const goingtoNewCommunityPage = () => {
    setview({view: 'new-community'});
  }

  let maincontent;
  switch (currentview.view) {
    case 'home':
      maincontent = (
        <Homepage communities={dataCommunities} linkflairs={dataLinkflairs} posts={dataPosts} comments={dataComments} goToPostPage={goingtoPostPage}/>
      );
      break;
    case 'search':
      maincontent = (
        <Searchpage communities={dataCommunities} linkflairs={dataLinkflairs} posts={dataPosts} comments={dataComments} goToPostPage={goingtoPostPage} searchcontent={currentview.searchquery}/>
      );
      break;
    case 'community':
      maincontent = (
        <Communitypage community={currentview.community} linkflairs={dataLinkflairs} posts={dataPosts} comments={dataComments} goToPostPage={goingtoPostPage}/>
      );
      break;
    case 'post':
      //goinfrom new comment to post page
      //const commu = dataCommunities.find(c => c.postIDs.includes(currentview.post.postID));
      maincontent = (
        <Postpage goToNewCommentPage={goingtoNewCommentPage} increaseviewcount={increaseViewCount} post={currentview.post} communities={dataCommunities} comments={dataComments} linkflairs={dataLinkflairs}/>
      );
      break;
    case 'new-post':
      maincontent = (
        <NewPostpage submitpost={submittingPost} linkflairs={dataLinkflairs} communities={dataCommunities} posts={dataPosts}/>
      );
      break;
    case 'new-community':
      maincontent = (
        <NewCommunitypage submitcommunity={submittingcommunity} communities={dataCommunities}/>
      );
      break;
    case 'new-comment':
      maincontent = (
        <NewCommentpage isReplyToComment={currentview.isreplyToComment} parentID={currentview.parentID} submitcomment={submittingcomment} sourcepost={currentview.sourcepost}/>
      );
      break;
    default:
      maincontent = <div>SOMETHING IS VERY VERY WRONG</div>
  }

  return (
    <div>
      <Banner goToHomePage={goingtoHomePage} goToCreatePost={gotoNewPostpage} currentView={currentview.view} onSearch={gotoSearchpage}/>
      <NavBar goToHomePage={goingtoHomePage} goToCreateCommunityPage={goingtoNewCommunityPage} goToCommunityPage={goingtoCommunityPage} communities={dataCommunities} currentview={currentview}/>
      {maincontent}
    </div>
  );
}
