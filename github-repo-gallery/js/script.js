const overview = document.querySelector(".overview");
// where the profile information will appear
const username = "asamcclellan";
// github username
const repoList = document.querySelector(".repo-list");
// list where repos display
const repoInfo = document.querySelector('.repos');
// section where all repo info appears
const repoData = document.querySelector('.repo-data');
// section where individual repo data appears
const backButton = document.querySelector('.view-repos');
// back to repos button
const filterInput = document.querySelector('.filter-repos');

const getUserData = async function () {
    const res = await fetch (`https://api.github.com/users/${username}`);
    // surround the template in backticks since we're using a template literal
    const data = await res.json();
    displayUserInfo(data);
    fetchRepos();
}
// API call for user data

getUserData();

const displayUserInfo = function (data) {
    const userInfo = document.createElement("div");
    userInfo.classList.add("user-info");

    userInfo.innerHTML = `
    <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>
    `;
    overview.append(userInfo);
}
// create div with class user-info and building profile info

const fetchRepos = async function () {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=last&perpage=100`);
    const data = await res.json();
    displayRepoInfo(data);
}

const displayRepoInfo = function (repos) {
    filterInput.classList.remove("hide");
    for (let repo of repos) {
        const li = document.createElement("li");
        li.classList.add("repo");
        li.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(li);
    }
}

repoList.addEventListener("click", function (e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        getSpecificRepo(repoName);
    }
})

const getSpecificRepo = async function (repoName) {
    const fetchRepoInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchRepoInfo.json();
    // console.log(repoInfo)

    const fetchLanguages = await fetch(`https://api.github.com/repos/${username}/${repoName}/languages`);
    const languageData = await fetchLanguages.json();
    const languages = [];
    for (let key in languageData) {
        languages.push(key);
    }
    getSpecificRepoInfo(repoInfo, languages);
}

const getSpecificRepoInfo = function (repoInfo, languages) {
    repoData.innerHTML = "";
    const repoDiv = document.createElement("div");
    repoDiv.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`;
    repoData.append(repoDiv);
    repoData.classList.remove("hide");
    backButton.classList.remove("hide");
    repoList.classList.add("hide");
}

backButton.addEventListener("click", function() {
    repoInfo.classList.remove("hide");
    repoData.classList.add("hide");
    backButton.classList.add("hide");
    repoList.classList.remove("hide");
})

filterInput.addEventListener("input", function (e) {
    const search = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const lowerInput = search.toLowerCase();

    for (let repo of repos) {
        const matchingRepo = repo.innerText.toLowerCase();
        if (!matchingRepo.includes(lowerInput)) {
            repo.classList.add("hide");
        } else {
            repo.classList.remove("hide");
        }
    }
})