

export function formatDate(date) {
  var currentDate = new Date();
  var yearDifference = currentDate.getFullYear() - date.getFullYear();
  var monthDifference = currentDate.getMonth() - date.getMonth();
  var dayDifference = currentDate.getDay() - date.getDay();
  var minDifference = currentDate.getMinutes() - date.getMinutes();
  var secDifference = currentDate.getSeconds() - date.getSeconds();
  if (yearDifference >= 1) {
    return yearDifference + " year(s) ago";
  } else if (monthDifference >= 1) {
    return monthDifference + " month(s) ago";
  } else if (dayDifference >= 1) {
    if (dayDifference === 1) {
      return dayDifference + " day ago";
    } else {
      return dayDifference + " days ago";
    }
  } else if (minDifference >= 1) {
    if (minDifference === 1) {
      return minDifference + " minute ago";
    } else {
      return minDifference + " minutes ago";
    }
  } else if (secDifference >= 1) {
    if (secDifference === 1) {
      return secDifference + " second ago";
    } else {
      return secDifference + " seconds ago";
    }
  }
  else {
    return "0 seconds ago";
  }
}

export function getLatestCommentDate(post, comments) {
  let latestDate = post.postedDate;
  post.commentIDs.forEach(commentID => {
    const comment = comments.find(c => c.commentID === commentID);
    if (comment && comment.commentedDate > latestDate) {
      latestDate = comment.commentedDate;
    }
  });
  return latestDate;
}

export function getNumofCommsofPost(post, comments) {

  const visited = new Set();
  let number = 0;
  for (const comID of post.commentIDs) {
    const comment = comments.find(c => c.commentID === comID);
    if (comment) {
      number += 1;
      number += getNumofCommsofPostHelper(comment, comments, visited);
    }
  }
  return number;
}

function getNumofCommsofPostHelper(comment, comments, visited) {
  if (visited.has(comment.commentID)) return 0;
  visited.add(comment.commentID);

  let number = 0;
  for (const comID of comment.commentIDs) {
    const reply = comments.find(c => c.commentID === comID);
    if (reply) {
      number += 1;
      number += getNumofCommsofPostHelper(reply, comments, visited);
    }
  }

  return number;

}