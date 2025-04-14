async function uploadBlog(title, content) {
  const blogFilePath = "blogs.json";
  const githubUsername = "ukparangath"; 
  const repoName = "ukparangath.github.io"; 
  const token = "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"; 

  const apiUrl = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${blogFilePath}`;

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3.raw"
    }
  });

  let blogs = [];
  let sha = "";

  if (response.ok) {
    blogs = await response.json();
    const shaResp = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${token}`
      }
    });
    const shaData = await shaResp.json();
    sha = shaData.sha;
  }

  blogs.unshift({ title, content });

  const updatedContent = btoa(unescape(encodeURIComponent(JSON.stringify(blogs, null, 2))));

  const commitMessage = `Added new blog: ${title}`;

  await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json"
    },
    body: JSON.stringify({
      message: commitMessage,
      content: updatedContent,
      sha
    })
  });
}
